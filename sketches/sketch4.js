// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let iceCubes = [];
  let running = false;
  let inBreak = false;
  let startTime = null;
  let timeRemaining = 0;
  let totalDuration = 0;
  let breakTimeRemaining = 0;
  let breakTotalDuration = 5 * 60 * 1000;
  let startButton, pauseButton, resetButton, skipButton;
  let focusInput, breakInput;


  p.setup = function () {
     p.createCanvas(p.windowWidth, p.windowHeight);
     p.textFont("Inter, Helvetica, Arial, sans-serif");
  };

   p.draw = function () {

   }

   // Functions for timer UI
   

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
