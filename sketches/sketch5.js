// HW5 Sketch
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

  p.preload = () => {
    table = p.loadTable("Sleep_health_and_lifestyle_dataset.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(800, 800);
    p.textFont("Inter, sans-serif");

    // Position base coordinates for top input card
    const baseX = 100;
    const baseY = 60;
    const inputWidth = 600;

    // Create dropdowns
    genderSelect = createDropdown(["Male", "Female"], baseX + 60, baseY, 150);
    const occCol = table.getColumn("Occupation") || [];
    const occSet = [...new Set(occCol.map((v) => v.trim()))];
    occupationSelect = createDropdown(occSet, baseX + 280, baseY, 250);

    // Sliders
    ageSlider = createSlider(baseX + 60, baseY + 60, "Age", 18, 80, 30);
    activitySlider = createSlider(baseX + 60, baseY + 110, "Physical Activity (mins/day)", 0, 180, 60);
    stressSlider = createSlider(baseX + 60, baseY + 160, "Stress Level (1-10)", 1, 10, 5);

    // Predict button
    predictBtn = p.createButton("Predict Sleep");
    predictBtn.position(baseX + 230, baseY + 210);
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
  };

  // helper: dropdown
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

  // helper: slider with label
  function createSlider(x, y, label, min, max, val) {
    const slider = p.createSlider(min, max, val, 1);
    slider.position(x, y + 10);
    slider.style("width", "400px");
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

  // Store all rows that are similar enough (not necessarily identical)
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

    // Similarity score
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
    // fallback: average everything
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
    // Gradient background
    for (let y = 0; y < p.height; y++) {
      const c = p.lerpColor(p.color("#eaf3ff"), p.color("#f5eaff"), y / p.height);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }

    // Input Card
    p.fill(255, 255, 255, 230);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, 160, 720, 180, 22);

    // Title
    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(26);
    p.text("Sleep Wellness Predictor", p.width / 2, 40);

    // Labels for sliders
    p.fill(70);
    p.textSize(14);
    p.textAlign(p.LEFT);
    p.text("Age", 160, 95);
    p.text("Physical Activity (mins/day)", 160, 145);
    p.text("Stress Level (1-10)", 160, 195);

    // Dynamic labels
    p.textAlign(p.RIGHT);
    p.text(`${ageSlider.value()} yrs`, 630, 95);
    p.text(`${activitySlider.value()} mins`, 630, 145);
    p.text(`${stressSlider.value()} lvl`, 630, 195);

    // Prediction Card
    const cx = p.width / 2;
    const cy = 520;
    const cardW = 720;
    const cardH = 300;

    p.fill(255, 255, 255, 245);
    p.rect(cx, cy, cardW, cardH, 22);

    p.fill(30);
    p.textAlign(p.CENTER);
    p.textSize(20);
    p.text("Predicted Sleep Profile", cx, cy - cardH / 2 + 35);

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
  
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
}});
