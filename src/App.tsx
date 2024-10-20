import { createEffect, createSignal, onCleanup } from "solid-js";
import { GamepadObserver } from "gamepad-state";

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

  createEffect(() => {
    console.log(getGamepad());
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