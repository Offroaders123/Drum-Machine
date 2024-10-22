import { createEffect, createSignal, onCleanup } from "solid-js";
import { GamepadObserver } from "gamepad-state";
import { Instrument } from "./Instrument.js";
import bass from "./inst/bass.mp3";
import snare from "./inst/snare.mp3";
import crash from "./inst/crash.mp3";
import hiHatOpen from "./inst/hiHatOpen.mp3";
import hiHatClosed from "./inst/hiHatClosed.mp3";
import china from "./inst/china.mp3";
import triangle from "./inst/triangle.mp3";
import bell from "./inst/bell.mp3";

export default function App() {
  const [getGamepad, setGamepad] = createSignal<Gamepad | null>(null);

  const observer = new GamepadObserver(record => {
    if (!record.gamepad.mapping) return; // Also related to the Chrome bug below.

    switch (record.type) {
      case "connect":
      case "input": return setGamepad(record.gamepad);
      case "disconnect": return setGamepad(null);
    }
  });

  // This is to account for a bug in Chrome macOS where my SteelSeries Nimbus shows up as two controllers.
  observer.observe(0);
  observer.observe(1);

  const context = new AudioContext({ latencyHint: "interactive" });

  const instruments = {
    bass: new Instrument("bass", context, {
      keys: ["v", "b"],
      buttons: [14, 13],
      start: 0.105,
      url: bass
    }),
    snare: new Instrument("snare", context, {
      keys: ["n", "m"],
      buttons: [15, 12],
      start: 0.149,
      volume: 0.85,
      url: snare
    }),
    crash: new Instrument("crash", context, {
      keys: ["j"],
      buttons: [3],
      start: 0.2,
      volume: 0.27,
      url: crash
    }),
    hiHatOpen: new Instrument("hiHatOpen", context, {
      keys: ["k"],
      buttons: [1],
      volume: 1.6,
      url: hiHatOpen
    }),
    hiHatClosed: new Instrument("hiHatClosed", context, {
      keys: ["l"],
      buttons: [0],
      volume: 1.9,
      url: hiHatClosed
    }),
    china: new Instrument("china", context, {
      keys: ["i"],
      buttons: [],
      volume: 0.3,
      url: china
    }),
    triangle: new Instrument("triangle", context, {
      keys: ["o"],
      buttons: [],
      volume: 0.4,
      url: triangle
    }),
    bell: new Instrument("bell", context, {
      keys: ["u"],
      buttons: [],
      volume: 0.4,
      url: bell
    })
  } as const satisfies Record<string, Instrument>;

  type Instruments = typeof instruments;

  const keysMap: Record<string, Instrument> = generateKeysMap(instruments);
  const buttonsMap: Record<string, Instrument> = generateButtonsMap(instruments);

  registerHandler(instruments, keysMap);

  function generateKeysMap(instruments: Instruments): Record<string, Instrument> {
    const entries: [string, Instrument][] = Object.values(instruments)
      .map(instrument => instrument.keys
        .map((key): [string, Instrument] => [key, instrument]))
      .flat(1);
    return Object.fromEntries(entries);
  }

  function generateButtonsMap(instruments: Instruments): Record<number, Instrument> {
    const entries: [number, Instrument][] = Object.values(instruments)
      .map(instrument => instrument.buttons
        .map(([button]): [number, Instrument] => [button, instrument]))
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

  // console.log(buttonsMap);

  createEffect(() => {
    // console.log(getGamepad());

    const gamepad: Gamepad | null = getGamepad();
    if (gamepad === null) return;

    // console.log("update!!!");

    // console.log(gamepad.buttons.map((button, i): [GamepadButton, number] => [button, i]).filter(([button]) => button.pressed).map(([_, i]) => i));

    for (const [index, button] of gamepad.buttons.entries()) {
      if (!(index in buttonsMap)) continue;

      // console.log(button);
      const instrument: Instrument = buttonsMap[index]!;
      const state: [number, boolean] = instrument.buttons.find(button => button[0] === index)!;
      console.log(instrument, index, state);
      if (state[1] === button.pressed) continue;
      state[1] = button.pressed;
      if (!state[1]) continue;
      instrument.play();
    }
  });

  onCleanup(() => {
    observer.disconnect();
  });

  return (
    <>
      <header>
        <h1>Drum Machine v3</h1>
      </header>
      <main>
        <ul>
          <li>Press V or B for bass drum</li>
          <li>Press N or M for snare</li>
          <li>Press J for crash</li>
          <li>Press K for open hi-hat</li>
          <li>Press L for closed hi-hat</li>
          <li>Press I for china</li>
          <li>Press O for triangle</li>
          <li>Press U for bell</li>
        </ul>
      </main>
    </>
  );
}