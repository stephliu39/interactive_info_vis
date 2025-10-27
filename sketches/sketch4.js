// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  let iceCubes = [];
  let running = false;
  let inBreak = false;
  let startTime = null;
  let timeRemaining = 0;
  let totalDuration = 0;
  let breakTimeRemaining = 0;
  let breakTotalDuration = 5 * 60 * 1000;
  let startButton, pauseButton, resetButton, skipButton;
  let focusInput, breakInput;


  p.setup = function () {
     p.createCanvas(p.windowWidth, p.windowHeight);
     p.textFont("Inter, Helvetica, Arial, sans-serif");
  };

   p.draw = function () {

   }

   // Functions for timer UI
  function createUI() {
    p.createP("Focus (min):").position(230, 660).style(uiLabelStyle());
    focusInput = p.createInput("25").position(340, 657).size(60).style(uiInputStyle());
    p.createP("Break (min):").position(440, 660).style(uiLabelStyle());
    breakInput = p.createInput("5").position(540, 657).size(60).style(uiInputStyle());

    const btnY = 710;
    startButton = makeButton("Start", 190, btnY, toggleTimer);
    pauseButton = makeButton("Pause", 320, btnY, togglePause);
    resetButton = makeButton("Reset", 450, btnY, resetAll);
    skipButton = makeButton("Skip", 580, btnY, skipCycle);
  }

  function uiLabelStyle() {
    return `
      font-family: Inter, sans-serif;
      font-size: 16px;
      color: #333;
    `;
  }

  function makeButton(label, x, y, callback) {
    let btn = p.createButton(label);
    btn.position(x, y);
    btn.mousePressed(callback);
    btn.style(uiButtonStyle());
    btn.mouseOver(() => btn.style(uiButtonHoverStyle()));
    btn.mouseOut(() => btn.style(uiButtonStyle()));
    return btn;
  }

  function uiButtonStyle() {
    return `
      background: linear-gradient(135deg, #007aff, #009eff);
      color: white;
      border: none;
      border-radius: 12px;
      width: 110px;
      padding: 10px 0;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    `;
  }

  function uiButtonHoverStyle() {
    return `
      background: linear-gradient(135deg, #0066d1, #00a4ff);
      color: #fff;
      border: none;
      border-radius: 12px;
      width: 110px;
      padding: 10px 0;
      font-size: 15px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transform: translateY(-1px);
    `;
  }

  function uiInputStyle() {
    return `
      border: 2px solid #c7d3e0;
      border-radius: 6px;
      padding: 6px;
      text-align: center;
      font-size: 14px;
      width: 50px;
      color: #333;
      outline: none;
    `;
  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
