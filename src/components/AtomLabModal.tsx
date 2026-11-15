import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Atom,
  ChevronDown,
  ChevronUp,
  Info,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Square,
  Volume2,
  X,
} from 'lucide-react';
import type { ElementData, OrbitalBoxStep } from '../types/element';
import {
  buildIndonesianNarrationScript,
  buildOrbitalFillingSteps,
  calculateSubatomicParticles,
  CATEGORY_META,
  getAccurateElectronConfig,
  getDefaultIsotope,
} from '../utils/chemistry';
import { indonesianNarrator, type NarratorState } from '../utils/narrator';
import { AtomThreeCanvas } from './AtomThreeCanvas';
import {
  ORBITAL_VARIANTS,
  OrbitalThreeCanvas,
  type OrbitalType,
} from './OrbitalThreeCanvas';

interface AtomLabModalProps {
  element: ElementData;
  initialMode?: 'atom' | 'orbital';
  onClose: () => void;
}

export function AtomLabModal({
  element,
  initialMode = 'atom',
  onClose,
}: AtomLabModalProps) {
  const [labMode, setLabMode] = useState<'atom' | 'orbital'>(initialMode);
  const [orbitPaused, setOrbitPaused] = useState(false);
  const [selectedMassNumber, setSelectedMassNumber] = useState<number>(() =>
    getDefaultIsotope(element).massNumber
  );

  // Orbital 3D explorer state
  const config = useMemo(() => getAccurateElectronConfig(element.atomicNumber), [element]);
  const highestOrbitalType: OrbitalType = useMemo(() => {
    const last = config.subshells[config.subshells.length - 1];
    return last ? last.l : 's';
  }, [config]);

  const [orbitalType, setOrbitalType] = useState<OrbitalType>(highestOrbitalType);
  const [variantId, setVariantId] = useState<string>(ORBITAL_VARIANTS[highestOrbitalType][0].id);

  // Aufbau / Pauli / Hund step-by-step filling animation state
  const allSteps = useMemo(() => buildOrbitalFillingSteps(config), [config]);
  const [filledCount, setFilledCount] = useState<number>(allSteps.length);
  const [isFillingPlaying, setIsFillingPlaying] = useState<boolean>(false);

  // Narrator state & one-time auto-play ref guard per element
  const [narratorState, setNarratorState] = useState<NarratorState>(() =>
    indonesianNarrator.getState()
  );
  const [showScript, setShowScript] = useState(false);
  const autoNarratedRef = useRef<number | null>(null);

  useEffect(() => {
    const defIso = getDefaultIsotope(element);
    setSelectedMassNumber(defIso.massNumber);
    setOrbitalType(highestOrbitalType);
    setVariantId(ORBITAL_VARIANTS[highestOrbitalType][0].id);
    setFilledCount(allSteps.length);
    setIsFillingPlaying(false);
  }, [element, highestOrbitalType, allSteps.length]);

  useEffect(() => {
    setVariantId(ORBITAL_VARIANTS[orbitalType][0].id);
  }, [orbitalType]);

  const selectedIsotope = useMemo(
    () =>
      element.isotopes.find((iso) => iso.massNumber === selectedMassNumber) ??
      getDefaultIsotope(element),
    [element, selectedMassNumber]
  );

  const particles = useMemo(
    () => calculateSubatomicParticles(element.atomicNumber, selectedIsotope.massNumber, 0),
    [element.atomicNumber, selectedIsotope.massNumber]
  );

  const narrationScript = useMemo(
    () => buildIndonesianNarrationScript(element, selectedIsotope, config),
    [element, selectedIsotope, config]
  );

  // Subscribe to Indonesian narrator & auto-narrate once on expand
  useEffect(() => {
    const unsub = indonesianNarrator.subscribe(setNarratorState);
    return () => {
      unsub();
      indonesianNarrator.stop();
    };
  }, []);

  useEffect(() => {
    if (autoNarratedRef.current !== element.atomicNumber) {
      autoNarratedRef.current = element.atomicNumber;
      indonesianNarrator.speak(narrationScript);
    }
  }, [element.atomicNumber, narrationScript]);

  // Step-by-step Aufbau animation timer
  useEffect(() => {
    if (!isFillingPlaying) return;
    if (filledCount >= allSteps.length) {
      setIsFillingPlaying(false);
      return;
    }
    const intervalMs = allSteps.length > 50 ? 90 : allSteps.length > 20 ? 180 : 320;
    const timer = window.setTimeout(() => {
      setFilledCount((prev) => Math.min(allSteps.length, prev + 1));
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [isFillingPlaying, filledCount, allSteps.length]);

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const activeSteps = useMemo(
    () => allSteps.slice(0, filledCount),
    [allSteps, filledCount]
  );
  const currentStep: OrbitalBoxStep | undefined =
    filledCount > 0 ? allSteps[filledCount - 1] : undefined;

  // Group active steps into box arrays per subshell
  const filledBoxesBySubshell = useMemo(() => {
    const map = new Map<string, Array<{ up: boolean; down: boolean }>>();
    for (const sub of config.subshells) {
      const boxCount = sub.maxElectrons / 2;
      map.set(
        sub.label,
        Array.from({ length: boxCount }, () => ({ up: false, down: false }))
      );
    }
    for (const step of activeSteps) {
      const arr = map.get(step.subshellLabel);
      if (arr && arr[step.orbitalIndex]) {
        if (step.spin === 'up') arr[step.orbitalIndex].up = true;
        else arr[step.orbitalIndex].down = true;
      }
    }
    return map;
  }, [config.subshells, activeSteps]);

  const startOrbitalFillingAnim = () => {
    setFilledCount(0);
    setIsFillingPlaying(true);
  };

  const catMeta = CATEGORY_META[element.category];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Laboratorium Atom 3D ${element.name}`}
      data-testid="atom-lab-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="holo-card-shell flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-cyan-400/60">
        {/* Top holographic stripe */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />

        {/* Header */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 border-b border-slate-300/80 bg-white/85 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-display text-lg font-bold ${catMeta.tileBg} ${catMeta.tileBorder} ${catMeta.textColor}`}
            >
              {element.symbol}
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                Laboratorium Atom &amp; Orbital 3D — {element.name} ({element.symbol})
              </h2>
              <p className="text-xs text-slate-600">
                Isotop {selectedIsotope.symbol} · Z = {particles.atomicNumber} · A ={' '}
                {particles.massNumber} · Konfigurasi {config.condensedNotation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setLabMode('atom')}
              data-testid="mode-atom-btn"
              className={[
                'inline-flex h-8.5 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition',
                labMode === 'atom'
                  ? 'border-cyan-600 bg-cyan-600 text-white shadow-sm'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
              ].join(' ')}
            >
              <Atom className="h-3.5 w-3.5" />
              <span>Model Atom 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setLabMode('orbital')}
              data-testid="expand-orbital-btn"
              className={[
                'inline-flex h-8.5 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition',
                labMode === 'orbital'
                  ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                  : 'border-violet-400 bg-violet-50 text-violet-900 hover:bg-violet-100',
              ].join(' ')}
            >
              <Orbit className="h-3.5 w-3.5" />
              <span>EXPAND ORBITAL 3D</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              data-testid="close-atom-lab-btn"
              aria-label="Tutup laboratorium atom"
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Scrollable Lab Workspace */}
        <div className="silver-scroll flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
            {/* LEFT PANEL: Interactive 3D Canvas + Narrator Bar */}
            <div className="flex flex-col gap-3">
              {labMode === 'atom' ? (
                <div className="overflow-hidden rounded-2xl border border-slate-300 bg-[#eef4fa] shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300/80 bg-white/85 px-3.5 py-2">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                        Proton ({particles.protons})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                        Neutron ({particles.neutrons})
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
                        Elektron ({particles.electrons})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOrbitPaused((p) => !p)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {orbitPaused ? (
                        <>
                          <Play className="h-3 w-3 text-cyan-700" />
                          <span>Putar Orbit</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 text-slate-700" />
                          <span>Jeda Orbit</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="h-[310px] w-full sm:h-[360px]">
                    <AtomThreeCanvas
                      protons={particles.protons}
                      neutrons={particles.neutrons}
                      electrons={particles.electrons}
                      shells={config.shells}
                      symbol={element.symbol}
                      paused={orbitPaused}
                    />
                  </div>

                  <div className="border-t border-slate-300/70 bg-white/80 px-3.5 py-1.5 text-[11px] text-slate-600">
                    Seret untuk memutar model 3D · Gulir untuk zoom · Model kulit Bohr interaktif
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-violet-300 bg-[#eef4fa] shadow-inner">
                  {/* Orbital Type & Sub-orbital Selector */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300/80 bg-white/90 px-3.5 py-2">
                    <div className="flex items-center gap-1">
                      {(['s', 'p', 'd', 'f'] as OrbitalType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setOrbitalType(t)}
                          data-testid={`orbital-type-${t}`}
                          className={[
                            'rounded-md border px-2.5 py-1 font-mono-tabular text-xs font-bold transition',
                            orbitalType === t
                              ? 'border-violet-600 bg-violet-600 text-white'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100',
                          ].join(' ')}
                        >
                          Orbital {t}
                        </button>
                      ))}
                    </div>

                    <select
                      value={variantId}
                      onChange={(e) => setVariantId(e.target.value)}
                      aria-label="Pilih bentuk sub-orbital 3D"
                      data-testid="orbital-variant-select"
                      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800"
                    >
                      {ORBITAL_VARIANTS[orbitalType].map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="h-[300px] w-full sm:h-[340px]">
                    <OrbitalThreeCanvas variantId={variantId} />
                  </div>

                  {/* Scientific Probability Disclaimer */}
                  <div className="flex items-start gap-2 border-t border-violet-200 bg-violet-50/90 px-3.5 py-2 text-[11px] leading-snug text-violet-950">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-700" />
                    <span>
                      <strong>Catatan Mekanika Kuantum:</strong> Visualisasi orbital 3D di atas
                      merupakan daerah probabilitas (kebolehjadian) ditemukannya elektron menurut
                      fungsi gelombang, <em>bukan</em> lintasan orbit tetap seperti planet.
                    </span>
                  </div>
                </div>
              )}

              {/* Indonesian Voice Narrator Control Box */}
              <div className="rounded-xl border border-cyan-400/50 bg-white/90 p-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-cyan-700" />
                    <span className="text-xs font-bold text-slate-900">
                      Narator Otomatis Bahasa Indonesia (id-ID)
                    </span>
                    <span className="font-mono-tabular text-[11px] font-semibold text-cyan-800">
                      ·{' '}
                      {narratorState.status === 'speaking'
                        ? 'Aktif Membaca'
                        : narratorState.status === 'paused'
                          ? 'Dijeda'
                          : narratorState.status === 'unsupported'
                            ? 'Teks Saja'
                            : 'Selesai / Siap'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => indonesianNarrator.speak(narrationScript)}
                      data-testid="lab-narrate-play-btn"
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-600 bg-cyan-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-cyan-500"
                    >
                      <Play className="h-3 w-3" />
                      <span>Putar Ulang</span>
                    </button>

                    {narratorState.status === 'speaking' && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.pause()}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pause className="h-3 w-3" />
                        <span>Jeda</span>
                      </button>
                    )}

                    {narratorState.status === 'paused' && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.resume()}
                        className="inline-flex items-center gap-1 rounded-md border border-cyan-500 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-800"
                      >
                        <Play className="h-3 w-3" />
                        <span>Lanjut</span>
                      </button>
                    )}

                    {(narratorState.status === 'speaking' || narratorState.status === 'paused') && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.stop()}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-800"
                      >
                        <Square className="h-3 w-3" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                </div>

                {narratorState.notice && (
                  <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] text-amber-900">
                    {narratorState.notice}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setShowScript((v) => !v)}
                  className="mt-2 flex w-full items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-cyan-800"
                >
                  <span>Baca Transkrip Narasi Lengkap</span>
                  {showScript ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {showScript && (
                  <p className="mt-1.5 max-h-28 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-700">
                    {narrationScript}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: Subatomic Info, Isotope Explorer, Shells K-Q, & Aufbau/Pauli/Hund */}
            <div className="flex flex-col gap-3.5">
              {/* Subatomic & Isotope Card */}
              <div className="rounded-2xl border border-slate-300/90 bg-white/90 p-3.5 shadow-xs">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-xs font-bold tracking-wider text-slate-900 uppercase">
                    Partikel Subatom &amp; Penjelajah Isotop
                  </h3>

                  {/* Isotope Selector */}
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor="isotope-select"
                      className="text-[11px] font-semibold text-slate-600"
                    >
                      Isotop:
                    </label>
                    <select
                      id="isotope-select"
                      value={selectedIsotope.massNumber}
                      onChange={(e) => setSelectedMassNumber(Number(e.target.value))}
                      data-testid="isotope-select"
                      className="rounded-lg border border-cyan-400 bg-cyan-50/70 px-2.5 py-1 font-mono-tabular text-xs font-bold text-cyan-950 focus:border-cyan-600 focus:outline-none"
                    >
                      {element.isotopes.map((iso) => (
                        <option key={iso.massNumber} value={iso.massNumber}>
                          {iso.symbol} (A = {iso.massNumber})
                          {iso.isStable ? ' · Stabil' : ' · Radioaktif'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6 Subatomic counters */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  <StatBox
                    label="Proton"
                    value={particles.protons}
                    tone="text-red-700 border-red-200 bg-red-50/70"
                    testId="subatomic-protons"
                  />
                  <StatBox
                    label="Neutron"
                    value={particles.neutrons}
                    tone="text-slate-800 border-slate-300 bg-slate-100/80"
                    testId="subatomic-neutrons"
                  />
                  <StatBox
                    label="Elektron"
                    value={particles.electrons}
                    tone="text-sky-700 border-sky-200 bg-sky-50/70"
                    testId="subatomic-electrons"
                  />
                  <StatBox
                    label="Nomor Atom (Z)"
                    value={particles.atomicNumber}
                    tone="text-slate-900 border-slate-200 bg-white"
                  />
                  <StatBox
                    label="Nomor Massa (A)"
                    value={particles.massNumber}
                    tone="text-cyan-900 border-cyan-200 bg-cyan-50/50"
                    testId="subatomic-mass-number"
                  />
                  <StatBox
                    label="Muatan Atom"
                    value="0 (Netral)"
                    tone="text-emerald-800 border-emerald-200 bg-emerald-50/60"
                  />
                </div>

                {/* Isotope details + Ar vs A clarification */}
                <div className="mt-2.5 space-y-1 rounded-lg border border-slate-200 bg-slate-50/90 px-3 py-2 text-[11px] text-slate-700">
                  <div>
                    <strong>Detail Isotop {selectedIsotope.symbol}:</strong>{' '}
                    {selectedIsotope.isStable
                      ? `Stabil (${selectedIsotope.abundance ?? 'alami'})`
                      : `Radioaktif (waktu paruh: ${selectedIsotope.halfLife ?? 'tidak stabil'})`}
                    {selectedIsotope.notes ? ` — ${selectedIsotope.notes}` : ''}
                  </div>
                  <div className="text-slate-600">
                    <strong>Perbedaan Ar vs A:</strong> Massa atom relatif{' '}
                    <span className="font-mono-tabular font-semibold">Ar = {element.atomicMass}</span>{' '}
                    merupakan rata-rata tertimbang isotop di alam, sedangkan nomor massa{' '}
                    <span className="font-mono-tabular font-semibold">A = {particles.massNumber}</span>{' '}
                    adalah jumlah bilangan bulat proton + neutron pada isotop{' '}
                    <span className="font-mono-tabular">{selectedIsotope.symbol}</span>.
                  </div>
                </div>
              </div>

              {/* Electron Shells K - Q */}
              <div className="rounded-2xl border border-slate-300/90 bg-white/90 p-3.5 shadow-xs">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-display text-xs font-bold tracking-wider text-slate-900 uppercase">
                    Distribusi Kulit Elektron (Model Bohr K–Q)
                  </h3>
                  <span className="font-mono-tabular text-[11px] font-semibold text-slate-600">
                    Total: {particles.electrons} e⁻
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {config.shells.map((s) => {
                    const pct = Math.round((s.electrons / s.maxCapacity) * 100);
                    return (
                      <div
                        key={s.shellName}
                        className="rounded-lg border border-slate-200 bg-slate-50/90 p-2 text-center"
                      >
                        <div className="font-display text-xs font-bold text-cyan-900">
                          Kulit {s.shellName} (n={s.n})
                        </div>
                        <div className="font-mono-tabular mt-0.5 text-base font-bold text-slate-900">
                          {s.electrons}
                        </div>
                        <div className="font-mono-tabular text-[10px] text-slate-500">
                          Maks {s.maxCapacity}
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-sky-600"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Electron Configuration + Animated Aufbau / Pauli / Hund Filling */}
              <div className="rounded-2xl border border-slate-300/90 bg-white/90 p-3.5 shadow-xs">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xs font-bold tracking-wider text-slate-900 uppercase">
                      Konfigurasi &amp; Pengisian Orbital (Aufbau · Pauli · Hund)
                    </h3>
                    <p className="font-mono-tabular mt-0.5 text-xs font-bold text-cyan-950">
                      {config.fullNotation}
                    </p>
                  </div>

                  {/* Animation Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={startOrbitalFillingAnim}
                      data-testid="play-aufbau-btn"
                      className="inline-flex items-center gap-1 rounded-md border border-violet-600 bg-violet-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-violet-500"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Animasi Isi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFillingPlaying((p) => !p)}
                      disabled={filledCount >= allSteps.length && !isFillingPlaying}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-45"
                    >
                      {isFillingPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsFillingPlaying(false);
                        setFilledCount((c) => Math.min(allSteps.length, c + 1));
                      }}
                      disabled={filledCount >= allSteps.length}
                      title="Langkah berikutnya"
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-45"
                    >
                      <SkipForward className="h-3 w-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsFillingPlaying(false);
                        setFilledCount(allSteps.length);
                      }}
                      title="Tampilkan penuh"
                      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {config.uncertaintyNote && (
                  <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-950">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                    <span>{config.uncertaintyNote}</span>
                  </div>
                )}

                {/* Active Rule Readout */}
                <div className="mb-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700">
                  <span className="font-mono-tabular font-bold text-violet-900">
                    Elektron ke-{filledCount}/{allSteps.length}:
                  </span>{' '}
                  {currentStep
                    ? currentStep.ruleNote
                    : 'Klik "Animasi Isi" untuk melihat pengisian elektron satu demi satu sesuai Aufbau, Pauli, dan Hund.'}
                </div>

                {/* Orbital Boxes */}
                <div className="silver-scroll flex max-h-52 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/70 p-2">
                  {config.subshells.map((sub) => {
                    const boxes = filledBoxesBySubshell.get(sub.label) ?? [];
                    const isFocused = currentStep?.subshellLabel === sub.label && isFillingPlaying;
                    return (
                      <div
                        key={sub.label}
                        className={[
                          'rounded-md border px-2 py-1',
                          isFocused
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-slate-300/80 bg-white',
                        ].join(' ')}
                      >
                        <div className="mb-1 text-center font-mono-tabular text-[10px] font-bold text-slate-700">
                          {sub.label}
                        </div>
                        <div className="flex gap-0.5">
                          {boxes.map((box, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex h-6 w-6 items-center justify-center rounded-xs border border-slate-400/80 bg-slate-50 font-mono-tabular text-[11px] font-bold"
                            >
                              <span className={box.up ? 'text-sky-700' : 'text-transparent'}>↑</span>
                              <span className={box.down ? 'text-violet-700' : 'text-transparent'}>
                                ↓
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
  testId,
}: {
  label: string;
  value: number | string;
  tone: string;
  testId?: string;
}) {
  return (
    <div className={`rounded-lg border px-2 py-1.5 text-center ${tone}`}>
      <div className="text-[10px] font-semibold opacity-80">{label}</div>
      <div data-testid={testId} className="font-mono-tabular mt-0.5 text-sm font-bold">
        {value}
      </div>
    </div>
  );
}
