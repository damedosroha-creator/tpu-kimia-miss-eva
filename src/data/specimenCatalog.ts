import simImg61 from '../assets/images/specimen_61_promethium_1794709344495.jpg';
import simImg86 from '../assets/images/specimen_86_radon_1794709345583.jpg';
import simImg87 from '../assets/images/specimen_87_francium_1794709346655.jpg';
import simImg100 from '../assets/images/specimen_100_fermium_1794709346395.jpg';
import simImg101 from '../assets/images/specimen_101_mendelevium_1794709347243.jpg';
import simImg102 from '../assets/images/specimen_102_nobelium_1794709348373.jpg';
import simImg103 from '../assets/images/specimen_103_lawrencium_1794709347946.jpg';
import simImg104 from '../assets/images/specimen_104_rutherfordium_1794709348708.jpg';
import simImg105 from '../assets/images/specimen_105_dubnium_1794709350018.jpg';
import simImg106 from '../assets/images/specimen_106_seaborgium_1794709349595.jpg';
import simImg107 from '../assets/images/specimen_107_bohrium_1794709350279.jpg';
import simImg108 from '../assets/images/specimen_108_hassium_1794709351611.jpg';
import simImg109 from '../assets/images/specimen_109_meitnerium_1794709352279.jpg';
import simImg110 from '../assets/images/specimen_110_darmstadtium_1794709352080.jpg';
import simImg111 from '../assets/images/specimen_111_roentgenium_1794709352626.jpg';
import simImg112 from '../assets/images/specimen_112_copernicium_1794709354301.jpg';
import simImg113 from '../assets/images/specimen_113_nihonium_1794709354323.jpg';
import simImg114 from '../assets/images/specimen_114_flerovium_1794709354361.jpg';
import simImg115 from '../assets/images/specimen_115_moscovium_1794709355156.jpg';
import simImg116 from '../assets/images/specimen_116_livermorium_1794709355626.jpg';
import simImg117 from '../assets/images/specimen_117_tennessine_clean_1794709375336.jpg';
import simImg118 from '../assets/images/specimen_118_oganesson_1794709355889.jpg';

export interface SpecimenCatalogEntry {
  url: string;
  isSimulated: boolean;
  badgeLabel: 'Spesimen Nyata' | 'SIMULASI ILMIAH';
  credit: string;
}

export const SPECIMEN_CATALOG: Readonly<Record<number, SpecimenCatalogEntry>> = {
  1: {
    url: '/specimens/1-h.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  2: {
    url: '/specimens/2-he.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · GFDL 1.2 (Wikimedia Commons)',
  },
  3: {
    url: '/specimens/3-li.png',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'AdvancedTinkering · CC BY-SA 4.0 (Wikimedia Commons)',
  },
  4: {
    url: '/specimens/4-be.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp = Alchemist-hp (pse-mendelejew.de) · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  5: {
    url: '/specimens/5-b.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'James L Marshall · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  6: {
    url: '/specimens/6-c.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Robert M. Lavinsky · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  7: {
    url: '/specimens/7-n.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Robin Müller · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  8: {
    url: '/specimens/8-o.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Staff Sgt. Nika Glover, U.S. Air Force · Public domain (Wikimedia Commons)',
  },
  9: {
    url: '/specimens/9-f.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Fulvio314 · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  10: {
    url: '/specimens/10-ne.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · GFDL 1.2 (Wikimedia Commons)',
  },
  11: {
    url: '/specimens/11-na.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'The original uploader was Dnn87 at English Wikipedia. · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  12: {
    url: '/specimens/12-mg.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Mark Fergus, CSIRO · CC BY 3.0 (Wikimedia Commons)',
  },
  13: {
    url: '/specimens/13-al.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  14: {
    url: '/specimens/14-si.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Rasiel Suarez on behalf of Luciteria LLC · CC BY-SA 4.0 (Wikimedia Commons)',
  },
  15: {
    url: '/specimens/15-p.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Tomihahndorf · Public domain (Wikimedia Commons)',
  },
  16: {
    url: '/specimens/16-s.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Ivar Leidus · CC BY-SA 4.0 (Wikimedia Commons)',
  },
  17: {
    url: '/specimens/17-cl.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'W. Oelen · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  18: {
    url: '/specimens/18-ar.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · GFDL 1.2 (Wikimedia Commons)',
  },
  19: {
    url: '/specimens/19-k.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  20: {
    url: '/specimens/20-ca.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Original upload by 范皓程 · CC BY 4.0 (Wikimedia Commons)',
  },
  21: {
    url: '/specimens/21-sc.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  22: {
    url: '/specimens/22-ti.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (pse-mendelejew.de) · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  23: {
    url: '/specimens/23-v.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (pse-mendelejew.de). · FAL (Wikimedia Commons)',
  },
  24: {
    url: '/specimens/24-cr.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  25: {
    url: '/specimens/25-mn.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  26: {
    url: '/specimens/26-fe.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  27: {
    url: '/specimens/27-co.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  28: {
    url: '/specimens/28-ni.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  29: {
    url: '/specimens/29-cu.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Native_Copper_Macro_Digon3.jpg: “Jonathan Zander (Digon3)" derivative work: Materialscientist (talk) · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  30: {
    url: '/specimens/30-zn.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  31: {
    url: '/specimens/31-ga.png',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Arònel123 · CC BY 4.0 (Wikimedia Commons)',
  },
  32: {
    url: '/specimens/32-ge.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii · CC BY 3.0 (Wikimedia Commons)',
  },
  33: {
    url: '/specimens/33-as.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Arsen_1.jpg: Original uploader was Tomihahndorf at de.wikipedia derivative work: Materialscientist (talk) · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  34: {
    url: '/specimens/34-se.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'W. Oelen · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  35: {
    url: '/specimens/35-br.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (pse-mendelejew.de) · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  36: {
    url: '/specimens/36-kr.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · GFDL 1.2 (Wikimedia Commons)',
  },
  37: {
    url: '/specimens/37-rb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Dnn87 · CC BY 3.0 (Wikimedia Commons)',
  },
  38: {
    url: '/specimens/38-sr.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  39: {
    url: '/specimens/39-y.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  40: {
    url: '/specimens/40-zr.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (pse-mendelejew.de). · FAL (Wikimedia Commons)',
  },
  41: {
    url: '/specimens/41-nb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  42: {
    url: '/specimens/42-mo.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  43: {
    url: '/specimens/43-tc.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Marco Cardin · CC BY-SA 4.0 (Wikimedia Commons)',
  },
  44: {
    url: '/specimens/44-ru.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  45: {
    url: '/specimens/45-rh.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) www.pse-mendelejew.de derivative work: Purpy Pupple (talk) · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  46: {
    url: '/specimens/46-pd.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Hi-Res Images of Chemical Elements · CC BY 3.0 (Wikimedia Commons)',
  },
  47: {
    url: '/specimens/47-ag.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  48: {
    url: '/specimens/48-cd.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  49: {
    url: '/specimens/49-in.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Nerdtalker · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  50: {
    url: '/specimens/50-sn.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  51: {
    url: '/specimens/51-sb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  52: {
    url: '/specimens/52-te.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  53: {
    url: '/specimens/53-i.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'LHcheM · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  54: {
    url: '/specimens/54-xe.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  55: {
    url: '/specimens/55-cs.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Dnn87 Contact email: Dnn87yahoo.dk · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  56: {
    url: '/specimens/56-ba.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: '范皓程 · CC BY 4.0 (Wikimedia Commons)',
  },
  57: {
    url: '/specimens/57-la.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii (Original uploader was Lanthanum-138 at en.wikipedia · CC BY 3.0 (Wikimedia Commons)',
  },
  58: {
    url: '/specimens/58-ce.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii · CC BY 3.0 (Wikimedia Commons)',
  },
  59: {
    url: '/specimens/59-pr.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii · CC BY 3.0 (Wikimedia Commons)',
  },
  60: {
    url: '/specimens/60-nd.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Hi-Res Images of Chemical Elements · CC BY 3.0 (Wikimedia Commons)',
  },
  62: {
    url: '/specimens/62-sm.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  63: {
    url: '/specimens/63-eu.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii · CC BY 3.0 (Wikimedia Commons)',
  },
  64: {
    url: '/specimens/64-gd.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  65: {
    url: '/specimens/65-tb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  66: {
    url: '/specimens/66-dy.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Materialscientist at en.wikipedia · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  67: {
    url: '/specimens/67-ho.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Sumber Koleksi Unsur · CC BY 3.0 (Wikimedia Commons)',
  },
  68: {
    url: '/specimens/68-er.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Hi-Res Images of Chemical Elements · CC BY 3.0 (Wikimedia Commons)',
  },
  69: {
    url: '/specimens/69-tm.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  70: {
    url: '/specimens/70-yb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Jurii · CC BY 3.0 (Wikimedia Commons)',
  },
  71: {
    url: '/specimens/71-lu.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  72: {
    url: '/specimens/72-hf.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  73: {
    url: '/specimens/73-ta.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  74: {
    url: '/specimens/74-w.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  75: {
    url: '/specimens/75-re.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  76: {
    url: '/specimens/76-os.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  77: {
    url: '/specimens/77-ir.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Hi-Res Images of Chemical Elements · CC BY 3.0 (Wikimedia Commons)',
  },
  78: {
    url: '/specimens/78-pt.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Periodictableru · CC BY 3.0 (Wikimedia Commons)',
  },
  79: {
    url: '/specimens/79-au.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) www.pse-mendelejew.de · CC BY-SA 3.0 de (Wikimedia Commons)',
  },
  80: {
    url: '/specimens/80-hg.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Bionerd · CC BY 3.0 (Wikimedia Commons)',
  },
  81: {
    url: '/specimens/81-tl.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'W. Oelen · CC BY-SA 3.0 (Wikimedia Commons)',
  },
  82: {
    url: '/specimens/82-pb.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  83: {
    url: '/specimens/83-bi.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  84: {
    url: '/specimens/84-po.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: '范皓程 · CC BY 4.0 (Wikimedia Commons)',
  },
  85: {
    url: '/specimens/85-at.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'NuclearAlex · CC BY 4.0 (Wikimedia Commons)',
  },
  88: {
    url: '/specimens/88-ra.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'grenadier · CC BY 3.0 (Wikimedia Commons)',
  },
  89: {
    url: '/specimens/89-ac.png',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Oak Ridge National Laboratory · CC BY 2.0 (Wikimedia Commons)',
  },
  90: {
    url: '/specimens/90-th.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Alchemist-hp (talk) (www.pse-mendelejew.de) · FAL (Wikimedia Commons)',
  },
  91: {
    url: '/specimens/91-pa.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'James St. John · CC BY 2.0 (Wikimedia Commons)',
  },
  92: {
    url: '/specimens/92-u.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Unspecified · Public domain (Wikimedia Commons)',
  },
  93: {
    url: '/specimens/93-np.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Originally by James St. John, edited by Arònel123 · CC BY 2.0 (Wikimedia Commons)',
  },
  94: {
    url: '/specimens/94-pu.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Los Alamos National Laboratory · Attribution (Wikimedia Commons)',
  },
  95: {
    url: '/specimens/95-am.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Bionerd · CC BY 3.0 (Wikimedia Commons)',
  },
  96: {
    url: '/specimens/96-cm.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'James St. John · CC BY 2.0 (Wikimedia Commons)',
  },
  97: {
    url: '/specimens/97-bk.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Oak Ridge National Laboratory, US Department of Energy · Public domain (Wikimedia Commons)',
  },
  98: {
    url: '/specimens/98-cf.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'United States Department of Energy (see File:Einsteinium.jpg) · Public domain (Wikimedia Commons)',
  },
  99: {
    url: '/specimens/99-es.jpg',
    isSimulated: false,
    badgeLabel: 'Spesimen Nyata',
    credit: 'Haire, R. G., US Department of Energy. Touched up by Materialscientist at en.wikipedia. · Public domain (Wikimedia Commons)',
  },
  61: {
    url: simImg61,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  86: {
    url: simImg86,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  87: {
    url: simImg87,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  100: {
    url: simImg100,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  101: {
    url: simImg101,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  102: {
    url: simImg102,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  103: {
    url: simImg103,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  104: {
    url: simImg104,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  105: {
    url: simImg105,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  106: {
    url: simImg106,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  107: {
    url: simImg107,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  108: {
    url: simImg108,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  109: {
    url: simImg109,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  110: {
    url: simImg110,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  111: {
    url: simImg111,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  112: {
    url: simImg112,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  113: {
    url: simImg113,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  114: {
    url: simImg114,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  115: {
    url: simImg115,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  116: {
    url: simImg116,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  117: {
    url: simImg117,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
  118: {
    url: simImg118,
    isSimulated: true,
    badgeLabel: 'SIMULASI ILMIAH',
    credit: 'Simulasi Fotografi Laboratorium Ilmiah (Spesimen Tidak Stabil)',
  },
};
