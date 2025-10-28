// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  const GLASS = { cx: 400, cy: 350, w: 200, h: 320, r: 40 };
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
    createUI();
    initIceCubes();
  };

   p.draw = function () {
    p.background(inBreak ? "#fff6eb" : "#eaf7ff");
    drawGlass();
    if (inBreak) updateBreak();
    else updateMelting();
    drawTimeRemaining();
   }

   // Functions for timer UI
  function createUI() {
    p.createP("Focus (min):").position(230, 660).style(uiLabelStyle());
    focusInput = p.createInput("25").position(340, 657).size(60).style(uiInputStyle());
    p.createP("Break (min):").position(440, 660).style(uiLabelStyle());
    breakInput = p.createInput("5").position(540, 657).size(60).style(uiInputStyle());

    const btnY = 710;
    startButton = makeButton("Start", 190, btnY, toggleTimer);
    pauseButton = makeButton("Pause", 320, btnY, togglePause);
    resetButton = makeButton("Reset", 450, btnY, resetAll);
    skipButton = makeButton("Skip", 580, btnY, skipCycle);
  }

  function uiLabelStyle() {
    return `
      font-family: Inter, sans-serif;
      font-size: 16px;
      color: #333;
    `;
  }

  function makeButton(label, x, y, callback) {
    let btn = p.createButton(label);
    btn.position(x, y);
    btn.mousePressed(callback);
    btn.style(uiButtonStyle());
    btn.mouseOver(() => btn.style(uiButtonHoverStyle()));
    btn.mouseOut(() => btn.style(uiButtonStyle()));
    return btn;
  }

  function uiButtonStyle() {
    return `
      background: linear-gradient(135deg, #007aff, #009eff);
      color: white;
      border: none;
      border-radius: 12px;
      width: 110px;
      padding: 10px 0;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    `;
  }

  function uiButtonHoverStyle() {
    return `
      background: linear-gradient(135deg, #0066d1, #00a4ff);
      color: #fff;
      border: none;
      border-radius: 12px;
      width: 110px;
      padding: 10px 0;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transform: translateY(-1px);
    `;
  }

  function uiInputStyle() {
    return `
      border: 2px solid #c7d3e0;
      border-radius: 6px;
      padding: 6px;
      text-align: center;
      font-size: 14px;
      width: 50px;
      color: #333;
      outline: none;
    `;
  }

  // Functions to draw beverage
  function drawGlass() {
    const topY = GLASS.cy - GLASS.h * 0.35;
    const bottomY = GLASS.cy + GLASS.h * 0.35;
    p.noStroke();
    p.fill(0, 0, 0, 25);
    p.ellipse(GLASS.cx, bottomY + 25, GLASS.w * 0.9, 25);
    p.noStroke();
    p.fill(255, 80);
    p.rectMode(p.CENTER);
    p.rect(GLASS.cx, GLASS.cy, GLASS.w, GLASS.h, GLASS.r);
    let gradTop = topY + GLASS.h * 0.05;
    let gradBottom = bottomY - GLASS.h * 0.1;

  for (let y = gradTop; y < gradBottom; y++) {
    let inter = p.map(y, gradTop, gradBottom, 0, 1);
    let c = p.lerpColor(p.color("#42a4d7cc"), p.color("#8ee8ffcc"), inter);
    if (inter > 0.8) c = p.lerpColor(c, p.color("#2b7ca1cc"), (inter - 0.8) * 2);
    p.stroke(c);
    p.line(GLASS.cx - GLASS.w * 0.43, y, GLASS.cx + GLASS.w * 0.43, y);
  }

  p.noStroke();
  p.fill(255, 60);
  p.beginShape();
  p.vertex(GLASS.cx - GLASS.w * 0.35, gradTop + 10);
  p.vertex(GLASS.cx - GLASS.w * 0.3, gradTop + 10);
  p.vertex(GLASS.cx - GLASS.w * 0.3, gradBottom - 20);
  p.vertex(GLASS.cx - GLASS.w * 0.35, gradBottom - 20);
  p.endShape(p.CLOSE);
  p.noStroke();

  for (let i = 0; i < 25; i++) {
    let alpha = p.map(i, 0, 25, 25, 0);
    p.fill(0, alpha);
    p.rect(GLASS.cx, gradBottom - i, GLASS.w * 0.85, 1);
  }

  // Function to help realistically animate ice cubes
  for (let c of iceCubes) {
    c.x += c.drift.vx;
    c.y += c.drift.vy;
    const floatY = p.sin((p.frameCount * 0.03) + c.floatOffset) * 3;

    const left = GLASS.cx - GLASS.w * 0.4;
    const right = GLASS.cx + GLASS.w * 0.4;
    const top = gradTop;
    const bottom = gradBottom;

    if (c.x < left + c.size / 2 || c.x > right - c.size / 2) c.drift.vx *= -1;
    if (c.y < top + c.size / 2 || c.y > bottom - c.size / 2) c.drift.vy *= -1;

    let s = p.lerp(c.size, c.size * 0.3, c.meltProgress);
    let alpha = p.lerp(220, 50, c.meltProgress);

    p.push();
    p.translate(c.x, c.y + floatY);
    p.rotate(c.angleOffset);
    p.fill(255, alpha);
    p.stroke(255, 90);
    p.strokeWeight(1);
    p.rect(0, 0, s, s, 8);
    p.pop();
  }

  p.noFill();
  p.stroke(255, 120); // lower opacity for glass edge
  p.strokeWeight(3);
  p.rect(GLASS.cx, GLASS.cy, GLASS.w, GLASS.h, GLASS.r);
  p.stroke(255, 70);
  p.strokeWeight(2);
  p.line(GLASS.cx - GLASS.w * 0.45, topY + 20, GLASS.cx - GLASS.w * 0.45, bottomY - 20);
  p.line(GLASS.cx + GLASS.w * 0.45, topY + 20, GLASS.cx + GLASS.w * 0.45, bottomY - 20);
  p.stroke(255, 150);
  p.strokeWeight(2);
  p.arc(GLASS.cx - GLASS.w / 3, GLASS.cy - GLASS.h / 3, 40, 120, p.HALF_PI, p.PI);
}

// Function to create ice cubes
function initIceCubes() {
  iceCubes = [];
  const focusMinutes = parseInt(focusInput.value());
  const totalCubes = Math.max(1, Math.ceil(focusMinutes / 5));

  for (let i = 0; i < totalCubes; i++) {
    iceCubes.push({
      x: GLASS.cx + p.random(-GLASS.w * 0.25, GLASS.w * 0.25),
      y: GLASS.cy + p.random(-GLASS.h * 0.1, GLASS.h * 0.25),
      size: 40,
      drift: { vx: p.random(-0.4, 0.4), vy: p.random(-0.4, 0.4) },
      floatOffset: p.random(1000),
      angleOffset: p.random(-0.3, 0.3),
      meltProgress: 0,
      });
    }
  }

  // Function to handle ice cubes overlapping for more realistic animation
  function handleCubeCollisions() {
    for (let i = 0; i < iceCubes.length; i++) {
      for (let j = i + 1; j < iceCubes.length; j++) {
        const a = iceCubes[i];
        const b = iceCubes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (a.size + b.size) * 0.45;
        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          b.x += nx * overlap;
          b.y += ny * overlap;
        }
      }
    }
  }

  // Function for melting ice cubes over time
  function updateMelting() {
    if (!running || !startTime) return;
    const elapsed = p.millis() - startTime;
    const focusMinutes = parseInt(focusInput.value());
    const cubeDuration = 5 * 60 * 1000;
    totalDuration = focusMinutes * 60 * 1000;

    for (let i = 0; i < iceCubes.length; i++) {
      const cubeStart = i * cubeDuration;
      const cubeEnd = cubeStart + cubeDuration;
      if (elapsed >= cubeEnd) {
        iceCubes[i].meltProgress = 1;
      } else if (elapsed >= cubeStart) {
        iceCubes[i].meltProgress = p.map(elapsed, cubeStart, cubeEnd, 0, 1);
      }
    }

    timeRemaining = Math.max(totalDuration - elapsed, 0);
    if (elapsed >= totalDuration) startBreak();
  }

  // Functions to handle break cycles
  function startBreak() {
    inBreak = true;
    running = true;
    startTime = p.millis();
    breakTotalDuration = parseInt(breakInput.value()) * 60 * 1000;
    breakTimeRemaining = breakTotalDuration;
  }

  function updateBreak() {
    if (!running || !startTime) return;
    const elapsed = p.millis() - startTime;
    breakTimeRemaining = Math.max(breakTotalDuration - elapsed, 0);
    if (elapsed >= breakTotalDuration) {
      running = false;
      inBreak = false;
      startTime = null;
      initIceCubes();
    }
  }

  // Functions for visual display
  function drawTimeRemaining() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.noStroke();

    if (!running && !startTime) {
      p.fill("#444");
      p.text("Ready to start your session 🍹", 400, 600);
    } else if (running && !inBreak) {
      const secs = Math.floor(timeRemaining / 1000);
      const mins = Math.floor(secs / 60);
      const rem = secs % 60;
      p.fill("#1a3b5d");
      p.text(`Focus: ${mins}:${rem < 10 ? "0" + rem : rem}`, 400, 600);
    } else if (inBreak) {
      const secs = Math.floor(breakTimeRemaining / 1000);
      const mins = Math.floor(secs / 60);
      const rem = secs % 60;
      p.fill("#d35400");
      p.text(`Break: ${mins}:${rem < 10 ? "0" + rem : rem}`, 400, 600);
    }
  }

  // Functions for timer controls
  function toggleTimer() {
    if (!running) {
      running = true;
      if (!startTime) startTime = p.millis();
    }
  }

  function togglePause() {
    running = !running;
    if (running && !startTime) startTime = p.millis();
  }

  function resetAll() {
    running = false;
    inBreak = false;
    startTime = null;
    initIceCubes();
  }

  function skipCycle() {
    if (!running) return;
    if (!inBreak) {
      startBreak();
      iceCubes.forEach((c) => (c.meltProgress = 1));
    } else {
      inBreak = false;
      running = false;
      startTime = null;
      initIceCubes();
    }
  }



  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
