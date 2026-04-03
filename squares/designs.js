function designSquare(x, y, size, dark) {
  noFill();
  stroke(dark);
  square(x, y, size);
}

function designSquareInSquare(x, y, size, sw, dark, light) {
  fill(dark);
  noStroke();
  square(x, y, size);

  fill(light);
  let gap = sw || 1;
  let inner = size - gap * 3;
  let offset = (size - inner) / 2;
  square(x + offset, y + offset, inner);
}