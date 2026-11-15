export type NarratorStatus = 'idle' | 'speaking' | 'paused' | 'unsupported';

export interface NarratorState {
  status: NarratorStatus;
  hasIndonesianVoice: boolean;
  voiceName: string | null;
  notice?: string;
}

class IndonesianNarratorController {
  private currentText = '';
  private listeners = new Set<(state: NarratorState) => void>();
  private state: NarratorState = {
    status: 'idle',
    hasIndonesianVoice: false,
    voiceName: null,
  };
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.refreshVoices();
      window.speechSynthesis.addEventListener?.('voiceschanged', () => {
        this.refreshVoices();
      });
    } else {
      this.state = {
        status: 'unsupported',
        hasIndonesianVoice: false,
        voiceName: null,
        notice: 'Browser ini belum mendukung Web Speech API SpeechSynthesis. Anda tetap dapat membaca transkrip penjelasan lengkap di bawah ini.',
      };
    }
  }

  private pickIndonesianVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer exact id-ID / id_ID natural voices (Google Bahasa Indonesia, Damayanti, Ardi, Gadis)
    const idVoices = voices.filter((v) => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      return lang === 'id-id' || lang.startsWith('id-');
    });

    if (idVoices.length === 0) return null;

    const preferredOrder = ['google', 'damayanti', 'gadis', 'ardi', 'natural', 'online'];
    for (const keyword of preferredOrder) {
      const match = idVoices.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }
    return idVoices[0];
  }

  refreshVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
    }
    const idVoice = this.pickIndonesianVoice();
    this.state = {
      ...this.state,
      hasIndonesianVoice: Boolean(idVoice),
      voiceName: idVoice ? idVoice.name : null,
      notice:
        this.voicesLoaded && !idVoice
          ? 'Suara bahasa Indonesia (id-ID) tidak terpasang di perangkat/browser ini. Narasi akan mencoba bahasa default atau Anda dapat membaca teks narasi lengkap.'
          : undefined,
    };
    this.emit();
  }

  getState(): NarratorState {
    return this.state;
  }

  subscribe(listener: (state: NarratorState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  speak(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.state = {
        ...this.state,
        status: 'unsupported',
        notice: 'Browser tidak mendukung narasi suara otomatis. Silakan baca teks penjelasan lengkap.',
      };
      this.emit();
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    this.refreshVoices();
    this.currentText = text;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    const idVoice = this.pickIndonesianVoice();
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => {
      this.state = { ...this.state, status: 'speaking' };
      this.emit();
    };

    utterance.onpause = () => {
      this.state = { ...this.state, status: 'paused' };
      this.emit();
    };

    utterance.onresume = () => {
      this.state = { ...this.state, status: 'speaking' };
      this.emit();
    };

    utterance.onend = () => {
      this.state = { ...this.state, status: 'idle' };
      this.emit();
    };

    utterance.onerror = () => {
      this.state = {
        ...this.state,
        status: 'idle',
        notice: this.state.hasIndonesianVoice
          ? undefined
          : 'Suara bahasa Indonesia (id-ID) tidak tersedia pada perangkat ini. Silakan baca transkrip narasi di layar.',
      };
      this.emit();
    };

    this.state = { ...this.state, status: 'speaking' };
    this.emit();
    synth.speak(utterance);
  }

  pause(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      this.state = { ...this.state, status: 'paused' };
      this.emit();
    }
  }

  resume(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.state = { ...this.state, status: 'speaking' };
      this.emit();
    } else if (this.state.status === 'idle' && this.currentText) {
      this.speak(this.currentText);
    }
  }

  stop(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (this.state.status !== 'unsupported') {
      this.state = { ...this.state, status: 'idle' };
      this.emit();
    }
  }
}

export const indonesianNarrator = new IndonesianNarratorController();
