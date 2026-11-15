export function Footer() {
  return (
    <footer className="relative z-10 shrink-0 border-t border-slate-300/80 bg-white/75 px-4 py-1.5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-x-4 gap-y-0.5 text-[11px] text-slate-700">
        <div className="flex flex-wrap items-center gap-x-2 font-medium">
          <span className="font-display font-bold tracking-wider text-slate-900">
            HOLOGRAPHIC PERIODIC TABLE
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">Interactive Chemistry Learning Media</span>
        </div>
        <div className="font-semibold text-slate-800">
          Developer: Bu Eva Taida Manullang, S.Pd.
        </div>
      </div>
    </footer>
  );
}
