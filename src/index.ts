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

class Instrument {
  readonly keys: string[];
  readonly start: number;
  readonly volume: number;
  readonly url: string;
  private readonly audio: HTMLAudioElement;

  constructor({ keys, start = 0, volume = 1, url }: InstrumentOptions) {
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

const instruments: Record<string, Instrument> = {
  bass: new Instrument({
    keys: ["v", "b"],
    start: 0.105,
    url: bass
  }),
  snare: new Instrument({
    keys: ["n", "m"],
    start: 0.201,
    volume: 0.85,
    url: snare
  }),
  crash: new Instrument({
    keys: ["j"],
    start: 0.2,
    volume: 0.3,
    url: crash
  }),
  hiHatOpen: new Instrument({
    keys: ["k"],
    url: hiHatOpen
  }),
  hiHatClosed: new Instrument({
    keys: ["l"],
    url: hiHatClosed
  }),
  china: new Instrument({
    keys: ["i"],
    volume: 0.3,
    url: china
  }),
  triangle: new Instrument({
    keys: ["o"],
    volume: 0.4,
    url: triangle
  }),
  bell: new Instrument({
    keys: ["u"],
    volume: 0.4,
    url: bell
  })
};

for (const key of Object.keys(instruments)) {
  const instrument: Instrument = instruments[key]!;
  document.addEventListener("keydown", event => {
    if (!instrument.keys.includes(event.key)) return;
    if (key == "hiHatOpen") {
      const hiHatClosed: Instrument = instruments["hiHatClosed"]!;
      hiHatClosed!.pause();
      hiHatClosed!.currentTime = hiHatClosed.start;
    }
    if (key == "hiHatClosed") {
      const hiHatOpen: Instrument = instruments["hiHatOpen"]!;
      hiHatOpen!.pause();
      hiHatOpen!.currentTime = hiHatOpen.start;
    }
    instrument.currentTime = instrument.start;
    instrument.play();
  });
}