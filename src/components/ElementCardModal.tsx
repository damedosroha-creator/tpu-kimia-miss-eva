import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Atom,
  ChevronDown,
  ChevronUp,
  Compass,
  FlaskConical,
  GitCompareArrows,
  Pause,
  Play,
  Sparkles,
  Square,
  Thermometer,
  Volume2,
  X,
} from 'lucide-react';
import type { ElementData } from '../types/element';
import {
  buildIndonesianNarrationScript,
  CATEGORY_META,
  getAccurateElectronConfig,
  getCompactOxidationStates,
  getDefaultIsotope,
  getStableIsotopeMassInfo,
} from '../utils/chemistry';
import { indonesianNarrator, type NarratorState } from '../utils/narrator';
import { SpecimenImage } from './SpecimenImage';

interface ElementCardModalProps {
  element: ElementData;
  onClose: () => void;
  onOpenAtomLab: (element: ElementData) => void;
  onCompareElement: (element: ElementData) => void;
}

type SectionKey = 'identitas' | 'fisika' | 'kimia' | 'alam' | 'manfaat';

const SECTION_TABS: ReadonlyArray<{
  key: SectionKey;
  title: string;
  shortTitle: string;
  icon: typeof Atom;
}> = [
  { key: 'identitas', title: 'A. Identitas Unsur', shortTitle: 'A. Identitas', icon: Atom },
  { key: 'fisika', title: 'B. Sifat Fisika', shortTitle: 'B. Fisika', icon: Thermometer },
  { key: 'kimia', title: 'C. Sifat Kimia', shortTitle: 'C. Kimia', icon: FlaskConical },
  { key: 'alam', title: 'D. Keberadaan di Alam', shortTitle: 'D. di Alam', icon: Compass },
  { key: 'manfaat', title: 'E. Manfaat & Fakta', shortTitle: 'E. Manfaat', icon: Sparkles },
];

export function ElementCardModal({
  element,
  onClose,
  onOpenAtomLab,
  onCompareElement,
}: ElementCardModalProps) {
  const [activeTab, setActiveTab] = useState<SectionKey>('identitas');
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [showTranscript, setShowTranscript] = useState(false);
  const [narratorState, setNarratorState] = useState<NarratorState>(() =>
    indonesianNarrator.getState()
  );

  const catMeta = CATEGORY_META[element.category];
  const config = useMemo(() => getAccurateElectronConfig(element.atomicNumber), [element]);
  const defaultIsotope = useMemo(() => getDefaultIsotope(element), [element]);
  const stableInfo = useMemo(() => getStableIsotopeMassInfo(element), [element]);
  const compactOx = useMemo(
    () => getCompactOxidationStates(element.oxidationStates),
    [element.oxidationStates]
  );
  const narrationScript = useMemo(
    () => buildIndonesianNarrationScript(element, defaultIsotope, config),
    [element, defaultIsotope, config]
  );

  useEffect(() => {
    const unsub = indonesianNarrator.subscribe(setNarratorState);
    return () => {
      unsub();
      indonesianNarrator.stop();
    };
  }, []);

  useEffect(() => {
    setActiveTab('identitas');
    indonesianNarrator.stop();
  }, [element.atomicNumber]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 3.5).toFixed(2)),
      ry: Number((nx * 3.5).toFixed(2)),
    });
  };

  const resetTilt = () => setTilt({ rx: 0, ry: 0 });

  const handleListen = () => {
    indonesianNarrator.speak(narrationScript);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-2.5 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`Kartu Hologram Unsur ${element.name}`}
      data-testid="element-card-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-5xl"
        style={{ perspective: '1400px' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: 'transform 180ms ease-out',
          }}
          className="holo-card-shell relative flex max-h-[92vh] flex-col overflow-hidden rounded-2xl border border-cyan-400/50"
        >
          {/* Holographic iridescent top accent edge */}
          <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500" />

          {/* Header Bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-300/80 bg-white/75 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border shadow-sm ${catMeta.tileBg} ${catMeta.tileBorder}`}
              >
                <span className="font-mono-tabular text-[10px] leading-none font-bold text-slate-700">
                  {element.atomicNumber}
                </span>
                <span className={`font-display text-xl leading-tight font-bold ${catMeta.textColor}`}>
                  {element.symbol}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                    {element.name}
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    ({element.internationalName})
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {catMeta.label} · {element.groupLabel} · Periode {element.period} · Blok{' '}
                  {element.block} · Ar {element.atomicMass} · Isotop{' '}
                  {stableInfo.hasStableIsotope ? 'Stabil' : 'Terstabil'} A={stableInfo.displayLabel}{' '}
                  · Biloks {compactOx}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCompareElement(element)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:bg-cyan-50"
              >
                <GitCompareArrows className="h-3.5 w-3.5 text-cyan-700" />
                <span className="hidden sm:inline">Bandingkan</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAtomLab(element)}
                data-testid="open-atom-lab-btn"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cyan-600 bg-gradient-to-r from-cyan-600 to-sky-600 px-3.5 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-sky-500"
              >
                <Atom className="h-4 w-4" />
                <span>LIHAT MODEL ATOM 3D</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                data-testid="close-element-card-btn"
                aria-label="Tutup kartu unsur"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="silver-scroll flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[290px_1fr]">
              {/* Left Column: Realistic Specimen Photo + Holographic Quick Spec + Narrator */}
              <div className="flex flex-col gap-3.5">
                <SpecimenImage element={element} className="aspect-[4/3] w-full" />

                {/* Indonesian Voice Narrator Panel */}
                <div className="rounded-xl border border-cyan-400/50 bg-gradient-to-br from-white via-cyan-50/50 to-slate-100 p-3 shadow-xs">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Volume2 className="h-4 w-4 text-cyan-700" />
                      <span>Narator Suara (id-ID)</span>
                    </div>
                    <span className="font-mono-tabular text-[10px] font-semibold text-cyan-800">
                      {narratorState.status === 'speaking'
                        ? 'Sedang Membaca'
                        : narratorState.status === 'paused'
                          ? 'Dijeda'
                          : narratorState.status === 'unsupported'
                            ? 'Teks Saja'
                            : 'Siap'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleListen}
                      data-testid="listen-narration-btn"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-cyan-600 bg-cyan-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-cyan-500"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>DENGARKAN PENJELASAN</span>
                    </button>

                    {narratorState.status === 'speaking' && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.pause()}
                        aria-label="Jeda narasi"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pause className="h-3.5 w-3.5" />
                        <span>Jeda</span>
                      </button>
                    )}

                    {narratorState.status === 'paused' && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.resume()}
                        aria-label="Lanjutkan narasi"
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500 bg-cyan-50 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-800 hover:bg-cyan-100"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Lanjut</span>
                      </button>
                    )}

                    {(narratorState.status === 'speaking' || narratorState.status === 'paused') && (
                      <button
                        type="button"
                        onClick={() => indonesianNarrator.stop()}
                        aria-label="Hentikan narasi"
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800 hover:bg-rose-100"
                      >
                        <Square className="h-3 w-3" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>

                  {narratorState.notice && (
                    <p className="mt-2 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] leading-snug text-amber-900">
                      {narratorState.notice}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowTranscript((v) => !v)}
                    className="mt-2 flex w-full items-center justify-between text-[11px] font-semibold text-slate-600 hover:text-cyan-800"
                  >
                    <span>Transkrip Penjelasan Unsur</span>
                    {showTranscript ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>

                  {showTranscript && (
                    <p className="mt-1.5 max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white/90 p-2 text-[11px] leading-relaxed text-slate-700">
                      {narrationScript}
                    </p>
                  )}
                </div>

                {/* Quick Atomic Snapshot */}
                <div className="rounded-xl border border-slate-300/80 bg-white/85 p-3 text-xs">
                  <div className="mb-1.5 font-semibold text-slate-700">
                    Ringkasan Struktur Elektron
                  </div>
                  <div className="font-mono-tabular text-xs font-bold text-cyan-900">
                    {config.condensedNotation}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 font-mono-tabular text-[11px] text-slate-700">
                    {config.shells.map((s) => (
                      <span
                        key={s.shellName}
                        className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5"
                      >
                        {s.shellName}: {s.electrons}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: 5 Required Sections (A - E) */}
              <div className="flex min-w-0 flex-col gap-3">
                {/* Section Switcher Tabs */}
                <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2.5">
                  {SECTION_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        data-testid={`card-tab-${tab.key}`}
                        className={[
                          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition',
                          active
                            ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Section Body */}
                <div className="rounded-xl border border-slate-300/80 bg-white/90 p-4 shadow-xs">
                  {activeTab === 'identitas' && (
                    <SectionGrid
                      title="A. Identitas Unsur"
                      items={[
                        { label: 'Nama Unsur (Indonesia)', value: element.name },
                        { label: 'Nama Internasional', value: element.internationalName },
                        { label: 'Simbol Kimia', value: element.symbol },
                        { label: 'Nomor Atom (Z)', value: String(element.atomicNumber) },
                        {
                          label: 'Massa Atom Relatif (Ar)',
                          value: `${element.atomicMass}${element.isMassApproximate ? ' (perkiraan isotop terstabil)' : ''}`,
                        },
                        {
                          label: 'Nomor Massa Isotop Stabil (A)',
                          value: `${stableInfo.displayLabel} (${stableInfo.isotopeSymbol}${stableInfo.hasStableIsotope ? ' · stabil' : ' · radioaktif paling stabil'})`,
                        },
                        {
                          label: 'Bilangan Oksidasi (Biloks)',
                          value: element.oxidationStates,
                        },
                        { label: 'Golongan', value: element.groupLabel },
                        { label: 'Periode', value: `Periode ${element.period}` },
                        { label: 'Blok Unsur', value: `Blok ${element.block}` },
                        { label: 'Kategori Unsur', value: catMeta.label },
                        { label: 'Tahun Penemuan', value: element.discoveryYear },
                        { label: 'Penemu Unsur', value: element.discoverer },
                        { label: 'Asal Nama Unsur', value: element.etymology, full: true },
                      ]}
                    />
                  )}

                  {activeTab === 'fisika' && (
                    <SectionGrid
                      title="B. Sifat Fisika"
                      items={[
                        { label: 'Wujud pada Suhu Ruang (25°C)', value: element.stateAt25C },
                        { label: 'Warna & Penampakan', value: element.color },
                        { label: 'Massa Jenis', value: element.density },
                        { label: 'Titik Leleh', value: element.meltingPoint },
                        { label: 'Titik Didih', value: element.boilingPoint },
                        { label: 'Struktur Kristal', value: element.crystalStructure },
                        { label: 'Sifat Magnetik', value: element.magneticProperty },
                        { label: 'Konduktivitas Listrik & Termal', value: element.conductivity },
                        {
                          label: 'Sifat Fisik Khas Lainnya',
                          value: element.specialPhysicalNotes,
                          full: true,
                        },
                      ]}
                    />
                  )}

                  {activeTab === 'kimia' && (
                    <div className="space-y-3">
                      <SectionGrid
                        title="C. Sifat Kimia"
                        items={[
                          {
                            label: 'Konfigurasi Elektron Lengkap',
                            value: config.fullNotation,
                            mono: true,
                            full: true,
                          },
                          {
                            label: 'Konfigurasi Ringkas',
                            value: config.condensedNotation,
                            mono: true,
                          },
                          {
                            label: 'Elektron Valensi (kulit terluar)',
                            value: `${config.valenceElectrons} elektron`,
                          },
                          { label: 'Bilangan Oksidasi Umum', value: element.oxidationStates },
                          { label: 'Keelektronegatifan (Pauling)', value: element.electronegativity },
                          { label: 'Energi Ionisasi Pertama', value: element.ionizationEnergy },
                          { label: 'Afinitas Elektron', value: element.electronAffinity },
                          { label: 'Reaktivitas', value: element.reactivity, full: true },
                          {
                            label: 'Senyawa Penting yang Dibentuk',
                            value: element.keyCompounds,
                            full: true,
                          },
                          {
                            label: 'Reaksi Kimia Khas',
                            value: element.characteristicReaction,
                            full: true,
                          },
                        ]}
                      />
                      {config.uncertaintyNote && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                          <strong>Catatan Ilmiah:</strong> {config.uncertaintyNote}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'alam' && (
                    <SectionGrid
                      title="D. Keberadaan di Alam"
                      items={[
                        { label: 'Keberadaan di Kerak Bumi', value: element.crustalAbundance },
                        { label: 'Kelimpahan Relatif', value: element.relativeAbundance },
                        {
                          label: 'Keberadaan di Udara, Air, & Organisme',
                          value: element.environmentPresence,
                          full: true,
                        },
                        { label: 'Bentuk Alami Unsur', value: element.naturalForm, full: true },
                        { label: 'Mineral / Bijih Utama', value: element.oresAndMinerals, full: true },
                        {
                          label: 'Cara Memperoleh / Ekstraksi',
                          value: element.extractionMethod,
                          full: true,
                        },
                      ]}
                    />
                  )}

                  {activeTab === 'manfaat' && (
                    <SectionGrid
                      title="E. Manfaat dan Fakta Ilmiah"
                      items={[
                        {
                          label: 'Pemanfaatan Sehari-hari',
                          value: element.everydayUses,
                          full: true,
                        },
                        { label: 'Pemanfaatan Industri', value: element.industrialUses, full: true },
                        {
                          label: 'Pemanfaatan Teknologi Modern',
                          value: element.modernTechUses,
                          full: true,
                        },
                        { label: 'Fakta Unik Ilmiah', value: element.uniqueFact, full: true },
                        { label: 'Keselamatan & Bahaya', value: element.safetyInfo, full: true },
                      ]}
                    />
                  )}
                </div>

                {/* Bottom Action Footer inside card */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-300/70 bg-gradient-to-r from-cyan-50/80 via-white to-violet-50/70 px-4 py-2.5">
                  <span className="text-xs text-slate-700">
                    Jelajahi inti atom, isotop, kulit K–Q, serta bentuk orbital 3D (s, p, d, f) untuk{' '}
                    <strong>{element.name}</strong>.
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenAtomLab(element)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-700"
                  >
                    <Atom className="h-3.5 w-3.5 text-cyan-300" />
                    <span>Buka Laboratorium Atom 3D</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface SectionGridProps {
  title: string;
  items: Array<{ label: string; value: string; full?: boolean; mono?: boolean }>;
}

function SectionGrid({ title, items }: SectionGridProps) {
  return (
    <div>
      <h3 className="font-display mb-3 text-sm font-bold tracking-wide text-cyan-950 uppercase">
        {title}
      </h3>
      <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-lg border border-slate-200/90 bg-slate-50/75 px-3 py-2 ${
              item.full ? 'sm:col-span-2' : ''
            }`}
          >
            <dt className="text-[11px] font-semibold text-slate-500">{item.label}</dt>
            <dd
              className={`mt-0.5 text-xs leading-relaxed font-medium text-slate-900 sm:text-[13px] ${
                item.mono ? 'font-mono-tabular text-cyan-950' : ''
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
