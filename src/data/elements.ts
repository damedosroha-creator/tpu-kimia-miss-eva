import type { ElementData } from '../types/element';
import { ELEMENTS_PART_1 } from './elementsPart1';
import { ELEMENTS_PART_2 } from './elementsPart2';
import { ELEMENTS_PART_3 } from './elementsPart3';

export const ELEMENTS: ElementData[] = [
  ...ELEMENTS_PART_1,
  ...ELEMENTS_PART_2,
  ...ELEMENTS_PART_3,
].sort((a, b) => a.atomicNumber - b.atomicNumber);

export const ELEMENT_BY_NUMBER = new Map<number, ElementData>(
  ELEMENTS.map((el) => [el.atomicNumber, el])
);

export const ELEMENT_BY_SYMBOL = new Map<string, ElementData>(
  ELEMENTS.map((el) => [el.symbol.toLowerCase(), el])
);

export function getElementByNumber(atomicNumber: number): ElementData | undefined {
  return ELEMENT_BY_NUMBER.get(atomicNumber);
}
