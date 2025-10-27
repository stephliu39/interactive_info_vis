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

    let uiBar = createDiv();
    uiBar.position(width / 2 - 180, uiY - 20);
    uiBar.size(360, 70);
    uiBar.style('background', 'rgba(255,255,255,0.4)');
    uiBar.style('backdrop-filter', 'blur(12px)');
    uiBar.style('border-radius', '16px');
    uiBar.style('box-shadow', '0 8px 20px rgba(0,0,0,0.1)');

    input.parent(uiBar);
    startButton.parent(uiBar);
    skipButton.parent(uiBar);
    resetButton.parent(uiBar);

    input.position(40, 18);
    input.size(60);
    input.style('font-size', '18px');
    input.style('border', 'none');
    input.style('border-radius', '8px');
    input.style('padding', '6px 10px');
    input.style('text-align', 'center');
    input.style('background', 'rgba(255,255,255,0.6)');
    input.style('color', '#2a4a7a');
    input.style('outline', 'none');

    let bx = 130;
    buttons.forEach((b) => {
      b.position(bx, 18);
      b.size(50);
      bx += 70;
      b.style('font-size', '22px');
      b.style('border', 'none');
      b.style('border-radius', '12px');
      b.style('background', 'rgba(255,255,255,0.6)');
      b.style('color', '#2a4a7a');
      b.style('cursor', 'pointer');
      b.style('transition', 'background 0.2s, transform 0.1s');
      b.mouseOver(() => b.style('background', 'rgba(255,255,255,0.8)'));
      b.mousePressed(() => b.style('transform', 'scale(0.95)'));
      b.mouseReleased(() => b.style('transform', 'scale(1)'));
    });

    startButton.mousePressed(startTimer);
    skipButton.mousePressed(skipCycle);
    resetButton.mousePressed(resetTimer);

    glassTop = height / 2 - 200;
    glassBottom = height / 2 + 200;

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
