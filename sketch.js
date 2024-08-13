/*
yolk radius
yolk location
yolk is yellow
white radius
white is white
*/

let noiseScale;
let zoff = 0;
let crispiness = 0;
const crispyColor = [200, 120, 35];
let eggSound;
let soundVolBase = 0.2;
let soundVolCook = 0.8;

function drawPerlinEgg(x, y, zoff, rMin, noiseScale, crispy) {
  // egg white
  let r = map(crispiness, 0, 10, 250, 252);
  let g = map(crispiness, 0, 10, 250, 245);
  let b = map(crispiness, 0, 10, 240, 200);
  fill(r, g, b);
  stroke(crispyColor); // cripsy
  strokeWeight(crispy);
  beginShape();
  for (let a = 0; a < TWO_PI; a += radians(3)) {
    let xoff = map(cos(a), -1, 1, 0, 3) * noiseScale;
    let yoff = map(sin(a), -1, 1, 0, 3) * noiseScale;
    let r1 = map(noise(xoff, yoff, zoff), 0, 1, rMin, rMin * 1.5);
    let x1 = r1 * cos(a) + x;
    let y1 = r1 * sin(a) + y;
    vertex(x1, y1);
  }
  endShape(CLOSE);
  // egg yolk
  fill("orange");
  noStroke();
  beginShape();
  rMin /= 3;
  zoff += 0.5;
  for (let a = 0; a < TWO_PI; a += radians(2)) {
    let xoff = map(cos(a), -1, 1, 0, 3) * noiseScale;
    let yoff = map(sin(a), -1, 1, 0, 3) * noiseScale;
    let r1 = map(noise(xoff, yoff, zoff), 0, 1, rMin, rMin * 1.5);
    let x1 = r1 * cos(a) + x;
    let y1 = r1 * sin(a) + y;
    vertex(x1, y1);
  }
  endShape(CLOSE);
}

function setup() {
  createCanvas(400, 400);
  frameRate(60);
  eggSound = loadSound("/assets/sizzling.mp3", loaded);
  eggSound.setVolume(soundVolBase);
  zoffSlider = createSlider(0, 0.09, 0.04, 0.0025);
  noiseScaleSlider = createSlider(0, 0.9, 0.45, 0.05);
}

function loaded() {
  eggSound.loop();
}

function draw() {
  background(20);
  translate(width / 2, height / 2);
  noiseScale = noiseScaleSlider.value();
  drawPerlinEgg(0, 0, zoff, 90, noiseScale, crispiness);
  zoff += zoffSlider.value();
  // sound rate from frying speed
  eggSound.rate(map(zoffSlider.value(), 0, 0.1, 0, 2.5))
  // sound pan from noise level
  eggSound.pan(map(noiseScaleSlider.value(), 0, 0.9, -1, 1))
  let mouseOnCanvas = checkMouseCanvas();
  if (mouseOnCanvas && zoffSlider.value()) {
    zoff *= 1.0001  // make slightly more violent when pressing
  } 
  if (frameCount % 18 == 0 && mouseOnCanvas && crispiness < 6 && zoffSlider.value()) {
    crispiness += 0.5;
  } else if (frameCount % 18 == 0 && crispiness > 0) {
    crispiness -= 1;
  }
}

function checkMouseCanvas() {
  if (mouseIsPressed && mouseX < width && mouseY < height) {
    return true;
  } else {
    return false;
  }
}

function mousePressed() {  // for desktop
  if (checkMouseCanvas()) {
    eggSound.setVolume(soundVolCook, 1);
  }
}

function mouseReleased() {
  eggSound.setVolume(soundVolBase, 1);
}

function touchStarted() {  // for mobile
  if (checkMouseCanvas()) {
    eggSound.setVolume(soundVolCook, 1);
  }
}

function touchEnded() {
  eggSound.setVolume(soundVolBase, 1);
}
