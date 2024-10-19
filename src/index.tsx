import { Instrument } from "./Instrument.js";
import bass from "./inst/bass.mp3";
import snare from "./inst/snare.mp3";
import crash from "./inst/crash.mp3";
import hiHatOpen from "./inst/hiHatOpen.mp3";
import hiHatClosed from "./inst/hiHatClosed.mp3";
import china from "./inst/china.mp3";
import triangle from "./inst/triangle.mp3";
import bell from "./inst/bell.mp3";

const context = new AudioContext({ latencyHint: "interactive" });

const instruments = {
  bass: new Instrument("bass", context, {
    keys: ["v", "b"],
    start: 0.105,
    url: bass
  }),
  snare: new Instrument("snare", context, {
    keys: ["n", "m"],
    start: 0.149,
    volume: 0.85,
    url: snare
  }),
  crash: new Instrument("crash", context, {
    keys: ["j"],
    start: 0.2,
    volume: 0.27,
    url: crash
  }),
  hiHatOpen: new Instrument("hiHatOpen", context, {
    keys: ["k"],
    volume: 1.6,
    url: hiHatOpen
  }),
  hiHatClosed: new Instrument("hiHatClosed", context, {
    keys: ["l"],
    volume: 1.9,
    url: hiHatClosed
  }),
  china: new Instrument("china", context, {
    keys: ["i"],
    volume: 0.3,
    url: china
  }),
  triangle: new Instrument("triangle", context, {
    keys: ["o"],
    volume: 0.4,
    url: triangle
  }),
  bell: new Instrument("bell", context, {
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
    switch (instrument.id) {
      case "hiHatOpen": instruments.hiHatClosed.pause(); break;
      case "hiHatClosed": instruments.hiHatOpen.pause(); break;
    }
    instrument.play();
  });
}