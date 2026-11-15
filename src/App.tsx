/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ELEMENTS } from './data/elements';
import type { ElementCategory, ElementData } from './types/element';
import { filterElements } from './utils/chemistry';
import { indonesianNarrator } from './utils/narrator';
import { HeaderToolbar } from './components/HeaderToolbar';
import { PeriodicTable } from './components/PeriodicTable';
import { Footer } from './components/Footer';
import { ElementCardModal } from './components/ElementCardModal';
import { AtomLabModal } from './components/AtomLabModal';
import { ComparisonModal } from './components/ComparisonModal';

type ActiveModal =
  | { type: 'none' }
  | { type: 'card'; element: ElementData }
  | { type: 'atomLab'; element: ElementData; initialMode: 'atom' | 'orbital' }
  | { type: 'comparison'; leftId?: number; rightId?: number };

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>({ type: 'none' });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const matchedElements = useMemo(
    () => filterElements(ELEMENTS, query, selectedCategory),
    [query, selectedCategory]
  );

  const matchedIds = useMemo(
    () => new Set(matchedElements.map((e) => e.atomicNumber)),
    [matchedElements]
  );

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      indonesianNarrator.stop();
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Ignore fullscreen denial inside embedded iframes cleanly
    }
  }, []);

  const handleSelectElement = useCallback((el: ElementData) => {
    indonesianNarrator.stop();
    setSelectedElement(el);
    setActiveModal({ type: 'card', element: el });
  }, []);

  const handleOpenAtomLab = useCallback((el: ElementData) => {
    indonesianNarrator.stop();
    setSelectedElement(el);
    setActiveModal({ type: 'atomLab', element: el, initialMode: 'atom' });
  }, []);

  const handleOpenComparison = useCallback((leftEl?: ElementData) => {
    indonesianNarrator.stop();
    const leftId = leftEl?.atomicNumber ?? 11;
    const rightId = leftEl && leftEl.atomicNumber === 17 ? 11 : 17;
    setActiveModal({ type: 'comparison', leftId, rightId });
  }, []);

  const handleCloseModal = useCallback(() => {
    indonesianNarrator.stop();
    setActiveModal({ type: 'none' });
  }, []);

  const handleResetView = useCallback(() => {
    indonesianNarrator.stop();
    setQuery('');
    setSelectedCategory('all');
    setSelectedElement(null);
    setActiveModal({ type: 'none' });
  }, []);

  return (
    <div className="bg-brushed-silver silver-grid-lines relative flex min-h-screen w-full flex-col text-slate-900 lg:h-screen lg:overflow-hidden">
      {/* Subtle metallic cyan/violet ambient sheen */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(6,182,212,0.08),transparent_42%),radial-gradient(circle_at_88%_18%,rgba(124,58,237,0.06),transparent_38%)]" />

      <HeaderToolbar
        query={query}
        onQueryChange={setQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        matchCount={matchedElements.length}
        totalCount={ELEMENTS.length}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenComparison={() => handleOpenComparison(selectedElement ?? undefined)}
        onResetView={handleResetView}
      />

      <main className="relative z-10 flex min-h-0 flex-1 flex-col">
        <PeriodicTable
          elements={ELEMENTS}
          matchedIds={matchedIds}
          selectedElement={selectedElement}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSelectElement={handleSelectElement}
        />
      </main>

      <Footer />

      {activeModal.type === 'card' && (
        <ElementCardModal
          element={activeModal.element}
          onClose={handleCloseModal}
          onOpenAtomLab={handleOpenAtomLab}
          onCompareElement={(el) => handleOpenComparison(el)}
        />
      )}

      {activeModal.type === 'atomLab' && (
        <AtomLabModal
          element={activeModal.element}
          initialMode={activeModal.initialMode}
          onClose={handleCloseModal}
        />
      )}

      {activeModal.type === 'comparison' && (
        <ComparisonModal
          elements={ELEMENTS}
          initialLeftId={activeModal.leftId}
          initialRightId={activeModal.rightId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
