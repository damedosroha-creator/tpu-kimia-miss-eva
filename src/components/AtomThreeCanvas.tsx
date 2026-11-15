import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { ShellSummary } from '../types/element';

interface AtomThreeCanvasProps {
  protons: number;
  neutrons: number;
  electrons: number;
  shells: ShellSummary[];
  symbol: string;
  paused?: boolean;
}

interface ElectronOrbitNode {
  mesh: THREE.Mesh;
  pivot: THREE.Group;
  radius: number;
  baseAngle: number;
  speed: number;
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

export function AtomThreeCanvas({
  protons,
  neutrons,
  electrons,
  shells,
  symbol,
  paused = false,
}: AtomThreeCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const [webglFallback, setWebglFallback] = useState(false);

  // Mount Three.js scene and rebuild clean nucleon/shell geometry when counts change
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
      const width = Math.max(280, container.clientWidth || 560);
      const height = Math.max(240, container.clientHeight || 380);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });

      const isSoftwareGl = detectSoftwareWebGL(renderer.getContext());
      const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
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

      // Lighting
      const hemi = new THREE.HemisphereLight(0xf0f9ff, 0x94a3b8, 0.9);
      scene.add(hemi);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.35);
      dirLight.position.set(10, 14, 12);
      scene.add(dirLight);

      const cyanAccentLight = new THREE.PointLight(0x06b6d4, 1.1, 45);
      cyanAccentLight.position.set(-12, -8, 10);
      scene.add(cyanAccentLight);

      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
      const outerRadius = 2.6 + Math.max(1, shells.length) * 1.45;
      camera.position.set(0, outerRadius * 0.55, outerRadius * 2.05);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 4;
      controls.maxDistance = outerRadius * 4;

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // 1. Nucleus cluster (Protons = Red spheres, Neutrons = Gray spheres)
      const nucleusGroup = new THREE.Group();
      rootGroup.add(nucleusGroup);

      const totalNucleons = Math.max(1, protons + neutrons);
      const nucleonRadius = totalNucleons > 140 ? 0.145 : totalNucleons > 60 ? 0.17 : 0.21;
      const nucleonGeo = new THREE.SphereGeometry(nucleonRadius, isSoftwareGl ? 12 : 18, isSoftwareGl ? 10 : 16);
      disposableGeometries.push(nucleonGeo);

      const protonMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dc2626'),
        roughness: 0.28,
        metalness: 0.25,
      });
      const neutronMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#64748b'),
        roughness: 0.38,
        metalness: 0.35,
      });
      disposableMaterials.push(protonMat, neutronMat);

      const protonMesh = new THREE.InstancedMesh(nucleonGeo, protonMat, Math.max(1, protons));
      const neutronMesh =
        neutrons > 0 ? new THREE.InstancedMesh(nucleonGeo, neutronMat, neutrons) : null;

      // Golden-spiral spherical packing inside nucleus volume
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const clusterScale = Math.cbrt(totalNucleons) * nucleonRadius * 0.88;
      const dummy = new THREE.Object3D();

      let pIdx = 0;
      let nIdx = 0;
      for (let i = 0; i < totalNucleons; i++) {
        const frac = (i + 0.5) / totalNucleons;
        const r = totalNucleons === 1 ? 0 : clusterScale * Math.cbrt(frac);
        const y = 1 - 2 * frac;
        const radial = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;

        dummy.position.set(
          Math.cos(theta) * radial * r,
          y * r,
          Math.sin(theta) * radial * r
        );
        dummy.updateMatrix();

        // Interleave protons & neutrons evenly
        const assignProton =
          pIdx < protons && (nIdx >= neutrons || (i % 2 === 0 && pIdx / protons <= nIdx / Math.max(1, neutrons) + 0.1));

        if (assignProton) {
          protonMesh.setMatrixAt(pIdx++, dummy.matrix);
        } else if (neutronMesh && nIdx < neutrons) {
          neutronMesh.setMatrixAt(nIdx++, dummy.matrix);
        } else if (pIdx < protons) {
          protonMesh.setMatrixAt(pIdx++, dummy.matrix);
        }
      }
      protonMesh.instanceMatrix.needsUpdate = true;
      nucleusGroup.add(protonMesh);
      if (neutronMesh) {
        neutronMesh.instanceMatrix.needsUpdate = true;
        nucleusGroup.add(neutronMesh);
      }

      // 2. Bohr Electron Shells (K .. Q) & Orbiting Blue Glowing Electrons
      const electronNodes: ElectronOrbitNode[] = [];
      const electronGeo = new THREE.SphereGeometry(0.19, isSoftwareGl ? 10 : 16, isSoftwareGl ? 10 : 14);
      const electronMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0369a1'),
        emissive: new THREE.Color('#0ea5e9'),
        emissiveIntensity: 1.15,
        roughness: 0.15,
        metalness: 0.2,
      });
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#64748b'),
        transparent: true,
        opacity: 0.62,
      });
      disposableGeometries.push(electronGeo);
      disposableMaterials.push(electronMat, ringMat);

      let placedElectrons = 0;
      shells.forEach((shell, sIdx) => {
        const shellRadius = 2.1 + sIdx * 1.38;
        const pivot = new THREE.Group();
        // Gentle distinct 3D inclination per shell for clear spatial depth
        pivot.rotation.x = (sIdx % 2 === 0 ? 1 : -1) * (0.28 + sIdx * 0.11);
        pivot.rotation.y = sIdx * 0.42;
        rootGroup.add(pivot);

        const torusGeo = new THREE.TorusGeometry(shellRadius, 0.022, 8, isSoftwareGl ? 48 : 80);
        disposableGeometries.push(torusGeo);
        const torus = new THREE.Mesh(torusGeo, ringMat);
        torus.rotation.x = Math.PI / 2;
        pivot.add(torus);

        const countInShell = Math.min(shell.electrons, Math.max(0, electrons - placedElectrons));
        placedElectrons += countInShell;

        const speed = (1.25 / (1 + sIdx * 0.35)) * (sIdx % 2 === 0 ? 1 : -1);

        for (let eIdx = 0; eIdx < countInShell; eIdx++) {
          const angle = (eIdx / Math.max(1, countInShell)) * Math.PI * 2;
          const eMesh = new THREE.Mesh(electronGeo, electronMat);
          eMesh.position.set(Math.cos(angle) * shellRadius, 0, Math.sin(angle) * shellRadius);
          pivot.add(eMesh);

          electronNodes.push({
            mesh: eMesh,
            pivot,
            radius: shellRadius,
            baseAngle: angle,
            speed,
          });
        }
      });

      let lastTime = performance.now();
      let elapsed = 0;

      const afterDraw = (fn: () => void) => {
        if (disposed) return;
        if (isSoftwareGl) {
          rafId = requestAnimationFrame(() => {
            if (!disposed) timerId = setTimeout(fn, 16);
          });
        } else {
          rafId = requestAnimationFrame(fn);
        }
      };

      const renderFrame = () => {
        if (disposed || !renderer || !scene || !camera || !controls) return;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        if (!pausedRef.current) {
          elapsed += dt;
          nucleusGroup.rotation.y += dt * 0.35;
          nucleusGroup.rotation.x += dt * 0.16;

          for (const node of electronNodes) {
            const a = node.baseAngle + elapsed * node.speed;
            node.mesh.position.set(Math.cos(a) * node.radius, 0, Math.sin(a) * node.radius);
          }
        }
        controls.update();
        renderer.render(scene, camera);
        afterDraw(renderFrame);
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

      setWebglFallback(false);
      renderFrame();

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
      setWebglFallback(true);
      return () => {
        disposed = true;
      };
    }
  }, [protons, neutrons, electrons, shells, symbol]);

  if (webglFallback) {
    return (
      <AtomFallback2D
        protons={protons}
        neutrons={neutrons}
        electrons={electrons}
        shells={shells}
        paused={paused}
      />
    );
  }

  return (
    <div
      ref={hostRef}
      data-testid="atom-3d-canvas"
      data-protons={protons}
      data-neutrons={neutrons}
      data-electrons={electrons}
      className="h-full w-full cursor-grab active:cursor-grabbing"
    />
  );
}

function AtomFallback2D({
  protons,
  neutrons,
  electrons,
  shells,
  paused,
}: {
  protons: number;
  neutrons: number;
  electrons: number;
  shells: ShellSummary[];
  paused: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let angleOffset = 0;
    const draw = () => {
      const w = (canvas.width = canvas.clientWidth || 500);
      const h = (canvas.height = canvas.clientHeight || 360);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#eef4fa';
      ctx.fillRect(0, 0, w, h);

      const maxR = Math.min(w, h) * 0.44;
      const stepR = maxR / Math.max(1, shells.length + 0.5);

      // Nucleus
      const total = protons + neutrons;
      for (let i = 0; i < Math.min(total, 60); i++) {
        const a = i * 2.4;
        const r = Math.sqrt(i / 60) * 18;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#64748b';
        ctx.fill();
      }

      if (!pausedRef.current) angleOffset += 0.015;
      let placed = 0;
      shells.forEach((shell, sIdx) => {
        const r = 30 + sIdx * stepR;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148,163,184,0.65)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        const count = Math.min(shell.electrons, Math.max(0, electrons - placed));
        placed += count;
        for (let e = 0; e < count; e++) {
          const theta = (e / Math.max(1, count)) * Math.PI * 2 + angleOffset / (1 + sIdx * 0.3);
          ctx.beginPath();
          ctx.arc(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [protons, neutrons, electrons, shells]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="atom-3d-canvas"
      data-protons={protons}
      data-neutrons={neutrons}
      data-electrons={electrons}
      className="h-full w-full"
    />
  );
}
