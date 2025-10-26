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
    p.background(240, 200, 200);
    p.fill(180, 60, 60);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('HWK #4. B', p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
