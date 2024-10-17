/**
 * @typedef {{ keys: string[]; start?: number; volume?: number; url: string; audio?: HTMLAudioElement; }} Instrument
 */

/** @type {Record<string, Instrument>} */
var instruments = {
  bass: {
    keys: ["v","b"],
    start: 0.105,
    url: "./src/inst/bass.mp3"
  },
  snare: {
    keys: ["n","m"],
    start: 0.201,
    volume: 0.85,
    url: "./src/inst/snare.mp3"
  },
  crash: {
    keys: ["j"],
    start: 0.2,
    volume: 0.3,
    url: "./src/inst/crash.mp3"
  },
  hi_hat_open: {
    keys: ["k"],
    url: "./src/inst/hiHatOpen.mp3"
  },
  hi_hat_closed: {
    keys: ["l"],
    url: "./src/inst/hiHatClosed.mp3"
  },
  china: {
    keys: ["i"],
    volume: 0.3,
    url: "./src/inst/china.mp3"
  },
  triangle: {
    keys: ["o"],
    volume: 0.4,
    url: "./src/inst/triangle.mp3"
  },
  bell: {
    keys: ["u"],
    volume: 0.4,
    url: "./src/inst/bell.mp3"
  }
};
Object.keys(instruments).forEach(key => {
  /** @type {Instrument} */
  var instrument = /** @type {Instrument} */ (instruments[key]);
  var audio = new Audio(instrument.url);
  audio.currentTime = (instrument.start !== undefined) ? instrument.start : 0;
  audio.volume = (instrument.volume !== undefined) ? instrument.volume : 1;
  instrument.audio = audio;
  document.addEventListener("keydown",event => {
    if (!instrument.keys.includes(event.key)) return;
    if (key == "hi_hat_open"){
      /** @type {Instrument} */
      var hi_hat_closed = /** @type {Instrument} */ (instruments["hi_hat_closed"]);
      /** @type {HTMLAudioElement} */ (hi_hat_closed.audio).pause();
      /** @type {HTMLAudioElement} */ (hi_hat_closed.audio).currentTime = (hi_hat_closed.start !== undefined) ? hi_hat_closed.start : 0;
    }
    if (key == "hi_hat_closed"){
      /** @type {Instrument} */
      var hi_hat_open = /** @type {Instrument} */ (instruments["hi_hat_open"]);
      /** @type {HTMLAudioElement} */ (hi_hat_open.audio).pause();
      /** @type {HTMLAudioElement} */ (hi_hat_open.audio).currentTime = (hi_hat_open.start !== undefined) ? hi_hat_open.start : 0;
    }
    audio.currentTime = (instrument.start !== undefined) ? instrument.start : 0;
    audio.play();
  });
});