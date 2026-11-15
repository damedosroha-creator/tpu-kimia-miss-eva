import test from 'node:test';
import assert from 'node:assert/strict';
import { ELEMENTS, getElementByNumber } from '../data/elements';
import {
  buildIndonesianNarrationScript,
  buildOrbitalFillingSteps,
  calculateSubatomicParticles,
  filterElements,
  getAccurateElectronConfig,
  getCompactOxidationStates,
  getDefaultIsotope,
  getPeriodicGridPosition,
  getStableIsotopeMassInfo,
} from './chemistry';

test('database contains complete 1..118 elements with unique symbols and non-colliding grid positions', () => {
  assert.equal(ELEMENTS.length, 118);

  const seenNumbers = new Set<number>();
  const seenSymbols = new Set<string>();
  const seenPositions = new Set<string>();

  for (let z = 1; z <= 118; z++) {
    const el = getElementByNumber(z);
    assert.ok(el, `Element ${z} must exist`);
    assert.equal(el.atomicNumber, z);
    assert.ok(!seenNumbers.has(z), `Duplicate atomicNumber ${z}`);
    seenNumbers.add(z);

    assert.ok(!seenSymbols.has(el.symbol), `Duplicate symbol ${el.symbol}`);
    seenSymbols.add(el.symbol);

    const pos = getPeriodicGridPosition(el);
    const key = `${pos.row}:${pos.col}`;
    assert.ok(!seenPositions.has(key), `Grid position collision at ${key} for ${el.symbol}`);
    seenPositions.add(key);

    assert.ok(el.isotopes.length >= 1, `Element ${el.symbol} must have at least 1 isotope`);
  }
});

test('all 118 electron configurations sum to Z and match shells K..Q', () => {
  for (const el of ELEMENTS) {
    const cfg = getAccurateElectronConfig(el.atomicNumber);
    const totalFromSubshells = cfg.subshells.reduce((sum, s) => sum + s.electrons, 0);
    const totalFromShells = cfg.shells.reduce((sum, s) => sum + s.electrons, 0);

    assert.equal(totalFromSubshells, el.atomicNumber, `Subshell sum mismatch for Z=${el.atomicNumber}`);
    assert.equal(totalFromShells, el.atomicNumber, `Shell sum mismatch for Z=${el.atomicNumber}`);

    const steps = buildOrbitalFillingSteps(cfg);
    assert.equal(steps.length, el.atomicNumber, `Orbital box steps mismatch for Z=${el.atomicNumber}`);
  }
});

test('critical electron configuration exceptions match IUPAC/NIST ground states', () => {
  const cr = getAccurateElectronConfig(24);
  assert.equal(cr.condensedNotation, '[Ar] 3d⁵ 4s¹');

  const cu = getAccurateElectronConfig(29);
  assert.equal(cu.condensedNotation, '[Ar] 3d¹⁰ 4s¹');

  const pd = getAccurateElectronConfig(46);
  assert.equal(pd.condensedNotation, '[Kr] 4d¹⁰');

  const ag = getAccurateElectronConfig(47);
  assert.equal(ag.condensedNotation, '[Kr] 4d¹⁰ 5s¹');

  const gd = getAccurateElectronConfig(64);
  assert.equal(gd.condensedNotation, '[Xe] 4f⁷ 5d¹ 6s²');

  const au = getAccurateElectronConfig(79);
  assert.equal(au.condensedNotation, '[Xe] 4f¹⁴ 5d¹⁰ 6s¹');

  const lr = getAccurateElectronConfig(103);
  assert.equal(lr.condensedNotation, '[Rn] 5f¹⁴ 7s² 7p¹');

  const og = getAccurateElectronConfig(118);
  assert.equal(og.isExperimentalUncertain, true);
  assert.ok(og.uncertaintyNote);
});

test('subatomic particle calculations accurately track isotope mass numbers', () => {
  const carbon = getElementByNumber(6)!;
  const c12 = calculateSubatomicParticles(carbon.atomicNumber, 12);
  assert.deepEqual(c12, {
    atomicNumber: 6,
    massNumber: 12,
    protons: 6,
    neutrons: 6,
    electrons: 6,
    charge: 0,
  });

  const c14 = calculateSubatomicParticles(carbon.atomicNumber, 14);
  assert.equal(c14.protons, 6);
  assert.equal(c14.neutrons, 8);
  assert.equal(c14.electrons, 6);

  const u235 = calculateSubatomicParticles(92, 235);
  assert.equal(u235.protons, 92);
  assert.equal(u235.neutrons, 143);
  assert.equal(u235.electrons, 92);
});

test('search, category filtering, and Indonesian narration script generation work', () => {
  const byNumber = filterElements(ELEMENTS, '79', 'all');
  assert.equal(byNumber.length, 1);
  assert.equal(byNumber[0].symbol, 'Au');

  const byIndonesianName = filterElements(ELEMENTS, 'Emas', 'all');
  assert.equal(byIndonesianName.length, 1);
  assert.equal(byIndonesianName[0].atomicNumber, 79);

  const nobleGases = filterElements(ELEMENTS, '', 'gas-mulia');
  assert.equal(nobleGases.length, 7);

  const au = getElementByNumber(79)!;
  const iso = getDefaultIsotope(au);
  const cfg = getAccurateElectronConfig(79);
  const script = buildIndonesianNarrationScript(au, iso, cfg);
  assert.ok(script.includes('Emas'));
  assert.ok(script.includes('Au'));
  assert.ok(script.includes('79'));
  assert.ok(script.includes('proton'));
  assert.ok(script.includes('neutron'));
});

test('all 118 elements expose concise stable isotope mass numbers and compact biloks for front tiles', () => {
  for (const el of ELEMENTS) {
    const stable = getStableIsotopeMassInfo(el);
    assert.ok(stable.massNumber >= el.atomicNumber, `Mass number must be >= Z for ${el.symbol}`);
    assert.ok(stable.displayLabel.length >= 1, `Missing isotope mass label for ${el.symbol}`);

    const biloks = getCompactOxidationStates(el.oxidationStates);
    assert.ok(biloks.length >= 1 && biloks.length <= 16, `Compact biloks "${biloks}" out of range for ${el.symbol}`);
    assert.ok(!biloks.includes(' '), `Compact biloks "${biloks}" should have no whitespace for ${el.symbol}`);
  }

  assert.equal(getStableIsotopeMassInfo(getElementByNumber(6)!).displayLabel, '12');
  assert.equal(getStableIsotopeMassInfo(getElementByNumber(26)!).displayLabel, '56');
  assert.equal(getStableIsotopeMassInfo(getElementByNumber(43)!).displayLabel, '[98]');
  assert.equal(getStableIsotopeMassInfo(getElementByNumber(49)!).displayLabel, '113');
  assert.equal(getStableIsotopeMassInfo(getElementByNumber(79)!).displayLabel, '197');
  assert.equal(getStableIsotopeMassInfo(getElementByNumber(118)!).displayLabel, '[294]');

  assert.equal(getCompactOxidationStates(getElementByNumber(1)!.oxidationStates), '-1,+1');
  assert.equal(getCompactOxidationStates(getElementByNumber(6)!.oxidationStates), '-4..+4');
  assert.equal(getCompactOxidationStates(getElementByNumber(8)!.oxidationStates), '-2,-1,+2');
  assert.equal(getCompactOxidationStates(getElementByNumber(26)!.oxidationStates), '+2,+3,+6');
  assert.equal(getCompactOxidationStates(getElementByNumber(118)!.oxidationStates), '(+2,+4,0)');
});
