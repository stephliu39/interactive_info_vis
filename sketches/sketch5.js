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

    genderSel = p.createSelect();
    genderSel.position(200, 110);
    genderSel.option("Male");
    genderSel.option("Female");
    genderSel.option("Other");
    styleSelect(genderSel);

    occSel = p.createSelect();
    occSel.position(420, 110);
    const occupations = [...new Set(table.getColumn("Occupation"))];
    occupations.forEach((o) => occSel.option(o));
    styleSelect(occSel);

    ageSlider = createLabeledSlider("Age", 18, 80, 30, "yrs", 250, 180);
    actSlider = createLabeledSlider("Physical Activity", 0, 180, 60, "mins/day", 250, 240);
    stressSlider = createLabeledSlider("Stress Level", 1, 10, 5, "level", 250, 300);

    predictBtn = p.createButton("Predict My Sleep");
    predictBtn.position(330, 360);
    predictBtn.mousePressed(predictSleep);
    styleButton(predictBtn);
  };

  function styleSelect(sel) {
    sel.style("padding", "8px 12px");
    sel.style("border-radius", "10px");
    sel.style("border", "none");
    sel.style("background", "rgba(255,255,255,0.8)");
    sel.style("font-size", "14px");
  }

  function styleButton(btn) {
    btn.style("padding", "12px 25px");
    btn.style("border", "none");
    btn.style("border-radius", "20px");
    btn.style("background", "linear-gradient(135deg, #93c5fd, #c4b5fd)");
    btn.style("color", "white");
    btn.style("font-size", "16px");
    btn.style("font-weight", "500");
    btn.style("cursor", "pointer");
    btn.style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)");
  }

  p.draw = function () {
    

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
