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
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
