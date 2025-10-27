// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let totalTime, remainingTime;
  let isRunning = false;
  let isWork = true;
  let input, startButton, skipButton, resetButton;
  let startTime;
  let glassTop, glassBottom;
  let numIceCubes = 5;
  let iceCubes = [];
  let bubbles = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    noStroke();
    textFont('Inter, Helvetica, sans-serif');

    input = createInput('25');
    startButton = createButton('Start');
    skipButton = createButton('Skip');
    resetButton = createButton('Reset');
    const buttons = [startButton, skipButton, resetButton];
    const uiY = 40, uiCenter = width / 2;
  };
  p.draw = function () {
    p.background(200, 240, 200);
    p.fill(30, 120, 40);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. C', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
