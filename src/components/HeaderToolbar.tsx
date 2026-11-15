import {
  Atom,
  GitCompareArrows,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import type { ElementCategory } from '../types/element';
import { CATEGORY_META } from '../utils/chemistry';

interface HeaderToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  selectedCategory: ElementCategory | 'all';
  onCategoryChange: (cat: ElementCategory | 'all') => void;
  matchCount: number;
  totalCount: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenComparison: () => void;
  onResetView: () => void;
}

const CATEGORY_KEYS = Object.keys(CATEGORY_META) as ElementCategory[];

export function HeaderToolbar({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  matchCount,
  totalCount,
  isFullscreen,
  onToggleFullscreen,
  onOpenComparison,
  onResetView,
}: HeaderToolbarProps) {
  const hasActiveFilter = query.trim().length > 0 || selectedCategory !== 'all';

  return (
    <header className="relative z-20 shrink-0 border-b border-slate-300/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-2.5 px-3 py-2 sm:px-5 lg:flex-nowrap lg:py-2">
        {/* Brand Title */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/50 bg-gradient-to-br from-slate-100 via-cyan-50 to-violet-100 shadow-sm">
            <Atom className="h-5 w-5 text-cyan-700" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display truncate text-sm font-bold tracking-wider text-slate-900 sm:text-base lg:text-lg">
              HOLOGRAPHIC PERIODIC TABLE
            </h1>
            <p className="truncate text-[11px] font-medium tracking-wide text-slate-600">
              Interactive 3D Chemistry Universe · 118 Unsur Kimia
            </p>
          </div>
        </div>

        {/* Search, Filter & Action Controls */}
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
          {/* Search input */}
          <div className="relative min-w-[180px] flex-1 sm:w-60 sm:flex-none lg:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Cari nama, simbol, atau no. atom..."
              aria-label="Cari unsur kimia"
              data-testid="element-search-input"
              className="h-8.5 w-full rounded-lg border border-slate-300 bg-slate-50/90 pr-7 pl-8 text-xs font-medium text-slate-900 placeholder-slate-500 shadow-inner transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-400/30 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category filter dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as ElementCategory | 'all')}
              aria-label="Filter kategori unsur"
              data-testid="category-filter-select"
              className="h-8.5 rounded-lg border border-slate-300 bg-slate-50/90 px-2.5 text-xs font-semibold text-slate-800 shadow-inner transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-400/30 focus:outline-none"
            >
              <option value="all">Semua Kategori ({totalCount})</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_META[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Match status text */}
          <span className="hidden font-mono-tabular text-[11px] font-medium text-slate-600 xl:inline">
            {matchCount}/{totalCount} unsur
          </span>

          {/* Compare Elements */}
          <button
            type="button"
            onClick={onOpenComparison}
            data-testid="open-comparison-btn"
            className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-cyan-500/50 bg-gradient-to-b from-white to-cyan-50 px-2.5 text-xs font-semibold text-cyan-900 shadow-xs transition hover:border-cyan-600 hover:from-cyan-50 hover:to-cyan-100"
          >
            <GitCompareArrows className="h-3.5 w-3.5 text-cyan-700" />
            <span>Bandingkan Unsur</span>
          </button>

          {/* Reset view */}
          <button
            type="button"
            onClick={onResetView}
            disabled={!hasActiveFilter}
            data-testid="reset-view-btn"
            title="Reset filter & tampilan"
            className="inline-flex h-8.5 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            data-testid="fullscreen-btn"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
            aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
            className="inline-flex h-8.5 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-900"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">
              {isFullscreen ? 'Keluar' : 'Layar Penuh'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
