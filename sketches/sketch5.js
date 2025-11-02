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

  // Function to create labeled slider
  function createLabeledSlider(label, min, max, val, unit, x, y) {
    const lbl = p.createP(label);
    lbl.position(x, y - 20);
    lbl.style("font-size", "14px");
    lbl.style("color", "#444");
    lbl.style("margin", "0");
    lbl.style("font-family", "sans-serif");

    const slider = p.createSlider(min, max, val);
    slider.position(x + 220, y);
    slider.style("width", "180px");
    slider.style("accent-color", "#93c5fd");

    const valLbl = p.createP(val + " " + unit);
    valLbl.position(x + 420, y - 20);
    valLbl.style("font-size", "14px");
    valLbl.style("color", "#555");
    valLbl.style("margin", "0");
    valLbl.style("font-family", "sans-serif");

    slider.input(() => {
      valLbl.html(slider.value() + " " + unit);
    });

    return slider;
  }

  // Function to predict sleep quality and duration
  function predictSleep() {
    const gender = genderSel.value();
    const occupation = occSel.value();
    const age = ageSlider.value();
    const activity = actSlider.value();
    const stress = stressSlider.value();

    let matches = [];
    for (let r = 0; r < table.getRowCount(); r++) {
      const g = table.getString(r, "Gender");
      const o = table.getString(r, "Occupation");
      const a = parseFloat(table.getString(r, "Age"));
      const pa = parseFloat(table.getString(r, "Physical Activity Level"));
      const st = parseFloat(table.getString(r, "Stress Level"));
      const sq = parseFloat(table.getString(r, "Quality of Sleep"));
      const sd = parseFloat(table.getString(r, "Sleep Duration"));

      if (
        g === gender &&
        o === occupation &&
        Math.abs(a - age) < 10 &&
        Math.abs(pa - activity) < 40 &&
        Math.abs(st - stress) < 3
      ) {
        matches.push({ sq, sd });
      }
    }

    if (matches.length > 0) {
      resultQuality = matches.reduce((sum, d) => sum + d.sq, 0) / matches.length;
      resultDuration = matches.reduce((sum, d) => sum + d.sd, 0) / matches.length;
    } else {
      resultQuality = p.random(3, 7);
      resultDuration = p.random(5, 9);
    }

    fade = 0;
    animQuality = 0;
    animDuration = 0;
  }

  p.draw = function () {
    for (let y = 0; y < p.height; y++) {
      let inter = p.map(y, 0, p.height, 0, 1);
      let c = p.lerpColor(p.color("#e0f2fe"), p.color("#ede9fe"), inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }

    p.noStroke();
    p.fill(50);
    p.textFont("sans-serif");
    p.textSize(28);
    p.text("Sleep Wellness Predictor", p.width / 2, 50);

    p.noStroke();
    p.fill(255, 255, 255, 230);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, 580, 600, 350, 30);
    p.fill(40);
    p.textSize(20);
    p.text("Predicted Sleep Profile", p.width / 2, 430);

    if (resultQuality && resultDuration) {
      fade = p.min(fade + 4, 255);
      animQuality = p.lerp(animQuality, resultQuality, 0.08);
      animDuration = p.lerp(animDuration, resultDuration, 0.08);
  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
}});
