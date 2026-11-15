export type ElementCategory =
  | 'logam-alkali'
  | 'logam-alkali-tanah'
  | 'logam-transisi'
  | 'logam-pascatransisi'
  | 'metaloid'
  | 'nonlogam'
  | 'halogen'
  | 'gas-mulia'
  | 'lantanida'
  | 'aktinida';

export type ElementBlock = 's' | 'p' | 'd' | 'f';

export type MatterState = 'Padat' | 'Cair' | 'Gas' | 'Belum terkonfirmasi';

export type SpecimenVisualType =
  | 'metal-nugget'
  | 'metal-crystal'
  | 'metal-liquid'
  | 'alkali-oil'
  | 'gas-ampoule'
  | 'noble-plasma'
  | 'liquid-ampoule'
  | 'nonmetal-crystal'
  | 'metalloid-wafer'
  | 'radioactive-box'
  | 'synthetic-chamber';

export interface IsotopeData {
  massNumber: number;
  symbol: string;
  abundance?: string;
  halfLife?: string;
  isStable: boolean;
  isDefault?: boolean;
  notes?: string;
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  internationalName: string;
  atomicMass: string;
  atomicMassNumeric: number;
  isMassApproximate?: boolean;
  group: number | null; // null for Lanthanides/Actinides except La/Ac or standard 18-column note
  groupLabel: string;
  period: number;
  block: ElementBlock;
  category: ElementCategory;

  // Identity
  discoveryYear: string;
  discoverer: string;
  etymology: string;

  // Physical properties
  stateAt25C: MatterState;
  color: string;
  density: string;
  densityNumeric: number | null;
  meltingPoint: string;
  meltingPointC: number | null;
  boilingPoint: string;
  boilingPointC: number | null;
  crystalStructure: string;
  magneticProperty: string;
  conductivity: string;
  specialPhysicalNotes: string;

  // Chemical properties
  oxidationStates: string;
  electronegativity: string;
  electronegativityNumeric: number | null;
  ionizationEnergy: string;
  ionizationEnergyNumeric: number | null;
  electronAffinity: string;
  reactivity: string;
  keyCompounds: string;
  characteristicReaction: string;

  // Occurrence in nature
  crustalAbundance: string;
  environmentPresence: string;
  naturalForm: string;
  oresAndMinerals: string;
  relativeAbundance: string;
  extractionMethod: string;

  // Uses and scientific facts
  everydayUses: string;
  industrialUses: string;
  modernTechUses: string;
  uniqueFact: string;
  safetyInfo: string;

  // Isotopes & Visuals
  isotopes: IsotopeData[];
  specimenVisual: {
    type: SpecimenVisualType;
    primaryHex: string;
    secondaryHex: string;
    glowHex?: string;
    caption: string;
    isSimulated: boolean;
  };
}

export interface SubshellEntry {
  n: number;
  l: 's' | 'p' | 'd' | 'f';
  label: string;
  electrons: number;
  maxElectrons: number;
}

export interface ShellSummary {
  shellName: 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q';
  n: number;
  electrons: number;
  maxCapacity: number;
}

export interface ElectronConfigResult {
  atomicNumber: number;
  subshells: SubshellEntry[];
  fullNotation: string;
  condensedNotation: string;
  shells: ShellSummary[];
  valenceElectrons: number;
  isExperimentalUncertain: boolean;
  uncertaintyNote?: string;
}

export interface OrbitalBoxStep {
  stepIndex: number;
  subshellLabel: string;
  orbitalIndex: number;
  spin: 'up' | 'down';
  ruleNote: string;
}

export interface SubatomicParticleCounts {
  atomicNumber: number;
  massNumber: number;
  protons: number;
  neutrons: number;
  electrons: number;
  charge: number;
}
