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
  private readonly audio: HTMLAudioElement;

  constructor(id: K, { keys, start = 0, volume = 1, url }: InstrumentOptions) {
    this.id = id;
    this.keys = keys;
    this.start = start;
    this.volume = volume;
    this.url = url;
    this.audio = new Audio(this.url);

    this.audio.currentTime = this.start;
    this.audio.volume = this.volume;
  }

  get currentTime(): number {
    return this.audio.currentTime;
  }

  set currentTime(value: number) {
    this.audio.currentTime = value;
  }

  async play(): Promise<void> {
    await this.audio.play();
  }

  pause(): void {
    this.audio.pause();
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

for (const key of Object.keys(instruments) as (keyof typeof instruments)[]) {
  const instrument = instruments[key] satisfies Instrument;
  document.addEventListener("keydown", event => {
    if (!instrument.keys.includes(event.key)) return;
    if (instrument.id == "hiHatOpen") {
      const hiHatClosed = instruments.hiHatClosed satisfies Instrument;
      hiHatClosed.pause();
      hiHatClosed.currentTime = hiHatClosed.start;
    }
    if (instrument.id == "hiHatClosed") {
      const hiHatOpen = instruments.hiHatOpen satisfies Instrument;
      hiHatOpen.pause();
      hiHatOpen.currentTime = hiHatOpen.start;
    }
    instrument.currentTime = instrument.start;
    instrument.play();
  });
}