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

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.textFont('Inter, Helvetica, sans-serif');

    input = p.createInput('25');
    startButton = p.createButton('Start');
    skipButton = p.createButton('Skip');
    resetButton = p.createButton('Reset');
    const buttons = [startButton, skipButton, resetButton];
    const uiY = 40, uiCenter = p.width / 2;

    let uiBar = p.createDiv();
    uiBar.position(p.width / 2 - 180, uiY - 20);
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

    glassTop = p.height / 2 - 200;
    glassBottom = p.height / 2 + 200;
  };

  // Ice cubes
  for (let i = 0; i < numIceCubes; i++) iceCubes.push(createCube());
  separateCubes();

  p.draw = function () {
    if (typeof totalTime === 'number' && typeof remainingTime === 'number') {
      drawBeverage();
      drawIceCubes();
      timerText();
    }

    setGradient(p.color('#cbe4ff'), p.color('#eaf5ff'));
    drawGlass();
  
    if (isRunning) {
      remainingTime = totalTime - (p.millis() - startTime);
      if (remainingTime <= 0) {
        if (isWork) startBreak();
        else startWork();
      }
    }
  };

  // Function to draw background
  function setGradient(c1, c2) {
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }
  }

  // Function to draw the glass
  function drawGlass() {
    let glassX = p.width / 2;
    let glassY = (glassTop + glassBottom) / 2;
    let glassH = glassBottom - glassTop;
    let glassW = 240;
    p.fill(0, 0, 0, 20);
    p.rect(glassX + 5, glassY + 5, glassW, glassH, 50);
    p.stroke(255, 255, 255, 120);
    p.strokeWeight(4);
    p.fill(255, 255, 255, 60);
    p.rect(glassX, glassY, glassW, glassH, 50);
  }

  // Function to draw beverage
 function drawBeverage() {
  let glassX = p.width / 2;
  let glassW = 240;
  let bevHeight = p.map(remainingTime, 0, totalTime, 0, 400);
  let yTop = glassBottom - bevHeight;
  p.noStroke();
  let c = isWork ? p.color(100, 170, 255, 180) : p.color(150, 230, 180, 180);
  p.fill(c);
  p.rect(glassX, (yTop + glassBottom) / 2, glassW - 12, bevHeight, 30);
}

  // Function to draw ice cubes
  function drawIceCubes() {
    for (let cube of iceCubes) {
      let meltProgress = p.map(remainingTime, totalTime, 0, 1, 0);
      let shrink = cube.size * (1 - meltProgress * 0.5);
      let floatY = p.sin(frameCount * cube.speed + cube.offset) * 5;
      let floatX = p.cos(frameCount * cube.speed * 0.8 + cube.offset) * 3;
      let rot = p.sin(frameCount * cube.speed * 1.2 + cube.offset) * 0.1;

      p.push();
      p.translate(cube.x + floatX, cube.y + floatY);
      p.rotate(rot);
      p.fill(255, 255, 255, 120);
      p.stroke(255, 255, 255, 220);
      p.strokeWeight(2.5);
      p.rect(0, 0, shrink, shrink, 10);
      p.pop();
    }
  }

  // Function for timer text
  function timerText() {
    let minutes = p.floor(remainingTime / 60000);
    let seconds = p.floor((remainingTime % 60000) / 1000);
    let label = isWork ? "Focus" : "Break";
    p.textSize(42);
    p.fill(50, 80, 120, 220);
    p.text(`${label}`, p.width / 2, p.height - 140);
    p.textSize(36);
    p.fill(60, 60, 80, 200);
    p.text(`${p.nf(minutes, 2)}:${p.nf(seconds, 2)}`, p.width / 2, p.height - 100);
  }

  // Ice cube helpers
  function createCube() {
    iceCubes = [];
    return {
      x: p.width / 2 + p.random(-90, 90),
      y: p.random(glassTop + 140, glassBottom - 100),
      size: 100,
      offset: p.random(p.TWO_PI),
      speed: p.random(0.01, 0.03),
    };
  }

  function separateCubes() {
    let separation = 120;
    for (let i = 0; i < iceCubes.length; i++) {
      for (let j = i + 1; j < iceCubes.length; j++) {
        let a = iceCubes[i], b = iceCubes[j];
        let d = p.dist(a.x, a.y, b.x, b.y);
        if (d < separation) {
          let angle = atan2(b.y - a.y, b.x - a.x);
          let move = (separation - d) / 2;
          a.x -= p.cos(angle) * move;
          a.y -= p.sin(angle) * move;
                  b.x += p.cos(angle) * move;
          b.y += p.sin(angle) * move;
        }
      }
    }
  }

  // Timer control functions
  function startTimer() {
    if (!isRunning) {
      totalTime = p.int(input.value()) * 60 * 1000;
      remainingTime = totalTime;
      startTime = p.millis();
      isRunning = true;
    }
  }

  function startBreak() {
    isWork = false;
    totalTime = 5 * 60 * 1000;
    remainingTime = totalTime;
    startTime = p.millis();
  }

  function startWork() {
    isWork = true;
    totalTime = p.int(input.value()) * 60 * 1000;
    remainingTime = totalTime;
    startTime = p.millis();
  }

  function skipCycle() {
    if (isWork) startBreak();
    else startWork();
  }

  function resetTimer() {
    isRunning = false;
    isWork = true;
    totalTime = p.int(input.value()) * 60 * 1000;
    remainingTime = totalTime;
  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
