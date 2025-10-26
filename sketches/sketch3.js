// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.noStroke();

    baseY = p.height / 2 + 100;

    input = p.createInput('60');
    input.position(20, p.height + 20);

    button = p.createButton('Start Timer');
    button.position(input.x + input.width + 10, p.height + 20);
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
      let elapsed = (p.millis() - startTime) / 1000;
      let progress = p.constrain(elapsed / totalTime, 0, 1);
      remainingLength = incenseLength * (1 - progress);

      if (p.frameCount % 5 === 0) {
        let burnY = baseY - remainingLength;
        smokeParticles.push(new Smoke(p.width / 2, burnY));
      }

      if (progress >= 1) running = false;
    } else {
      remainingLength = incenseLength;
    }

    // Draw incense stick
    let topY = baseY - remainingLength;
    p.push();
    p.fill(150, 70, 40);
    p.rectMode(p.CORNERS);
    p.rect(p.width / 2 - 4, topY, p.width / 2 + 4, baseY, 2);
    p.pop();

    // Burning tip
    if (running) {
      let tipY = topY;
      let fade = p.map(p.sin(p.frameCount * 0.1), -1, 1, 100, 180);
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
      let remaining = Math.max(0, totalTime - (p.millis() - startTime) / 1000);
      p.text(
        p.nf(Math.floor(remaining / 60), 2) + ":" + p.nf(Math.floor(remaining % 60), 2),
        p.width / 2,
        p.height - 40
      );
    } else {
      p.text("Enter duration (seconds) and press Start", p.width / 2, p.height - 40);
    }

  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
