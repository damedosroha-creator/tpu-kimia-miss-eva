import { memo, useMemo } from 'react';
import type { ElementCategory, ElementData } from '../types/element';
import {
  CATEGORY_META,
  getCompactOxidationStates,
  getPeriodicGridPosition,
  getStableIsotopeMassInfo,
} from '../utils/chemistry';

interface ElementTileProps {
  element: ElementData;
  isMatched: boolean;
  isSelected: boolean;
  onSelect: (element: ElementData) => void;
}

const ElementTile = memo(function ElementTile({
  element,
  isMatched,
  isSelected,
  onSelect,
}: ElementTileProps) {
  const { row, col } = getPeriodicGridPosition(element);
  const meta = CATEGORY_META[element.category];
  const stableInfo = getStableIsotopeMassInfo(element);
  const compactBiloks = getCompactOxidationStates(element.oxidationStates);

  return (
    <button
      type="button"
      onClick={() => onSelect(element)}
      data-testid={`element-tile-${element.atomicNumber}`}
      aria-label={`${element.name} (${element.symbol}), nomor atom ${element.atomicNumber}, massa isotop stabil ${stableInfo.displayLabel}, biloks ${compactBiloks}`}
      title={`${element.atomicNumber} · ${element.name} (${element.symbol}) — Isotop ${stableInfo.hasStableIsotope ? 'stabil' : 'paling stabil'}: A=${stableInfo.displayLabel} | Ar ${element.atomicMass} | Biloks: ${element.oxidationStates}`}
      style={{ gridRowStart: row, gridColumnStart: col }}
      className={[
        'group relative flex min-h-0 w-full flex-col justify-between rounded-md border px-1 py-0.5 text-left transition-all duration-150 focus:z-20 focus:ring-2 focus:ring-cyan-500 focus:outline-none',
        meta.tileBg,
        meta.tileBorder,
        meta.tileHover,
        isSelected
          ? 'z-10 ring-2 ring-cyan-600 shadow-md shadow-cyan-500/25'
          : 'shadow-[0_1px_2px_rgba(15,23,42,0.06)]',
        isMatched
          ? 'opacity-100 hover:-translate-y-0.5 hover:z-20 hover:shadow-lg hover:shadow-cyan-500/20'
          : 'opacity-25 saturate-50',
      ].join(' ')}
    >
      {/* Top row: Atomic Number (left) + Stable Isotope Mass Number (right) */}
      <div className="flex w-full items-baseline justify-between gap-0.5 leading-none">
        <span className="shrink-0 font-mono-tabular text-[9px] font-bold text-slate-900 sm:text-[10px] xl:text-[11px]">
          {element.atomicNumber}
        </span>
        <span
          data-testid={`tile-isotope-mass-${element.atomicNumber}`}
          className="shrink-0 whitespace-nowrap font-mono-tabular text-[6.5px] font-bold tracking-tight text-slate-700 sm:text-[7px] xl:text-[8px]"
        >
          A:{stableInfo.displayLabel}
        </span>
      </div>

      {/* Center: Symbol */}
      <div className="my-auto flex w-full items-center justify-center">
        <span
          className={`font-display text-xs leading-none font-bold tracking-tight sm:text-sm md:text-[15px] xl:text-[17px] ${meta.textColor}`}
        >
          {element.symbol}
        </span>
      </div>

      {/* Bottom: Indonesian Name + Relative Mass + Biloks */}
      <div className="w-full overflow-hidden leading-[1.12]">
        <div className="truncate text-center text-[7px] font-semibold text-slate-900 sm:text-[7.5px] xl:text-[8.5px]">
          {element.name}
        </div>
        <div className="truncate text-center font-mono-tabular text-[6.5px] text-slate-600 xl:text-[7.5px]">
          {element.atomicMass}
        </div>
        <div
          data-testid={`tile-biloks-${element.atomicNumber}`}
          className="truncate text-center font-mono-tabular text-[6px] font-bold tracking-tighter text-cyan-950/90 xl:text-[6.8px]"
        >
          {compactBiloks}
        </div>
      </div>
    </button>
  );
});

interface PeriodicTableProps {
  elements: ElementData[];
  matchedIds: Set<number>;
  selectedElement: ElementData | null;
  selectedCategory: ElementCategory | 'all';
  onCategoryChange: (cat: ElementCategory | 'all') => void;
  onSelectElement: (element: ElementData) => void;
}

const CATEGORY_KEYS = Object.keys(CATEGORY_META) as ElementCategory[];
const GROUP_NUMBERS = Array.from({ length: 18 }, (_, i) => i + 1);

export function PeriodicTable({
  elements,
  matchedIds,
  selectedElement,
  selectedCategory,
  onCategoryChange,
  onSelectElement,
}: PeriodicTableProps) {
  const positionedElements = useMemo(() => elements, [elements]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-2 py-1.5 sm:px-4 lg:py-2">
      {/* Category Legend Bar */}
      <div
        className="silver-scroll flex shrink-0 flex-nowrap items-center justify-start gap-1.5 overflow-x-auto rounded-xl border border-slate-300/80 bg-white/75 px-2.5 py-1.5 shadow-xs backdrop-blur-xs sm:flex-wrap sm:justify-center sm:py-1"
        role="toolbar"
        aria-label="Legenda kategori unsur"
      >
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={[
            'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition sm:text-[11px]',
            selectedCategory === 'all'
              ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
              : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200',
          ].join(' ')}
        >
          Semua
        </button>

        {CATEGORY_KEYS.map((key) => {
          const meta = CATEGORY_META[key];
          const active = selectedCategory === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onCategoryChange(active ? 'all' : key)}
              data-testid={`legend-cat-${key}`}
              className={[
                'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition sm:text-[11px]',
                active
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-300/90 bg-white/90 text-slate-800 hover:border-slate-400 hover:bg-slate-100',
              ].join(' ')}
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-xs border border-slate-400/50 ${meta.badgeBg}`}
              />
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable wrapper on mobile/tablet, locked single-screen fit on lg+ */}
      <div className="silver-scroll relative min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-300/90 bg-white/55 p-2 shadow-inner lg:overflow-hidden lg:p-2.5">
        <div className="flex h-full min-w-[1140px] flex-col lg:min-w-0">
          {/* Group 1..18 subtle top labels */}
          <div className="mb-1 grid shrink-0 grid-cols-[repeat(18,minmax(0,1fr))] gap-1 px-0.5">
            {GROUP_NUMBERS.map((g) => (
              <div
                key={g}
                className="text-center font-mono-tabular text-[9px] font-bold text-slate-500 xl:text-[10px]"
              >
                {g}
              </div>
            ))}
          </div>

          {/* 18-column x 10-row periodic table grid */}
          <div
            data-testid="periodic-table-grid"
            className="grid min-h-0 flex-1 grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(7,minmax(58px,1fr))_10px_repeat(2,minmax(56px,1fr))] gap-1 lg:grid-rows-[repeat(7,minmax(0,1fr))_8px_repeat(2,minmax(0,1fr))]"
          >
            {/* Annotated Sample Tile Key inside empty Period 1-3 center bridge (cols 4-11) */}
            <div
              style={{ gridRowStart: 1, gridRowEnd: 4, gridColumnStart: 4, gridColumnEnd: 12 }}
              data-testid="periodic-tile-key"
              className="flex items-center justify-center p-1"
            >
              <div className="flex w-full max-w-[565px] items-center gap-4 rounded-xl border border-slate-300/90 bg-white/80 px-4 py-2.5 shadow-xs">
                {/* Annotated Sample Tile (Carbon) */}
                <div className="flex h-[96px] w-[88px] shrink-0 flex-col justify-between rounded-lg border border-cyan-400 bg-cyan-100/85 px-2 py-1.5 shadow-sm">
                  <div className="flex items-baseline justify-between leading-none">
                    <span className="font-mono-tabular text-xs font-bold text-slate-900">6</span>
                    <span className="font-mono-tabular text-[10px] font-bold text-slate-700">
                      A:12
                    </span>
                  </div>
                  <div className="my-auto text-center font-display text-2xl leading-none font-bold text-cyan-950">
                    C
                  </div>
                  <div className="leading-[1.15]">
                    <div className="text-center text-[10px] font-semibold text-slate-900">
                      Karbon
                    </div>
                    <div className="text-center font-mono-tabular text-[9px] text-slate-600">
                      12.011
                    </div>
                    <div className="text-center font-mono-tabular text-[9px] font-bold text-cyan-950">
                      -4..+4
                    </div>
                  </div>
                </div>

                {/* Concise Key Labels */}
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-1 text-[10px] leading-snug text-slate-700 xl:text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-900">Kiri atas (6):</span> Nomor Atom
                    (Z)
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Kanan atas (A:12):</span> No.
                    Massa Isotop Stabil
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Tengah (C):</span> Simbol &amp;
                    Nama Unsur
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Baris 12.011:</span> Massa Atom
                    Relatif (Ar)
                  </div>
                  <div className="col-span-2 border-t border-slate-200/80 pt-1">
                    <span className="font-semibold text-cyan-950">Baris bawah (-4..+4):</span>{' '}
                    Bilangan Oksidasi (Biloks) ·{' '}
                    <span className="text-slate-500">
                      <code className="font-mono-tabular">[...]</code> radioaktif terstabil,{' '}
                      <code className="font-mono-tabular">(...)</code> prediksi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lanthanide & Actinide series anchor labels in column 3 (periods 6 & 7) */}
            <div
              style={{ gridRowStart: 6, gridColumnStart: 3 }}
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-fuchsia-400/70 bg-fuchsia-50/70 p-0.5 text-center"
            >
              <span className="font-mono-tabular text-[9px] font-bold text-fuchsia-800 xl:text-[10px]">
                57–71
              </span>
              <span className="text-[7px] font-semibold text-fuchsia-700 xl:text-[8px]">
                La–Lu
              </span>
            </div>

            <div
              style={{ gridRowStart: 7, gridColumnStart: 3 }}
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-orange-400/70 bg-orange-50/70 p-0.5 text-center"
            >
              <span className="font-mono-tabular text-[9px] font-bold text-orange-800 xl:text-[10px]">
                89–103
              </span>
              <span className="text-[7px] font-semibold text-orange-700 xl:text-[8px]">
                Ac–Lr
              </span>
            </div>

            {/* Side series labels for row 9 (Lantanida) & row 10 (Aktinida) in cols 1-3 */}
            <div
              style={{ gridRowStart: 9, gridColumnStart: 1, gridColumnEnd: 4 }}
              className="flex items-center justify-end pr-2 text-right"
            >
              <span className="text-[10px] font-bold tracking-wide text-fuchsia-900 uppercase xl:text-xs">
                Deret Lantanida →
              </span>
            </div>

            <div
              style={{ gridRowStart: 10, gridColumnStart: 1, gridColumnEnd: 4 }}
              className="flex items-center justify-end pr-2 text-right"
            >
              <span className="text-[10px] font-bold tracking-wide text-orange-900 uppercase xl:text-xs">
                Deret Aktinida →
              </span>
            </div>

            {/* All 118 Element Tiles */}
            {positionedElements.map((el) => (
              <ElementTile
                key={el.atomicNumber}
                element={el}
                isMatched={matchedIds.has(el.atomicNumber)}
                isSelected={selectedElement?.atomicNumber === el.atomicNumber}
                onSelect={onSelectElement}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
