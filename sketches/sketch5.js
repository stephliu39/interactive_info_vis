// HW 5 Sketch
registerSketch('sk5', function (p) {
  let table;

  let genderSelect, occupationSelect;
  let ageSlider, activitySlider, stressSlider;
  let predictBtn;

  let predQuality = null;
  let predDuration = null;
  let animQuality = 0;
  let animDuration = 0;
  let resultVisible = false;

  const sliderGap = 70;
  const topTitleY = 50;
  const outputCardH = 300;

  const labelWidth = 180;
  const sliderWidth = 380;
  const valueWidth = 60;
  const labelGap = 10;
  const valueGap = 10;
  const INPUT_SECTION_WIDTH = labelWidth + labelGap + sliderWidth + valueGap + valueWidth;

  p.sliderX = 0;
  p.valueX = 0;
  p.sliderY = 0;
  p.lblX = 0;

  p.preload = () => {
    table = p.loadTable("Sleep_health_and_lifestyle_dataset.csv", "csv", "header");
  };

  // Function to set up positioning of UI elements
  function updatePositions() {
    const centerX = p.width / 2;

    const inputLeft = centerX - INPUT_SECTION_WIDTH / 2;
    p.lblX = inputLeft;
    p.sliderX = inputLeft + labelWidth + labelGap;
    p.valueX = inputLeft + INPUT_SECTION_WIDTH;;

    const genderW = genderSelect.width;
    const occupationW = occupationSelect.width;
    const dropdownGap = 20;
    const totalDropdownW = genderW + occupationW + dropdownGap;
    const dropdownStartX = centerX - totalDropdownW / 2;

    const outputCardTopY = p.height - outputCardH
    const availableHeight = outputCardTopY - topTitleY;

    const dropdownH = genderSelect.height;
    const sliderH = ageSlider.height;
    const btnH = predictBtn.height;
    const margin1 = 40;
    const margin2 = 40;
    const totalInputHeight = dropdownH + margin1 + (2 * sliderGap) + sliderH + margin2 + btnH;

    let dropdownY;
    if (totalInputHeight < availableHeight) {
      dropdownY = topTitleY + (availableHeight - totalInputHeight) / 2;
    } else {
      dropdownY = topTitleY + 40;
    }

    p.sliderY = dropdownY + dropdownH + margin1;
    const btnY = p.sliderY + (2 * sliderGap) + sliderH + margin2;
    
    genderSelect.position(dropdownStartX, dropdownY);
    occupationSelect.position(dropdownStartX + genderW + dropdownGap, dropdownY);
    ageSlider.position(p.sliderX, p.sliderY + 10);
    activitySlider.position(p.sliderX, p.sliderY + 10 + sliderGap);
    stressSlider.position(p.sliderX, p.sliderY + 10 + 2 * sliderGap);
    predictBtn.position(centerX - predictBtn.width / 2, btnY);
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont("Inter, sans-serif");

    const occCol = table.getColumn("Occupation") || [];
    const occSet = [...new Set(occCol.map((v) => v.trim()))]
    
    genderSelect = createDropdown(["Male", "Female"], 0, 0, 160);
    occupationSelect = createDropdown(occSet, 0, 0, 200);
    ageSlider = createSlider(0, 0, "Age", 18, 80, 30);
    activitySlider = createSlider(0, 0, "Physical Activity Level (mins/day)", 0, 180, 60);
    stressSlider = createSlider(0, 0, "Stress Level (1-10)", 1, 10, 5);

    predictBtn = p.createButton("Predict Sleep");
    predictBtn.position(0, 0);
    predictBtn.style("padding", "10px 26px");
    predictBtn.style("border-radius", "18px");
    predictBtn.style("border", "none");
    predictBtn.style("background", "linear-gradient(135deg,#9bbef9,#b59ef7)");
    predictBtn.style("color", "white");
    predictBtn.style("font-weight", "600");
    predictBtn.style("box-shadow", "0 4px 10px rgba(0,0,0,0.15)");
    predictBtn.mousePressed(() => {
      computePrediction();
      resultVisible = true;
    });

    updatePositions();
  };

  // Helper: dropdown
  function createDropdown(options, x, y, width = 200) {
    const sel = p.createSelect();
    sel.position(x, y);
    sel.style("padding", "8px 12px");
    sel.style("border-radius", "10px");
    sel.style("border", "none");
    sel.style("background", "white");
    sel.style("font-size", "14px");
    sel.style("box-shadow", "0 3px 12px rgba(40,60,120,0.1)");
    sel.style("width", width + "px");
    options.forEach((o) => sel.option(o));
    return sel;
  }

  // Helper: slider with label
  function createSlider(x, y, label, min, max, val) {
    const slider = p.createSlider(min, max, val, 1);
    slider.position(x, y + 10);
    slider.style("width", sliderWidth + "px");
    slider.attribute("label", label);
    return slider;
  }

  // Function to compute prediction based on user input
  function computePrediction() {
  if (!table) return;

  const gender = genderSelect.value().toLowerCase().trim();
  const occupation = occupationSelect.value().toLowerCase().trim();
  const age = ageSlider.value();
  const activity = activitySlider.value();
  const stress = stressSlider.value();

  const candidates = [];
  for (let r = 0; r < table.getRowCount(); r++) {
    const g = (table.getString(r, "Gender") || "").toLowerCase().trim();
    const o = (table.getString(r, "Occupation") || "").toLowerCase().trim();
    const a = parseFloat(table.getString(r, "Age"));
    const pa = parseFloat(table.getString(r, "Physical Activity Level"));
    const st = parseFloat(table.getString(r, "Stress Level"));
    const sd = parseFloat(table.getString(r, "Sleep Duration"));
    const sq = parseFloat(table.getString(r, "Quality of Sleep"));

    if (!Number.isFinite(a) || !Number.isFinite(pa) || !Number.isFinite(st) ||
        !Number.isFinite(sd) || !Number.isFinite(sq)) continue;
    
    let score = 0;
    if (g === gender) score += 2;
    if (o === occupation) score += 2;
    score += 1 - Math.min(Math.abs(a - age) / 60, 1);
    score += 1 - Math.min(Math.abs(pa - activity) / 200, 1);
    score += 1 - Math.min(Math.abs(st - stress) / 10, 1);
    candidates.push({ sd, sq, score });
  }

  // Sort by similarity and pick top 10%
  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, Math.max(5, Math.floor(candidates.length * 0.1)));

  if (top.length > 0) {
    predDuration = top.reduce((sum, v) => sum + v.sd, 0) / top.length;
    predQuality = top.reduce((sum, v) => sum + v.sq, 0) / top.length;
  } else {
    let totalD = 0, totalQ = 0;
    for (let r = 0; r < table.getRowCount(); r++) {
      totalD += parseFloat(table.getString(r, "Sleep Duration"));
      totalQ += parseFloat(table.getString(r, "Quality of Sleep"));
    }
    predDuration = totalD / table.getRowCount();
    predQuality = totalQ / table.getRowCount();
  }

  animQuality = p.lerp(animQuality, predQuality, 0.08);
  animDuration = p.lerp(animDuration, predDuration, 0.08);
}

  p.draw = () => {
    p.background(245);
    for (let y = 0; y < p.height; y++) {
      const c = p.lerpColor(p.color("#eaf3ff"), p.color("#f5eaff"), y / p.height);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }

    // Title
    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(26);
    p.text("Sleep Wellness Predictor", p.width / 2, topTitleY);

    // Labels for sliders
    p.fill(70);
    p.textSize(14);

    const TEXT_OFFSET = -5;

    p.textAlign(p.LEFT, p.CENTER);
    p.text("Age", p.lblX, p.sliderY + TEXT_OFFSET);
    p.text(activitySlider.attribute("label"), p.lblX, p.sliderY + TEXT_OFFSET + sliderGap);
    p.text(stressSlider.attribute("label"), p.lblX, p.sliderY + TEXT_OFFSET + 2 * sliderGap);

    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`${ageSlider.value()} yrs`, p.valueX, p.sliderY + TEXT_OFFSET);
    p.text(`${activitySlider.value()} mins`, p.valueX, p.sliderY + TEXT_OFFSET + sliderGap);
    p.text(`${stressSlider.value()} lvl`, p.valueX, p.sliderY + TEXT_OFFSET + 2 * sliderGap);

    // Prediction Card
    const cx = p.width / 2;
    const cardW2 = 720;
    const cy = 520;

    p.noStroke();
    p.fill(255, 255, 255, 200);
    p.rectMode(p.CENTER);
    p.rect(cx, cy, cardW2, outputCardH, 22);
    p.fill(255, 255, 255, 40);
    p.rect(cx, cy - 10, cardW2 * 0.95, outputCardH * 0.95, 18);

    p.fill(30);
    p.textAlign(p.CENTER);
    p.textSize(20);
    p.text("Predicted Sleep Profile", cx, cy - outputCardH / 2 + 35);

    if (!resultVisible || predQuality === null || predDuration === null) {
      p.fill(90);
      p.textSize(15);
      p.text(
        "Enter your details above and click 'Predict Sleep' to compute your predicted sleep duration and quality.",
        cx,
        cy
      );
      return;
    }

    animQuality = p.lerp(animQuality, predQuality, 0.08);
    animDuration = p.lerp(animDuration, predDuration, 0.08);

    // Sleep Quality gauge
    const qX = cx - 180;
    const qY = cy + 20;
    p.strokeWeight(18);
    p.noFill();
    p.stroke(230);
    p.arc(qX, qY, 180, 180, 0, p.TWO_PI);
    p.stroke("#82b5ff");
    p.arc(qX, qY, 180, 180, -p.HALF_PI, -p.HALF_PI + p.map(animQuality, 0, 10, 0, p.TWO_PI));
    p.noStroke();
    p.fill(40);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text(animQuality.toFixed(1) + "/10", qX, qY);
    p.textSize(14);
    p.fill(90);
    p.text("Sleep Quality", qX, qY + 60);

    // Sleep Duration bar
    const dX = cx + 160;
    const dY = cy + 20;
    p.fill(240);
    p.rectMode(p.CENTER);
    p.rect(dX, dY, 280, 24, 12);
    p.fill("#c1a4ff");
    p.rectMode(p.CORNER);
    p.rect(dX - 140, dY - 12, p.map(animDuration, 0, 12, 0, 280), 24, 12);
    p.textAlign(p.CENTER);
    p.fill(40);
    p.textSize(22);
    p.text(animDuration.toFixed(1) + " hrs", dX, dY - 30);
    p.textSize(14);
    p.fill(90);
    p.text("Sleep Duration", dX, dY + 40);
  };

p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    updatePositions();
  };
});