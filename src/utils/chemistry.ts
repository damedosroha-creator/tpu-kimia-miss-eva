import type {
  ElectronConfigResult,
  ElementCategory,
  ElementData,
  IsotopeData,
  OrbitalBoxStep,
  ShellSummary,
  SubatomicParticleCounts,
  SubshellEntry,
} from '../types/element';

export const CATEGORY_META: Record<
  ElementCategory,
  {
    label: string;
    shortLabel: string;
    tileBg: string;
    tileBorder: string;
    tileHover: string;
    accentHex: string;
    badgeBg: string;
    textColor: string;
  }
> = {
  'logam-alkali': {
    label: 'Logam Alkali',
    shortLabel: 'Alkali',
    tileBg: 'bg-rose-100/85',
    tileBorder: 'border-rose-300',
    tileHover: 'hover:bg-rose-200/90 hover:border-rose-500',
    accentHex: '#e11d48',
    badgeBg: 'bg-rose-600',
    textColor: 'text-rose-950',
  },
  'logam-alkali-tanah': {
    label: 'Logam Alkali Tanah',
    shortLabel: 'Alkali Tanah',
    tileBg: 'bg-amber-100/85',
    tileBorder: 'border-amber-300',
    tileHover: 'hover:bg-amber-200/90 hover:border-amber-500',
    accentHex: '#d97706',
    badgeBg: 'bg-amber-600',
    textColor: 'text-amber-950',
  },
  'logam-transisi': {
    label: 'Logam Transisi',
    shortLabel: 'Transisi',
    tileBg: 'bg-sky-100/80',
    tileBorder: 'border-sky-300',
    tileHover: 'hover:bg-sky-200/90 hover:border-sky-500',
    accentHex: '#0284c7',
    badgeBg: 'bg-sky-600',
    textColor: 'text-sky-950',
  },
  'logam-pascatransisi': {
    label: 'Logam Pascatransisi',
    shortLabel: 'Pascatransisi',
    tileBg: 'bg-teal-100/80',
    tileBorder: 'border-teal-300',
    tileHover: 'hover:bg-teal-200/90 hover:border-teal-500',
    accentHex: '#0d9488',
    badgeBg: 'bg-teal-600',
    textColor: 'text-teal-950',
  },
  metaloid: {
    label: 'Metaloid',
    shortLabel: 'Metaloid',
    tileBg: 'bg-emerald-100/85',
    tileBorder: 'border-emerald-300',
    tileHover: 'hover:bg-emerald-200/90 hover:border-emerald-500',
    accentHex: '#059669',
    badgeBg: 'bg-emerald-600',
    textColor: 'text-emerald-950',
  },
  nonlogam: {
    label: 'Nonlogam',
    shortLabel: 'Nonlogam',
    tileBg: 'bg-cyan-100/85',
    tileBorder: 'border-cyan-300',
    tileHover: 'hover:bg-cyan-200/90 hover:border-cyan-500',
    accentHex: '#0891b2',
    badgeBg: 'bg-cyan-600',
    textColor: 'text-cyan-950',
  },
  halogen: {
    label: 'Halogen',
    shortLabel: 'Halogen',
    tileBg: 'bg-indigo-100/80',
    tileBorder: 'border-indigo-300',
    tileHover: 'hover:bg-indigo-200/90 hover:border-indigo-500',
    accentHex: '#4f46e5',
    badgeBg: 'bg-indigo-600',
    textColor: 'text-indigo-950',
  },
  'gas-mulia': {
    label: 'Gas Mulia',
    shortLabel: 'Gas Mulia',
    tileBg: 'bg-violet-100/80',
    tileBorder: 'border-violet-300',
    tileHover: 'hover:bg-violet-200/90 hover:border-violet-500',
    accentHex: '#7c3aed',
    badgeBg: 'bg-violet-600',
    textColor: 'text-violet-950',
  },
  lantanida: {
    label: 'Lantanida',
    shortLabel: 'Lantanida',
    tileBg: 'bg-fuchsia-100/75',
    tileBorder: 'border-fuchsia-300',
    tileHover: 'hover:bg-fuchsia-200/90 hover:border-fuchsia-500',
    accentHex: '#c026d3',
    badgeBg: 'bg-fuchsia-600',
    textColor: 'text-fuchsia-950',
  },
  aktinida: {
    label: 'Aktinida',
    shortLabel: 'Aktinida',
    tileBg: 'bg-orange-100/85',
    tileBorder: 'border-orange-300',
    tileHover: 'hover:bg-orange-200/90 hover:border-orange-500',
    accentHex: '#ea580c',
    badgeBg: 'bg-orange-600',
    textColor: 'text-orange-950',
  },
};

const AUFBAU_ORDER: ReadonlyArray<{ n: number; l: 's' | 'p' | 'd' | 'f'; max: number }> = [
  { n: 1, l: 's', max: 2 },
  { n: 2, l: 's', max: 2 },
  { n: 2, l: 'p', max: 6 },
  { n: 3, l: 's', max: 2 },
  { n: 3, l: 'p', max: 6 },
  { n: 4, l: 's', max: 2 },
  { n: 3, l: 'd', max: 10 },
  { n: 4, l: 'p', max: 6 },
  { n: 5, l: 's', max: 2 },
  { n: 4, l: 'd', max: 10 },
  { n: 5, l: 'p', max: 6 },
  { n: 6, l: 's', max: 2 },
  { n: 4, l: 'f', max: 14 },
  { n: 5, l: 'd', max: 10 },
  { n: 6, l: 'p', max: 6 },
  { n: 7, l: 's', max: 2 },
  { n: 5, l: 'f', max: 14 },
  { n: 6, l: 'd', max: 10 },
  { n: 7, l: 'p', max: 6 },
];

// Ground-state electron configuration exceptions (IUPAC / NIST)
const CONFIG_EXCEPTIONS: Record<number, Record<string, number>> = {
  24: { '3d': 5, '4s': 1 }, // Cr
  29: { '3d': 10, '4s': 1 }, // Cu
  41: { '4d': 4, '5s': 1 }, // Nb
  42: { '4d': 5, '5s': 1 }, // Mo
  44: { '4d': 7, '5s': 1 }, // Ru
  45: { '4d': 8, '5s': 1 }, // Rh
  46: { '4d': 10, '5s': 0 }, // Pd
  47: { '4d': 10, '5s': 1 }, // Ag
  57: { '4f': 0, '5d': 1, '6s': 2 }, // La
  58: { '4f': 1, '5d': 1, '6s': 2 }, // Ce
  64: { '4f': 7, '5d': 1, '6s': 2 }, // Gd
  78: { '5d': 9, '6s': 1 }, // Pt
  79: { '5d': 10, '6s': 1 }, // Au
  89: { '5f': 0, '6d': 1, '7s': 2 }, // Ac
  90: { '5f': 0, '6d': 2, '7s': 2 }, // Th
  91: { '5f': 2, '6d': 1, '7s': 2 }, // Pa
  92: { '5f': 3, '6d': 1, '7s': 2 }, // U
  93: { '5f': 4, '6d': 1, '7s': 2 }, // Np
  96: { '5f': 7, '6d': 1, '7s': 2 }, // Cm
  103: { '5f': 14, '6d': 0, '7s': 2, '7p': 1 }, // Lr (relativistic ground state 7p1 confirmed)
};

const NOBLE_GASES: ReadonlyArray<{ z: number; symbol: string }> = [
  { z: 86, symbol: 'Rn' },
  { z: 54, symbol: 'Xe' },
  { z: 36, symbol: 'Kr' },
  { z: 18, symbol: 'Ar' },
  { z: 10, symbol: 'Ne' },
  { z: 2, symbol: 'He' },
];

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

export function toSuperscript(num: number): string {
  return String(num)
    .split('')
    .map((ch) => SUPERSCRIPTS[ch] ?? ch)
    .join('');
}

const SHELL_NAMES: ReadonlyArray<'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q'> = [
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
];

export function getAccurateElectronConfig(atomicNumber: number): ElectronConfigResult {
  const z = Math.max(1, Math.min(118, Math.floor(atomicNumber)));

  // Start with standard Aufbau fill
  const counts = new Map<string, number>();
  let remaining = z;

  for (const orb of AUFBAU_ORDER) {
    const label = `${orb.n}${orb.l}`;
    if (remaining <= 0) {
      counts.set(label, 0);
      continue;
    }
    const take = Math.min(remaining, orb.max);
    counts.set(label, take);
    remaining -= take;
  }

  // Apply verified ground-state exceptions
  const override = CONFIG_EXCEPTIONS[z];
  if (override) {
    for (const [label, val] of Object.entries(override)) {
      counts.set(label, val);
    }
  }

  // Build ordered subshells (by n then l for scientific presentation, filtering > 0)
  const lOrder: Record<string, number> = { s: 0, p: 1, d: 2, f: 3 };
  const subshells: SubshellEntry[] = AUFBAU_ORDER.map((orb) => {
    const label = `${orb.n}${orb.l}`;
    return {
      n: orb.n,
      l: orb.l,
      label,
      electrons: counts.get(label) ?? 0,
      maxElectrons: orb.max,
    };
  })
    .filter((entry) => entry.electrons > 0)
    .sort((a, b) => (a.n !== b.n ? a.n - b.n : lOrder[a.l] - lOrder[b.l]));

  const fullNotation = subshells.map((s) => `${s.label}${toSuperscript(s.electrons)}`).join(' ');

  // Condensed noble gas notation
  let condensedNotation = fullNotation;
  const baseNoble = NOBLE_GASES.find((ng) => ng.z < z);
  if (baseNoble) {
    const ngConfig = getAccurateElectronConfig(baseNoble.z);
    const ngMap = new Map(ngConfig.subshells.map((s) => [s.label, s.electrons]));
    const outer = subshells.filter((s) => (ngMap.get(s.label) ?? 0) !== s.electrons);
    if (outer.length > 0) {
      condensedNotation = `[${baseNoble.symbol}] ${outer
        .map((s) => `${s.label}${toSuperscript(s.electrons)}`)
        .join(' ')}`;
    }
  }

  // Shell K..Q counts
  const shellCounts = [0, 0, 0, 0, 0, 0, 0];
  for (const s of subshells) {
    if (s.n >= 1 && s.n <= 7) {
      shellCounts[s.n - 1] += s.electrons;
    }
  }

  let highestShellIndex = 0;
  for (let i = 0; i < shellCounts.length; i++) {
    if (shellCounts[i] > 0) highestShellIndex = i;
  }

  const shells: ShellSummary[] = SHELL_NAMES.slice(0, highestShellIndex + 1).map((name, idx) => ({
    shellName: name,
    n: idx + 1,
    electrons: shellCounts[idx],
    maxCapacity: 2 * (idx + 1) * (idx + 1),
  }));

  // Valence electrons: outer shell electrons (+ incomplete d/f for transition relevance, here outer shell s+p count or outer shell total)
  const highestN = highestShellIndex + 1;
  const outerSP = subshells
    .filter((s) => s.n === highestN && (s.l === 's' || s.l === 'p'))
    .reduce((acc, s) => acc + s.electrons, 0);

  const isExperimentalUncertain = z >= 104;
  const uncertaintyNote = isExperimentalUncertain
    ? 'Unsur superberat sintetis: konfigurasi elektron keadaan dasar merupakan prediksi teoretis relativistik karena waktu paruh yang sangat singkat membuat konfirmasi spektroskopi lengkap masih terbatas.'
    : z === 103
      ? 'Pengukuran eksperimental modern menunjukkan Lawrensium memiliki konfigurasi [Rn] 5f¹⁴ 7s² 7p¹ akibat efek relativistik kuat.'
      : undefined;

  return {
    atomicNumber: z,
    subshells,
    fullNotation,
    condensedNotation,
    shells,
    valenceElectrons: outerSP || shellCounts[highestShellIndex],
    isExperimentalUncertain,
    uncertaintyNote,
  };
}

export function buildOrbitalFillingSteps(config: ElectronConfigResult): OrbitalBoxStep[] {
  // Follow Aufbau filling sequence, applying Pauli & Hund inside each subshell
  const subshellMap = new Map(config.subshells.map((s) => [s.label, s]));
  const orderedSubshells: SubshellEntry[] = [];

  for (const orb of AUFBAU_ORDER) {
    const label = `${orb.n}${orb.l}`;
    const found = subshellMap.get(label);
    if (found && found.electrons > 0) {
      orderedSubshells.push(found);
    }
  }

  const steps: OrbitalBoxStep[] = [];
  let idx = 1;

  for (const sub of orderedSubshells) {
    const numBoxes = sub.maxElectrons / 2;
    // First pass: spin-up across boxes (Hund's Rule)
    const firstPassCount = Math.min(sub.electrons, numBoxes);
    for (let box = 0; box < firstPassCount; box++) {
      steps.push({
        stepIndex: idx++,
        subshellLabel: sub.label,
        orbitalIndex: box,
        spin: 'up',
        ruleNote:
          numBoxes > 1 && firstPassCount > 1
            ? `Aturan Hund: mengisi kotak orbital ${sub.label} secara paralel (spin ↑) terlebih dahulu.`
            : `Prinsip Aufbau: mengisi subkulit berenergi terendah ${sub.label}.`,
      });
    }
    // Second pass: spin-down pairing (Pauli Exclusion Principle)
    const secondPassCount = Math.max(0, sub.electrons - numBoxes);
    for (let box = 0; box < secondPassCount; box++) {
      steps.push({
        stepIndex: idx++,
        subshellLabel: sub.label,
        orbitalIndex: box,
        spin: 'down',
        ruleNote: `Larangan Pauli: memasangkan elektron dengan spin berlawanan (↓) pada orbital ${sub.label}.`,
      });
    }
  }

  return steps;
}

export function calculateSubatomicParticles(
  atomicNumber: number,
  massNumber: number,
  charge = 0
): SubatomicParticleCounts {
  const protons = Math.max(1, Math.floor(atomicNumber));
  const roundedMass = Math.max(protons, Math.round(massNumber));
  const neutrons = Math.max(0, roundedMass - protons);
  const electrons = Math.max(0, protons - charge);

  return {
    atomicNumber: protons,
    massNumber: roundedMass,
    protons,
    neutrons,
    electrons,
    charge,
  };
}

export function getDefaultIsotope(element: ElementData): IsotopeData {
  return (
    element.isotopes.find((iso) => iso.isDefault) ??
    element.isotopes[0] ?? {
      massNumber: Math.round(element.atomicMassNumeric),
      symbol: `${Math.round(element.atomicMassNumeric)}${element.symbol}`,
      isStable: element.atomicNumber <= 82 && element.atomicNumber !== 43 && element.atomicNumber !== 61,
      isDefault: true,
    }
  );
}

export interface StableIsotopeMassInfo {
  massNumber: number;
  hasStableIsotope: boolean;
  displayLabel: string;
  isotopeSymbol: string;
}

export function getStableIsotopeMassInfo(element: ElementData): StableIsotopeMassInfo {
  const stableIso =
    element.isotopes.find((iso) => iso.isDefault && iso.isStable) ??
    element.isotopes.find((iso) => iso.isStable);

  if (stableIso) {
    return {
      massNumber: stableIso.massNumber,
      hasStableIsotope: true,
      displayLabel: String(stableIso.massNumber),
      isotopeSymbol: stableIso.symbol,
    };
  }

  const fallback = getDefaultIsotope(element);
  return {
    massNumber: fallback.massNumber,
    hasStableIsotope: false,
    displayLabel: `[${fallback.massNumber}]`,
    isotopeSymbol: fallback.symbol,
  };
}

function stripBalancedParentheses(input: string): string {
  let out = '';
  let depth = 0;
  for (const ch of input) {
    if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      if (depth > 0) depth--;
    } else if (depth === 0) {
      out += ch;
    }
  }
  return out;
}

export function getCompactOxidationStates(oxidationStates: string): string {
  const trimmed = oxidationStates.trim();

  // Predicted superheavy oxidation states (e.g. "Belum terkonfirmasi ... (diprediksi +3, +1, +6)")
  if (/^belum\s+terkonfirmasi/i.test(trimmed)) {
    const nums = trimmed.match(/[+-]\d+|\b0\b/g) ?? [];
    if (nums.length > 0) {
      return `(${nums.join(',')})`;
    }
    return '?';
  }

  const withoutParens = stripBalancedParentheses(trimmed);

  // Range notation like "-4 sampai +4"
  const rangeMatch = withoutParens.match(/([+-]?\d+)\s+sampai\s+([+-]?\d+)/i);
  if (rangeMatch && !withoutParens.includes(',')) {
    return `${rangeMatch[1]}..${rangeMatch[2]}`;
  }

  const parts = withoutParens
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const tokens: string[] = [];
  for (const part of parts) {
    if (/sampai/i.test(part)) continue;
    const match = part.match(/^[+-]?\d+/);
    if (match && !tokens.includes(match[0])) {
      tokens.push(match[0]);
    }
  }

  if (tokens.length > 0) {
    return tokens.join(',');
  }

  return trimmed;
}

export function getPeriodicGridPosition(element: ElementData): { row: number; col: number } {
  const z = element.atomicNumber;
  if (z >= 57 && z <= 71) {
    return { row: 9, col: 4 + (z - 57) };
  }
  if (z >= 89 && z <= 103) {
    return { row: 10, col: 4 + (z - 89) };
  }
  return {
    row: element.period,
    col: element.group ?? 3,
  };
}

export function filterElements(
  elements: ElementData[],
  query: string,
  category: ElementCategory | 'all'
): ElementData[] {
  const normalizedQuery = query.trim().toLowerCase();

  return elements.filter((el) => {
    if (category !== 'all' && el.category !== category) {
      return false;
    }
    if (!normalizedQuery) return true;

    return (
      String(el.atomicNumber) === normalizedQuery ||
      el.symbol.toLowerCase() === normalizedQuery ||
      el.symbol.toLowerCase().includes(normalizedQuery) ||
      el.name.toLowerCase().includes(normalizedQuery) ||
      el.internationalName.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function buildIndonesianNarrationScript(
  element: ElementData,
  isotope: IsotopeData,
  config: ElectronConfigResult
): string {
  const particles = calculateSubatomicParticles(element.atomicNumber, isotope.massNumber, 0);
  const categoryName = CATEGORY_META[element.category].label;
  const posisi =
    element.group !== null
      ? `golongan ${element.group}, periode ${element.period}, blok ${element.block}`
      : `deret ${categoryName}, periode ${element.period}, blok ${element.block}`;

  return [
    `Unsur ${element.name}, dengan simbol kimia ${element.symbol}, memiliki nomor atom ${element.atomicNumber} dan massa atom relatif ${element.atomicMass}.`,
    `Dalam tabel periodik, unsur ini terletak pada ${posisi}, dan termasuk kategori ${categoryName}.`,
    `Secara fisik pada suhu ruang 25 derajat Celsius, ${element.name} berwujud ${element.stateAt25C.toLowerCase()}, berwarna ${element.color.toLowerCase()}, dengan massa jenis ${element.density}, titik leleh ${element.meltingPoint}, dan titik didih ${element.boilingPoint}.`,
    `Secara kimia, ${element.name} memiliki bilangan oksidasi umum ${element.oxidationStates}, keelektronegatifan ${element.electronegativity}, dan reaktivitas ${element.reactivity.toLowerCase()}.`,
    `Konfigurasi elektron ${element.name} adalah ${config.fullNotation}.`,
    `Pada model isotop ${isotope.symbol} dengan nomor massa ${particles.massNumber}, atom netral unsur ini tersusun atas ${particles.protons} proton, ${particles.neutrons} neutron, dan ${particles.electrons} elektron.`,
    `Di alam, ${element.name} ditemukan dengan kelimpahan ${element.crustalAbundance.toLowerCase()}, biasanya dalam bentuk ${element.naturalForm.toLowerCase()}.`,
    `Dalam kehidupan dan teknologi, unsur ini dimanfaatkan untuk ${element.everydayUses.toLowerCase()}, serta ${element.modernTechUses.toLowerCase()}.`,
    `Fakta unik yang menarik: ${element.uniqueFact}`,
  ].join(' ');
}
