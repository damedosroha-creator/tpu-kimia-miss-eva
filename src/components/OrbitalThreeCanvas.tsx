import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type OrbitalType = 's' | 'p' | 'd' | 'f';

export interface OrbitalVariantOption {
  id: string;
  label: string;
  type: OrbitalType;
}

export const ORBITAL_VARIANTS: Record<OrbitalType, OrbitalVariantOption[]> = {
  s: [{ id: 's', label: 'Orbital s (Bola Simetris)', type: 's' }],
  p: [
    { id: 'pz', label: 'Orbital pz (2 Lobus Z)', type: 'p' },
    { id: 'px', label: 'Orbital px (2 Lobus X)', type: 'p' },
    { id: 'py', label: 'Orbital py (2 Lobus Y)', type: 'p' },
  ],
  d: [
    { id: 'dz2', label: 'Orbital dz² (Lobus & Cincin Torus)', type: 'd' },
    { id: 'dx2y2', label: 'Orbital dx²-y² (4 Lobus Sumbu)', type: 'd' },
    { id: 'dxy', label: 'Orbital dxy (4 Lobus Diagonal)', type: 'd' },
    { id: 'dxz', label: 'Orbital dxz (4 Lobus XZ)', type: 'd' },
    { id: 'dyz', label: 'Orbital dyz (4 Lobus YZ)', type: 'd' },
  ],
  f: [
    { id: 'fxyz', label: 'Orbital fxyz (8 Lobus Kompleks)', type: 'f' },
    { id: 'fz3', label: 'Orbital fz³ (Lobus & Cincin Ganda)', type: 'f' },
    { id: 'fxz2', label: 'Orbital fxz² (6 Lobus Kompleks)', type: 'f' },
  ],
};

function evalSphericalHarmonic(variantId: string, theta: number, phi: number): number {
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);

  const x = sinT * cosP;
  const y = sinT * sinP;
  const z = cosT;

  switch (variantId) {
    case 's':
      return 0.72;
    case 'pz':
      return z;
    case 'px':
      return x;
    case 'py':
      return y;
    case 'dz2':
      return 0.55 * (3 * z * z - 1);
    case 'dx2y2':
      return 0.95 * (x * x - y * y);
    case 'dxy':
      return 1.85 * x * y;
    case 'dxz':
      return 1.85 * x * z;
    case 'dyz':
      return 1.85 * y * z;
    case 'fxyz':
      return 3.8 * x * y * z;
    case 'fz3':
      return 0.65 * z * (5 * z * z - 3);
    case 'fxz2':
      return 1.15 * x * (5 * z * z - 1);
    default:
      return 0.72;
  }
}

function detectSoftwareWebGL(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return false;
    const rendererStr = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '');
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
  } catch {
    return false;
  }
}

interface OrbitalThreeCanvasProps {
  variantId: string;
}

export function OrbitalThreeCanvas({ variantId }: OrbitalThreeCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let controls: OrbitControls | null = null;
    let pmremGenerator: THREE.PMREMGenerator | null = null;
    let envRT: THREE.WebGLRenderTarget | null = null;
    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const disposableGeometries: THREE.BufferGeometry[] = [];
    const disposableMaterials: THREE.Material[] = [];

    try {
      const width = Math.max(260, container.clientWidth || 520);
      const height = Math.max(220, container.clientHeight || 360);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      const isSoftwareGl = detectSoftwareWebGL(renderer.getContext());
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      scene = new THREE.Scene();
      scene.background = new THREE.Color('#eef4fa');

      pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      envRT = pmremGenerator.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      roomEnv.dispose();

      scene.add(new THREE.HemisphereLight(0xf0f9ff, 0x94a3b8, 0.95));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
      keyLight.position.set(8, 12, 10);
      scene.add(keyLight);

      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(4.2, 3.0, 5.2);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.07;

      // Subtle Cartesian axes reference
      const axesHelper = new THREE.AxesHelper(3.1);
      scene.add(axesHelper);

      const orbitalGroup = new THREE.Group();
      scene.add(orbitalGroup);

      // Positive & Negative Phase lobe geometries built from spherical harmonics sampling
      const segTheta = isSoftwareGl ? 44 : 72;
      const segPhi = isSoftwareGl ? 64 : 112;
      const posGeo = new THREE.BufferGeometry();
      const negGeo = new THREE.BufferGeometry();
      disposableGeometries.push(posGeo, negGeo);

      const buildPhaseMesh = (signFilter: 1 | -1, targetGeo: THREE.BufferGeometry) => {
        const vertices: number[] = [];
        const indices: number[] = [];
        const scale = 2.4;

        for (let it = 0; it <= segTheta; it++) {
          const theta = (it / segTheta) * Math.PI;
          for (let ip = 0; ip <= segPhi; ip++) {
            const phi = (ip / segPhi) * Math.PI * 2;
            const amp = evalSphericalHarmonic(variantId, theta, phi);
            const r = amp * signFilter > 0 ? Math.abs(amp) * scale : 0.001;

            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.cos(theta);
            const z = r * Math.sin(theta) * Math.sin(phi);
            vertices.push(x, y, z);
          }
        }

        const stride = segPhi + 1;
        for (let it = 0; it < segTheta; it++) {
          for (let ip = 0; ip < segPhi; ip++) {
            const a = it * stride + ip;
            const b = (it + 1) * stride + ip;
            const c = (it + 1) * stride + (ip + 1);
            const d = it * stride + (ip + 1);
            indices.push(a, b, d);
            indices.push(b, c, d);
          }
        }

        targetGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        targetGeo.setIndex(indices);
        targetGeo.computeVertexNormals();
      };

      buildPhaseMesh(1, posGeo);
      buildPhaseMesh(-1, negGeo);

      const posMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0284c7'),
        emissive: new THREE.Color('#0ea5e9'),
        emissiveIntensity: 0.18,
        roughness: 0.25,
        metalness: 0.15,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
      });

      const negMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#7c3aed'),
        emissive: new THREE.Color('#8b5cf6'),
        emissiveIntensity: 0.18,
        roughness: 0.25,
        metalness: 0.15,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
      });
      disposableMaterials.push(posMat, negMat);

      orbitalGroup.add(new THREE.Mesh(posGeo, posMat));
      if (variantId !== 's') {
        orbitalGroup.add(new THREE.Mesh(negGeo, negMat));
      }

      // Probability point cloud accent
      const pointCount = isSoftwareGl ? 320 : 700;
      const pointCoords: number[] = [];
      const pointColors: number[] = [];
      const cPos = new THREE.Color('#0369a1');
      const cNeg = new THREE.Color('#6d28d9');

      for (let i = 0; i < pointCount; i++) {
        const u = ((i * 73) % 1000) / 1000;
        const v = ((i * 197) % 1000) / 1000;
        const theta = Math.acos(2 * u - 1);
        const phi = 2 * Math.PI * v;
        const amp = evalSphericalHarmonic(variantId, theta, phi);
        const radialBias = 0.65 + (((i * 31) % 100) / 100) * 0.45;
        const r = Math.abs(amp) * 2.45 * radialBias;
        if (r < 0.22) continue;

        pointCoords.push(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.cos(theta),
          r * Math.sin(theta) * Math.sin(phi)
        );
        const col = amp >= 0 ? cPos : cNeg;
        pointColors.push(col.r, col.g, col.b);
      }

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pointCoords, 3));
      pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));
      const pointsMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
      });
      disposableGeometries.push(pointsGeo);
      disposableMaterials.push(pointsMat);
      orbitalGroup.add(new THREE.Points(pointsGeo, pointsMat));

      // Nucleus origin dot
      const originGeo = new THREE.SphereGeometry(0.11, 12, 12);
      const originMat = new THREE.MeshBasicMaterial({ color: '#0f172a' });
      disposableGeometries.push(originGeo);
      disposableMaterials.push(originMat);
      orbitalGroup.add(new THREE.Mesh(originGeo, originMat));

      let lastTime = performance.now();

      const afterDraw = (fn: () => void) => {
        if (disposed) return;
        if (isSoftwareGl) {
          rafId = requestAnimationFrame(() => {
            if (!disposed) timerId = setTimeout(fn, 20);
          });
        } else {
          rafId = requestAnimationFrame(fn);
        }
      };

      const tick = () => {
        if (disposed || !renderer || !scene || !camera || !controls) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        orbitalGroup.rotation.y += dt * 0.35;
        controls.update();
        renderer.render(scene, camera);
        afterDraw(tick);
      };

      const resizeObserver = new ResizeObserver((entries) => {
        if (disposed || !renderer || !camera) return;
        for (const entry of entries) {
          const w = Math.max(240, Math.floor(entry.contentRect.width));
          const h = Math.max(200, Math.floor(entry.contentRect.height));
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      });
      resizeObserver.observe(container);

      setFallback(false);
      tick();

      return () => {
        disposed = true;
        resizeObserver.disconnect();
        cancelAnimationFrame(rafId);
        if (timerId) clearTimeout(timerId);
        controls?.dispose();
        disposableGeometries.forEach((g) => g.dispose());
        disposableMaterials.forEach((m) => m.dispose());
        envRT?.dispose();
        pmremGenerator?.dispose();
        renderer?.dispose();
        if (renderer?.domElement && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch {
      setFallback(true);
      return () => {
        disposed = true;
      };
    }
  }, [variantId]);

  if (fallback) {
    return (
      <div
        data-testid="orbital-3d-canvas"
        className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-4 text-center"
      >
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/70 to-violet-500/70 blur-[1px]" />
        <span className="mt-2 text-xs font-semibold text-slate-700">
          Representasi Orbital ({variantId})
        </span>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      data-testid="orbital-3d-canvas"
      data-orbital={variantId}
      className="h-full w-full cursor-grab active:cursor-grabbing"
    />
  );
}
