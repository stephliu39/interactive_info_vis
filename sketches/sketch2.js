// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.noCursor();
  };

 p.draw = () => {
  p.background(230, 245, 255);
  p.translate(p.width / 2, p.height / 2);

  let h = p.hour();
  let m = p.minute();
  let s = p.second();

  // Convert current time to 24-hour float
  let time24 = h + m / 60 + s / 3600;

  // Determine bloom progress (0–1 for 12am→12pm, 1–0 for 12pm→12am)
  let bloomProgress = time24 < 12
    ? p.map(time24, 0, 12, 0, 1)
    : p.map(time24, 12, 24, 1, 0);

  // Draw petals and check if any are hovered
  let hoveredPetal = drawFlower(bloomProgress);

  // Draw center of flower
  drawCenter();

  // If hovering over a petal, show the time
  if (hoveredPetal !== -1) {
    let timeStr = p.nf(h, 2) + ":" + p.nf(m, 2) + ":" + p.nf(s, 2);
    p.fill(50, 180);
    p.rect(p.mouseX - p.width / 2 - 50, p.mouseY - p.height / 2 - 35, 100, 40, 10);
    p.fill(255);
    p.text(timeStr, p.mouseX - p.width / 2, p.mouseY - p.height / 2 - 15);
  }

  // Custom cursor
  p.noFill();
  p.stroke(100, 100);
  p.ellipse(p.mouseX - p.width / 2, p.mouseY - p.height / 2, 12);
}


  // Function to draw petals based on bloom progress and mouse position
function drawFlower(progress) {
  let petals = 12;
  let maxPetalLength = 300;
  let maxPetalWidth = 110;
  let hoveredPetal = -1;

  // Calculate mouse position relative to center
  let mx = p.mouseX - p.width / 2;
  let my = p.mouseY - p.height / 2;

  for (let i = 0; i < petals; i++) {
    let angle = (360 / petals) * i;
    p.push();
    p.rotate(angle);
  
    // Petal growth based on bloom cycle
    let petalStart = i / petals;
    let petalEnd = (i + 1) / petals;
    let petalProgress = p.constrain(p.map(progress, petalStart, petalEnd, 0, 1), 0, 1);

    let length = maxPetalLength * petalProgress;
    let width = maxPetalWidth * petalProgress;

    // Rotate mouse coordinates to petal space
    let localX = mx * p.cos(-angle) - my * p.sin(-angle);
    let localY = mx * p.sin(-angle) + my * p.cos(-angle);

    // Hover detection
    if (p.abs(localX) < width * 0.4 && localY < 0 && localY > -length) {
      hoveredPetal = i;
    }

    // Highlight if hovered
    let baseColor = p.color(255, 255, 255, 230);
    let highlightColor = p.color(255, 255, 200, 255);
    let c = (i === hoveredPetal) ? highlightColor : baseColor;
    p.fill(c);
    p.noStroke();
}

  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
