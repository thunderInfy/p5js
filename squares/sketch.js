let warm, cool, accent;
let staticCanvas;
let redNodes = [];
let anchor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  warm = color(252, 248, 240);
  cool = color(20, 22, 35);
  accent = color(70, 90, 130);
  background(warm);

  let baseSize = 60;
  let cols = ceil(windowWidth / baseSize);
  let rows = ceil(windowHeight / baseSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      subdivide(c * baseSize, r * baseSize, baseSize, 0);
    }
  }

  // anchor: find an empty spot (where pick >= 0.5)
  let baseSize2 = 60;
  let placed = false;
  let attempts = 0;
  while (!placed && attempts < 500) {
    let ax = floor(random(2, ceil(windowWidth / baseSize2) - 2)) * baseSize2;
    let ay = floor(random(2, ceil(windowHeight / baseSize2) - 2)) * baseSize2;
    let anx = ax / windowWidth;
    let any = ay / windowHeight;
    let pick = noise(anx * 6 + 500, any * 6 + 500);
    if (pick >= 0.5) {
      let anchorSize = baseSize2 * 1.5;
      let cx = ax - (anchorSize - baseSize2) / 2;
      let cy = ay - (anchorSize - baseSize2) / 2;
      anchor = { x: cx, y: cy, size: anchorSize, sw: 10, light: warm, speed: 0.015, phase: 0 };
      redNodes.push(anchor);
      placed = true;
    }
    attempts++;
  }

  staticCanvas = get();
}

function draw() {
  image(staticCanvas, 0, 0);

  for (let node of redNodes) {
    let isAnchor = node === anchor;
    let pulse = map(sin(frameCount * node.speed + node.phase), -1, 1, 0, 1);
    let r = isAnchor
      ? lerpColor(color(80, 10, 10), color(180, 30, 25), pulse)
      : lerpColor(color(90, 15, 15), color(240, 90, 75), pulse);
    let glowStrength = isAnchor ? 20 : 12;
    drawingContext.shadowColor = 'rgba(180, 50, 50, ' + (0.5 * pulse) + ')';
    drawingContext.shadowBlur = glowStrength * pulse;
    drawingContext.shadowOffsetX = 3;
    drawingContext.shadowOffsetY = 3;
    designSquareInSquare(node.x, node.y, node.size, node.sw, r, node.light);
    drawingContext.shadowColor = 'transparent';
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
  }
}

function subdivide(x, y, size, depth) {
  let minSize = 20;
  let maxDepth = 3;
  let nx = x / windowWidth;
  let ny = y / windowHeight;

  let noise_scale = 10;
  let splitChance = noise(nx * noise_scale + 4000, ny * noise_scale + 4000);
  let shouldSplit = splitChance > 0.35 && size > minSize && depth < maxDepth;

  if (shouldSplit) {
    let half = size / 2;
    subdivide(x, y, half, depth + 1);
    subdivide(x + half, y, half, depth + 1);
    subdivide(x, y + half, half, depth + 1);
    subdivide(x + half, y + half, half, depth + 1);
  } else {
    drawCell(x, y, size);
  }
}

function drawCell(x, y, size) {
  let nx = x / windowWidth;
  let ny = y / windowHeight;

  let n = noise(nx * 8, ny * 4);
  let sw = map(n, 0, 1, 0.5, 4);
  strokeWeight(sw);

  let pick = noise(nx * 6 + 500, ny * 6 + 500);
  let accentNoise = noise(nx * 5 + 2000, ny * 5 + 2000);

  if (pick < 0.5) {
    let colorVar = noise(nx * 10 + 3000, ny * 10 + 3000);
    let dark = accentNoise > 0.85
      ? lerpColor(accent, color(90, 110, 150), colorVar)
      : lerpColor(cool, color(35, 38, 55), colorVar);
    let light = lerpColor(warm, color(245, 240, 230), colorVar);
    designSquareInSquare(x, y, size, sw, dark, light);
    if (size >= 60) {
      let red = random() < 0.5 ? color(140, 30, 30) : color(210, 70, 60);
      redNodes.push({ x, y, size, sw: random(8, 12), col: red, light, speed: random(0.02, 0.05), phase: random(TWO_PI) });
    }
  }
}
