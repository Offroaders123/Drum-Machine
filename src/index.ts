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
  private context: AudioContext | null = null;
  private buffer: AudioBuffer | null = null;

  constructor(id: K, { keys, start = 0, volume = 1, url }: InstrumentOptions) {
    this.id = id;
    this.keys = keys;
    this.start = start;
    this.volume = volume;
    this.url = url;
    this.load();
  }

  private async load(): Promise<void> {
    this.context = new AudioContext({ latencyHint: "interactive" });
    const response: Response = await fetch(this.url);
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    this.buffer = await this.context.decodeAudioData(arrayBuffer);
  }

  async play(): Promise<void> {
    if (this.context!.state === "suspended") {
      await this.context!.resume();
    }

    const source: AudioBufferSourceNode = this.context!.createBufferSource();
    source.buffer = this.buffer;

    const gainNode: GainNode = this.context!.createGain();
    gainNode.gain.value = this.volume;

    source.connect(gainNode);
    gainNode.connect(this.context!.destination);

    source.start(this.context!.currentTime, this.start);
  }

  async pause(): Promise<void> {
    await this.context!.suspend();
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
    start: 0.149,
    volume: 0.85,
    url: snare
  }),
  crash: new Instrument("crash", {
    keys: ["j"],
    start: 0.2,
    volume: 0.27,
    url: crash
  }),
  hiHatOpen: new Instrument("hiHatOpen", {
    keys: ["k"],
    volume: 1.6,
    url: hiHatOpen
  }),
  hiHatClosed: new Instrument("hiHatClosed", {
    keys: ["l"],
    volume: 1.9,
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
  document.addEventListener("keydown", async event => {
    if (!(event.key in keysMap)) return;
    const instrument: Instrument = keysMap[event.key]!;
    if (instrument.id == "hiHatOpen") {
      const hiHatClosed = instruments.hiHatClosed satisfies Instrument;
      await hiHatClosed.pause();
    }
    if (instrument.id == "hiHatClosed") {
      const hiHatOpen = instruments.hiHatOpen satisfies Instrument;
      await hiHatOpen.pause();
    }
    await instrument.play();
  });
}