// HW5 Sketch
registerSketch('sk5', function (p) {
  let table;
  let genderSel, occSel, ageSlider, actSlider, stressSlider;
  let predictBtn;
  let resultQuality = null;
  let resultDuration = null;
  let animQuality = 0;
  let animDuration = 0;
  let fade = 0;

  p.preload = () => {
    table = p.loadTable("Sleep_health_and_lifestyle_dataset.csv", "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
  };

  p.draw = function () {
    p.background(250);

    // Corner time display
    const h = p.hour();
    const m = p.minute();
    const s = p.second();
    const label = p.nf(h, 2) + ':' + p.nf(m, 2) + ':' + p.nf(s, 2);

    p.noStroke();
    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);  // change to RIGHT/BOTTOM for other corners
    p.textSize(50);
    p.text(label, 12, 10);   // top-left corner

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
