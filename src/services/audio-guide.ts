/**
 * Gryfus Audio Guide Service
 * Voice narrative guide using Web Speech API with Polish pronunciation
 */

export interface AudioStory {
  id: string;
  title: string;
  locationName: string;
  coords: [number, number];
  narrativeText: string;
  durationSecondsEst: number;
}

export const NIEBUSZEWO_STORIES: AudioStory[] = [
  {
    id: 'story-kadziak',
    title: 'Tajemnice Parku Kadziaka',
    locationName: 'Park Antoniego Kadziaka',
    coords: [53.4530, 14.5520],
    narrativeText: 'Cześć, tu Gryfus! Witasz w Parku Antoniego Kadziaka. Niegdyś znajdował się tu stary cmentarz ewangelicki założony w dziewiętnastym wieku. Dziś to zielona oaza spokoju, idealna na odpoczynek, z nowoczesną siłownią plenerową i placem zabaw.',
    durationSecondsEst: 20
  },
  {
    id: 'story-dworzec',
    title: 'Zabytkowy Dworzec Niebuszewo',
    locationName: 'Stacja PKP Niebuszewo',
    coords: [53.4554, 14.5587],
    narrativeText: 'Stoisz przed historycznym budynkiem stacji Szczecin Niebuszewo. Zbudowano go w 1898 roku jako część linii do Trzebieży. Przez dekady tętnił życiem kolejowym, a teraz odradza się w ramach Szczecińskiej Kolei Metropolitalnej!',
    durationSecondsEst: 18
  },
  {
    id: 'story-lucznicza',
    title: 'Serce Osiedla: Ulica Łucznicza',
    locationName: 'ulica Łucznicza',
    coords: [53.4535, 14.5505],
    narrativeText: 'Ulica Łucznicza to oś łącząca tradycyjne Niebuszewo z terenami rekreacyjnymi. Znajdziesz tu cenione lokalne piekarnie, rzemieślników i ciche zaułki, z których w kilka minut dojdziesz do Ogrodu Botanicznego i Lasu Arkońskiego.',
    durationSecondsEst: 19
  },
  {
    id: 'story-kollataja',
    title: 'Węzeł Kołłątaja i Manhattan',
    locationName: 'Rondo Giedroycia / Manhattan',
    coords: [53.4475, 14.5518],
    narrativeText: 'Rondo Sybiraków i plac Kołłątaja to brama do północnych dzielnic Szczecina. Tuż obok działa kultowe targowisko Manhattan, gdzie od pokoleń mieszkańcy zaopatrują się w świeże warzywa z regionu i słynne szczecińskie wypieki.',
    durationSecondsEst: 21
  }
];

export class AudioGuideService {
  private isSpeaking = false;
  private currentStoryId: string | null = null;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  getStories(): AudioStory[] {
    return NIEBUSZEWO_STORIES;
  }

  getStoryById(id: string): AudioStory | undefined {
    return NIEBUSZEWO_STORIES.find(s => s.id === id);
  }

  playStory(id: string, onEnd?: () => void): boolean {
    const story = this.getStoryById(id);
    if (!story) return false;

    this.stop();
    this.currentStoryId = id;
    this.isSpeaking = true;

    if (!this.synth) {
      // In non-browser or test environments, simulate completion
      setTimeout(() => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      }, 50);
      return true;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(story.narrativeText);
      utterance.lang = 'pl-PL';
      utterance.rate = 1.0;
      utterance.pitch = 1.05; // Slightly friendly, mascot-like tone

      // Pick Polish voice if available
      const voices = this.synth.getVoices();
      const plVoice = voices.find(v => v.lang.startsWith('pl'));
      if (plVoice) {
        utterance.voice = plVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentStoryId = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentStoryId = null;
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('[AudioGuide] Playback exception:', e);
      this.isSpeaking = false;
      return false;
    }
  }

  pause(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.resume();
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentStoryId = null;
  }

  isPlaying(): boolean {
    return this.isSpeaking;
  }

  getCurrentStoryId(): string | null {
    return this.currentStoryId;
  }
}

export const audioGuideService = new AudioGuideService();
