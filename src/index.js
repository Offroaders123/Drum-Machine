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
Object.keys(instruments).forEach(instrument => {
  var audio = new Audio(instruments[instrument].url);
  audio.currentTime = ("start" in instruments[instrument]) ? instruments[instrument].start : 0;
  audio.volume = ("volume" in instruments[instrument]) ? instruments[instrument].volume : 1;
  instruments[instrument].audio = audio;
  document.addEventListener("keydown",event => {
    if (!instruments[instrument].keys.includes(event.key)) return;
    if (instrument == "hi_hat_open"){
      instruments.hi_hat_closed.audio.pause();
      instruments.hi_hat_closed.audio.currentTime = ("start" in instruments.hi_hat_closed) ? instruments.hi_hat_closed.start : 0;
    }
    if (instrument == "hi_hat_closed"){
      instruments.hi_hat_open.audio.pause();
      instruments.hi_hat_open.audio.currentTime = ("start" in instruments.hi_hat_open) ? instruments.hi_hat_open.start : 0;
    }
    audio.currentTime = ("start" in instruments[instrument]) ? instruments[instrument].start : 0;
    audio.play();
  });
});