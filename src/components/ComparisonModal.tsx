import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, GitCompareArrows, X } from 'lucide-react';
import type { ElementData } from '../types/element';
import { CATEGORY_META, getAccurateElectronConfig } from '../utils/chemistry';

interface ComparisonModalProps {
  elements: ElementData[];
  initialLeftId?: number;
  initialRightId?: number;
  onClose: () => void;
}

export function ComparisonModal({
  elements,
  initialLeftId = 11,
  initialRightId = 17,
  onClose,
}: ComparisonModalProps) {
  const [leftId, setLeftId] = useState<number>(initialLeftId);
  const [rightId, setRightId] = useState<number>(initialRightId);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const leftEl = useMemo(
    () => elements.find((e) => e.atomicNumber === leftId) ?? elements[0],
    [elements, leftId]
  );
  const rightEl = useMemo(
    () => elements.find((e) => e.atomicNumber === rightId) ?? elements[1],
    [elements, rightId]
  );

  const leftConfig = useMemo(() => getAccurateElectronConfig(leftEl.atomicNumber), [leftEl]);
  const rightConfig = useMemo(() => getAccurateElectronConfig(rightEl.atomicNumber), [rightEl]);

  const swapElements = () => {
    setLeftId(rightEl.atomicNumber);
    setRightId(leftEl.atomicNumber);
  };

  const rows: Array<{
    label: string;
    leftVal: string;
    rightVal: string;
    leftNum?: number | null;
    rightNum?: number | null;
  }> = [
    {
      label: 'Nomor Atom (Z)',
      leftVal: String(leftEl.atomicNumber),
      rightVal: String(rightEl.atomicNumber),
      leftNum: leftEl.atomicNumber,
      rightNum: rightEl.atomicNumber,
    },
    {
      label: 'Massa Atom Relatif (Ar)',
      leftVal: leftEl.atomicMass,
      rightVal: rightEl.atomicMass,
      leftNum: leftEl.atomicMassNumeric,
      rightNum: rightEl.atomicMassNumeric,
    },
    {
      label: 'Kategori Unsur',
      leftVal: CATEGORY_META[leftEl.category].label,
      rightVal: CATEGORY_META[rightEl.category].label,
    },
    {
      label: 'Golongan / Periode / Blok',
      leftVal: `${leftEl.groupLabel} · Periode ${leftEl.period} · Blok ${leftEl.block}`,
      rightVal: `${rightEl.groupLabel} · Periode ${rightEl.period} · Blok ${rightEl.block}`,
    },
    {
      label: 'Wujud (25°C)',
      leftVal: leftEl.stateAt25C,
      rightVal: rightEl.stateAt25C,
    },
    {
      label: 'Massa Jenis',
      leftVal: leftEl.density,
      rightVal: rightEl.density,
      leftNum: leftEl.densityNumeric,
      rightNum: rightEl.densityNumeric,
    },
    {
      label: 'Titik Leleh',
      leftVal: leftEl.meltingPoint,
      rightVal: rightEl.meltingPoint,
    },
    {
      label: 'Titik Didih',
      leftVal: leftEl.boilingPoint,
      rightVal: rightEl.boilingPoint,
    },
    {
      label: 'Keelektronegatifan (Pauling)',
      leftVal: leftEl.electronegativity,
      rightVal: rightEl.electronegativity,
      leftNum: leftEl.electronegativityNumeric,
      rightNum: rightEl.electronegativityNumeric,
    },
    {
      label: 'Energi Ionisasi Pertama',
      leftVal: leftEl.ionizationEnergy,
      rightVal: rightEl.ionizationEnergy,
      leftNum: leftEl.ionizationEnergyNumeric,
      rightNum: rightEl.ionizationEnergyNumeric,
    },
    {
      label: 'Konfigurasi Elektron',
      leftVal: leftConfig.condensedNotation,
      rightVal: rightConfig.condensedNotation,
    },
    {
      label: 'Distribusi Kulit (K–Q)',
      leftVal: leftConfig.shells.map((s) => `${s.shellName}:${s.electrons}`).join(' · '),
      rightVal: rightConfig.shells.map((s) => `${s.shellName}:${s.electrons}`).join(' · '),
    },
    {
      label: 'Bilangan Oksidasi Umum',
      leftVal: leftEl.oxidationStates,
      rightVal: rightEl.oxidationStates,
    },
    {
      label: 'Struktur Kristal',
      leftVal: leftEl.crystalStructure,
      rightVal: rightEl.crystalStructure,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-3 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Perbandingan Unsur Kimia"
      data-testid="comparison-modal"
    >
      <div className="holo-card-shell flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-300/80 bg-white/80 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800">
              <GitCompareArrows className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 sm:text-lg">
                Bandingkan Unsur Kimia
              </h2>
              <p className="text-xs text-slate-600">
                Analisis berdampingan sifat fisika, kimia, dan struktur elektron dua unsur
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-testid="close-comparison-btn"
            aria-label="Tutup perbandingan"
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selector bar */}
        <div className="grid shrink-0 grid-cols-1 items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-display text-lg font-bold ${CATEGORY_META[leftEl.category].tileBg} ${CATEGORY_META[leftEl.category].tileBorder} ${CATEGORY_META[leftEl.category].textColor}`}
            >
              {leftEl.symbol}
            </span>
            <select
              value={leftEl.atomicNumber}
              onChange={(e) => setLeftId(Number(e.target.value))}
              aria-label="Pilih unsur pertama"
              data-testid="compare-left-select"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:outline-none"
            >
              {elements.map((el) => (
                <option key={el.atomicNumber} value={el.atomicNumber}>
                  {el.atomicNumber}. {el.name} ({el.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swapElements}
            title="Tukar posisi unsur"
            className="mx-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-700" />
            <span>Tukar</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-display text-lg font-bold ${CATEGORY_META[rightEl.category].tileBg} ${CATEGORY_META[rightEl.category].tileBorder} ${CATEGORY_META[rightEl.category].textColor}`}
            >
              {rightEl.symbol}
            </span>
            <select
              value={rightEl.atomicNumber}
              onChange={(e) => setRightId(Number(e.target.value))}
              aria-label="Pilih unsur kedua"
              data-testid="compare-right-select"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cyan-500 focus:outline-none"
            >
              {elements.map((el) => (
                <option key={el.atomicNumber} value={el.atomicNumber}>
                  {el.atomicNumber}. {el.name} ({el.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="silver-scroll flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-300 bg-white/90">
            {rows.map((row) => {
              const hasBar =
                typeof row.leftNum === 'number' &&
                typeof row.rightNum === 'number' &&
                (row.leftNum > 0 || row.rightNum > 0);
              const maxVal = hasBar ? Math.max(row.leftNum!, row.rightNum!, 0.0001) : 1;

              return (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-2 px-4 py-2.5 text-xs sm:grid-cols-[200px_1fr_1fr] sm:items-center sm:gap-4"
                >
                  <div className="font-semibold text-slate-600">{row.label}</div>

                  <div>
                    <div className="font-mono-tabular font-semibold text-slate-900">
                      {row.leftVal}
                    </div>
                    {hasBar && (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-cyan-600 transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(4, (row.leftNum! / maxVal) * 100))}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-mono-tabular font-semibold text-slate-900">
                      {row.rightVal}
                    </div>
                    {hasBar && (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-violet-600 transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(4, (row.rightNum! / maxVal) * 100))}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
