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
    
  };

  // Function to draw background
  function setGradient(c1, c2) {
    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(0, y, width, y);
    }
  }

  // Function to draw the glass
  function drawGlass() {
    let glassX = width / 2;
    let glassY = (glassTop + glassBottom) / 2;
    let glassH = glassBottom - glassTop;
    let glassW = 240;
    fill(0, 0, 0, 20);
    rect(glassX + 5, glassY + 5, glassW, glassH, 50);
    stroke(255, 255, 255, 120);
    strokeWeight(4);
    fill(255, 255, 255, 60);
    rect(glassX, glassY, glassW, glassH, 50);
  }

  // Function to draw beverage
 function drawBeverage() {
  let glassX = width / 2;
  let glassW = 240;
  let bevHeight = map(remainingTime, 0, totalTime, 0, 400);
  let yTop = glassBottom - bevHeight;
  noStroke();
  let c = isWork ? color(100, 170, 255, 180) : color(150, 230, 180, 180);
  fill(c);
  rect(glassX, (yTop + glassBottom) / 2, glassW - 12, bevHeight, 30);
}

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
