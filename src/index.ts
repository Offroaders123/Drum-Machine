import bass from "./inst/bass.mp3";
import snare from "./inst/snare.mp3";
import crash from "./inst/crash.mp3";
import hiHatOpen from "./inst/hiHatOpen.mp3";
import hiHatClosed from "./inst/hiHatClosed.mp3";
import china from "./inst/china.mp3";
import triangle from "./inst/triangle.mp3";
import bell from "./inst/bell.mp3";

interface Instrument {
  keys: string[];
  start?: number;
  volume?: number;
  url: string;
  audio?: HTMLAudioElement;
}

var instruments: Record<string, Instrument> = {
  bass: {
    keys: ["v","b"],
    start: 0.105,
    url: bass
  },
  snare: {
    keys: ["n","m"],
    start: 0.201,
    volume: 0.85,
    url: snare
  },
  crash: {
    keys: ["j"],
    start: 0.2,
    volume: 0.3,
    url: crash
  },
  hi_hat_open: {
    keys: ["k"],
    url: hiHatOpen
  },
  hi_hat_closed: {
    keys: ["l"],
    url: hiHatClosed
  },
  china: {
    keys: ["i"],
    volume: 0.3,
    url: china
  },
  triangle: {
    keys: ["o"],
    volume: 0.4,
    url: triangle
  },
  bell: {
    keys: ["u"],
    volume: 0.4,
    url: bell
  }
};
Object.keys(instruments).forEach(key => {
  var instrument: Instrument = instruments[key]!;
  var audio = new Audio(instrument.url);
  audio.currentTime = (instrument.start !== undefined) ? instrument.start : 0;
  audio.volume = (instrument.volume !== undefined) ? instrument.volume : 1;
  instrument.audio = audio;
  document.addEventListener("keydown",event => {
    if (!instrument.keys.includes(event.key)) return;
    if (key == "hi_hat_open"){
      var hi_hat_closed: Instrument = instruments["hi_hat_closed"]!;
      hi_hat_closed.audio!.pause();
      hi_hat_closed.audio!.currentTime = (hi_hat_closed.start !== undefined) ? hi_hat_closed.start : 0;
    }
    if (key == "hi_hat_closed"){
      var hi_hat_open: Instrument = instruments["hi_hat_open"]!;
      hi_hat_open.audio!.pause();
      hi_hat_open.audio!.currentTime = (hi_hat_open.start !== undefined) ? hi_hat_open.start : 0;
    }
    audio.currentTime = (instrument.start !== undefined) ? instrument.start : 0;
    audio.play();
  });
});