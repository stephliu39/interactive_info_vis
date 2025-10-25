// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
     background(230, 245, 255);
    translate(width / 2, height / 2);

    let h = hour();
    let m = minute();
    let s = second();

    // Convert current time to 24-hour float
    let time24 = h + m / 60 + s / 3600;

    // Blooming/wilting cycle (0–1 for 12am→12pm, 1–0 for 12pm→12am)
    let bloomProgress = time24 < 12
      ? map(time24, 0, 12, 0, 1)
      : map(time24, 12, 24, 1, 0);

    // Function to draw center of the flower
    function drawCenter() {
    noStroke();
    for (let r = 80; r > 0; r -= 1) {
      fill(lerpColor(color(255, 200, 0), color(255, 140, 0), r / 80));
      ellipse(0, 0, r * 2);
    }
  }

  // Function to draw petals based on bloom progress and mouse position
  function drawFlower(progress) {
  let petals = 12;
  let maxPetalLength = 300;
  let maxPetalWidth = 110;

  // Calculate mouse position relative to center
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  
}

  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
