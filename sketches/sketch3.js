// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let totalTime = 60;
  let startTime;
  let running = false;
  let input, button;
  let incenseLength = 200;
  let baseY;
  let smokeParticles = [];

  p.setup = function () {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.noStroke();

    baseY = p.height / 2 + 100;

    input = p.createInput('60');
    input.position(canvas.position().x + 20, canvas.position().y + p.height + 15);
    input.style('padding', '4px');
    input.style('font-size', '14px');
    input.style('border-radius', '4px');
    input.style('border', '1px solid #aaa');

    button = p.createButton('Start Timer');
    button.style('margin', '10px');
    button.style('padding', '4px 10px');
    button.style('font-size', '14px');
    button.style('border-radius', '4px');
    button.style('background-color', '#d2a679');
    button.style('border', 'none');
    button.style('color', 'white');
    button.mousePressed(startTimer);
  };

  // Function to start the timer
  function startTimer() {
    totalTime = parseFloat(input.value());
    if (isNaN(totalTime) || totalTime <= 0) return;
    startTime = p.millis();
    running = true;
    smokeParticles = [];
  }

  p.draw = function () {
    p.background(240, 230, 220);

    // Base of incense stick
    p.fill(90, 60, 30);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, baseY, 120, 10, 5);

    // Incense burning animation
    let remainingLength;
    if (running) {
      const elapsed = (p.millis() - startTime) / 1000;
      const progress = p.constrain(elapsed / totalTime, 0, 1);
      remainingLength = incenseLength * (1 - progress);

      if (p.frameCount % 5 === 0) {
        const burnY = baseY - remainingLength;
        smokeParticles.push(new Smoke(p.width / 2, burnY));
      }

      if (progress >= 1) running = false;
    } else {
      remainingLength = incenseLength;
    }

    // Draw incense stick
    const topY = baseY - remainingLength;
    p.push();
    p.fill(150, 70, 40);
    p.rectMode(p.CORNERS);
    p.rect(p.width / 2 - 4, topY, p.width / 2 + 4, baseY, 2);
    p.pop();

    // Burning tip
    if (running) {
      const tipY = topY;
      const fade = p.map(p.sin(p.frameCount * 0.1), -1, 1, 100, 180);
      p.fill(255, 120, 50, fade);
      p.ellipse(p.width / 2, tipY, 12, 12);
      p.fill(255, 200, 80, fade / 2);
      p.ellipse(p.width / 2, tipY, 25, 25);
    }

    // Draw smoke
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      smokeParticles[i].update();
      smokeParticles[i].display();
      if (smokeParticles[i].finished()) smokeParticles.splice(i, 1);
    }

    // Display timer text
    p.fill(50);
    if (running) {
      const remaining = Math.max(0, totalTime - (p.millis() - startTime) / 1000);
      p.text(
        p.nf(Math.floor(remaining / 60), 2) + ":" + p.nf(Math.floor(remaining % 60), 2),
        p.width / 2,
        p.height - 40
      );
    } else {
      p.text("Enter duration (seconds) and press Start", p.width / 2, p.height - 40);
    }
  };

  // Smoke particle class
   class Smoke {
    constructor(x, y) {
      this.startX = x;
      this.x = x;
      this.y = y;
      this.alpha = 200;
      this.size = p.random(10, 20);
      this.ySpeed = p.random(-1.0, -2.2);
      this.life = 0;
      this.wobbleOffset = p.random(1000);
      this.gray = p.random(150, 200);
    }

    update() {
      this.life += 0.02;
      this.y += this.ySpeed;
      // horizontal drift using sine wave
      this.x = this.startX + p.sin(this.life * 2 + this.wobbleOffset) * 15 * this.life;
      this.alpha -= 2;
    }

    display() {
      p.fill(this.gray, this.gray, this.gray, this.alpha);
      p.ellipse(this.x, this.y, this.size);
    }

    finished() {
      return this.alpha <= 0;
    }
  }

  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});
