import { useEffect, useState } from 'react';
import { Atom, Maximize2, X } from 'lucide-react';
import type { ElementData } from '../types/element';
import { SPECIMEN_CATALOG } from '../data/specimenCatalog';
import { CATEGORY_META } from '../utils/chemistry';

interface SpecimenImageProps {
  element: ElementData;
  className?: string;
}

export function SpecimenImage({ element, className = '' }: SpecimenImageProps) {
  const entry = SPECIMEN_CATALOG[element.atomicNumber];
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setZoomed(false);
  }, [element.atomicNumber]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setZoomed(false);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [zoomed]);

  const catMeta = CATEGORY_META[element.category];
  const resolvedUrl = entry?.url ?? '';
  const isSimulated = entry?.isSimulated ?? element.specimenVisual.isSimulated;
  const badgeLabel = entry?.badgeLabel ?? (isSimulated ? 'SIMULASI ILMIAH' : 'Spesimen Nyata');

  return (
    <>
      <div
        className={`group relative overflow-hidden rounded-xl border border-slate-300/90 bg-slate-900/5 shadow-inner ${className}`}
      >
        {resolvedUrl && !failed ? (
          <img
            src={resolvedUrl}
            alt={`Foto spesimen ${element.name} (${element.symbol})`}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            data-testid="specimen-photo-img"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center p-4 text-center"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${element.specimenVisual.primaryHex}44, ${element.specimenVisual.secondaryHex}22 65%, #e2e8f0 100%)`,
            }}
          >
            <Atom className="mb-1.5 h-8 w-8 text-slate-600" />
            <span className="font-display text-3xl font-bold text-slate-800">{element.symbol}</span>
            <span className="mt-0.5 text-xs font-medium text-slate-600">
              Z = {element.atomicNumber} · {catMeta.label}
            </span>
          </div>
        )}

        {/* Top-right status badge: Real Specimen vs Scientific Simulation */}
        <div
          data-testid="specimen-badge"
          className={[
            'pointer-events-none absolute top-2 right-2 rounded-md border px-2 py-0.5 font-mono-tabular text-[10px] font-bold tracking-wide shadow-xs',
            isSimulated
              ? 'border-amber-300/60 bg-amber-950/90 text-amber-200'
              : 'border-cyan-300/45 bg-slate-900/85 text-cyan-200',
          ].join(' ')}
        >
          {badgeLabel}
        </div>

        {/* Zoom macro inspect trigger */}
        {resolvedUrl && !failed && (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            title="Perbesar foto spesimen"
            aria-label={`Perbesar foto spesimen ${element.name}`}
            data-testid="zoom-specimen-btn"
            className="absolute top-2 left-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/30 bg-slate-900/70 text-white opacity-90 shadow-xs transition hover:bg-slate-900/95"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Subtle holographic sweep accent */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-violet-500/10" />

        {/* Caption & Scientific Attribution bar at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-transparent px-3 pt-5 pb-2 text-white">
          <p className="line-clamp-2 text-[11px] leading-snug font-medium text-slate-100">
            {element.specimenVisual.caption}
          </p>
          {entry?.credit && (
            <p className="mt-0.5 line-clamp-2 text-[9px] leading-tight text-slate-300/95">
              Sumber: {entry.credit}
            </p>
          )}
        </div>
      </div>

      {/* High-Resolution Specimen Lightbox Modal */}
      {zoomed && resolvedUrl && !failed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto detail spesimen ${element.name}`}
          data-testid="specimen-lightbox"
          onClick={() => setZoomed(false)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-white">
              <div>
                <span className="font-display text-sm font-bold">
                  {element.atomicNumber}. {element.name} ({element.symbol})
                </span>
                <span className="ml-2 text-xs text-cyan-300">· {badgeLabel}</span>
              </div>
              <button
                type="button"
                onClick={() => setZoomed(false)}
                aria-label="Tutup perbesaran foto"
                className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex max-h-[76vh] items-center justify-center bg-black p-2">
              <img
                src={resolvedUrl}
                alt={`Foto detail spesimen ${element.name} (${element.symbol})`}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto max-w-full rounded object-contain"
              />
            </div>
            <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-slate-300">
              <div className="font-medium text-white">{element.specimenVisual.caption}</div>
              {entry?.credit && <div className="mt-0.5 text-[11px] text-slate-400">Sumber: {entry.credit}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
