import bass from "./inst/bass.mp3";
import snare from "./inst/snare.mp3";
import crash from "./inst/crash.mp3";
import hiHatOpen from "./inst/hiHatOpen.mp3";
import hiHatClosed from "./inst/hiHatClosed.mp3";
import china from "./inst/china.mp3";
import triangle from "./inst/triangle.mp3";
import bell from "./inst/bell.mp3";

interface InstrumentOptions {
  keys: string[];
  start?: number;
  volume?: number;
  url: string;
}

class Instrument<K extends string = string> {
  readonly id: K;
  readonly keys: string[];
  readonly start: number;
  readonly volume: number;
  readonly url: string;
  private audioContext: AudioContext;
  private buffer?: AudioBuffer;

  constructor(id: K, { keys, start = 0, volume = 1, url }: InstrumentOptions) {
    this.id = id;
    this.keys = keys;
    this.start = start;
    this.volume = volume;
    this.url = url;
    this.audioContext = new AudioContext();

    this.loadAudio();
  }

  // Load the audio buffer for the instrument
  private async loadAudio(): Promise<void> {
    const response = await fetch(this.url);
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  // Play the sound
  play(): void {
    if (!this.buffer) return; // If buffer not ready yet, do nothing

    const source = this.audioContext.createBufferSource();
    source.buffer = this.buffer;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = this.volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(this.audioContext.currentTime, this.start);
  }

  pause(): void {
    this.audioContext.suspend(); // Pause the entire audio context if needed
  }
}

const instruments = {
  bass: new Instrument("bass", {
    keys: ["v", "b"],
    start: 0.105,
    url: bass
  }),
  snare: new Instrument("snare", {
    keys: ["n", "m"],
    start: 0.201,
    volume: 0.85,
    url: snare
  }),
  crash: new Instrument("crash", {
    keys: ["j"],
    start: 0.2,
    volume: 0.3,
    url: crash
  }),
  hiHatOpen: new Instrument("hiHatOpen", {
    keys: ["k"],
    url: hiHatOpen
  }),
  hiHatClosed: new Instrument("hiHatClosed", {
    keys: ["l"],
    url: hiHatClosed
  }),
  china: new Instrument("china", {
    keys: ["i"],
    volume: 0.3,
    url: china
  }),
  triangle: new Instrument("triangle", {
    keys: ["o"],
    volume: 0.4,
    url: triangle
  }),
  bell: new Instrument("bell", {
    keys: ["u"],
    volume: 0.4,
    url: bell
  })
} as const satisfies Record<string, Instrument>;

type Instruments = typeof instruments;

const keysMap: Record<string, Instrument> = generateKeysMap(instruments);

registerHandler(instruments, keysMap);

function generateKeysMap(instruments: Instruments): Record<string, Instrument> {
  const entries: [string, Instrument][] = Object.values(instruments)
    .map(instrument => instrument.keys
      .map((key): [string, Instrument] => [key, instrument]))
    .flat(1);
  return Object.fromEntries(entries);
}

function registerHandler(instruments: Instruments, keysMap: Record<string, Instrument>): void {
  document.addEventListener("keydown", event => {
    if (!(event.key in keysMap)) return;
    const instrument: Instrument = keysMap[event.key]!;
    if (instrument.id == "hiHatOpen") {
      const hiHatClosed = instruments.hiHatClosed satisfies Instrument;
      hiHatClosed.pause();
    }
    if (instrument.id == "hiHatClosed") {
      const hiHatOpen = instruments.hiHatOpen satisfies Instrument;
      hiHatOpen.pause();
    }
    instrument.play(); // This creates a new playback, enabling overlapping sounds
  });
}