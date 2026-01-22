console.log(game);
const ctx = game.getContext("2d");

const BG = '#494949';
const EDGE = '#101010';
const FG = 'rgb(100,255,50)';
const NEAR = 0.01;

game.width = 300;
game.height = 300;
// game.width = 1000
// game.height = 500
const height = 300;
const width = 300;
const xoff = 0;
const yoff = 0;
// const xoff = 500
// const yoff = 250

function clr() {
  ctx.fillStyle = BG;
  ctx.fillRect(xoff, yoff, height, width);
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
    z
  };
}

function screen({ x, y, z }) {
  return {
    x: (x + 1) / 2 * width,
    y: (1 - (y + 1) / 2) * height,
    z
  };
}

function rotateXZ({ x, y, z }, angle) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}

function rotateYZ({ x, y, z }, angle) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x,
    y: y * c - z * s,
    z: y * s + z * c,
  };
}

function rotateXY({ x, y, z }, angle) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  return {
    x: x * c - y * s,
    y: x * s + y * c,
    z
  };
}

function translateZ({ x, y, z }, dz) {
  return {
    x, y, z: z + dz
  };
}

const FPS = 120;
const dt = 1 / FPS;
const playtime = 10000;

let dz = 1;
let angle = 0;
let running = true;

const vs = [
  { x: 0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: 0.25, z: 0.25 },
  { x: -0.25, y: -0.25, z: 0.25 },
  { x: 0.25, y: -0.25, z: 0.25 },

  { x: 0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: 0.25, z: -0.25 },
  { x: -0.25, y: -0.25, z: -0.25 },
  { x: 0.25, y: -0.25, z: -0.25 },
]
function line(p1, p2) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = EDGE;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}
function faceFill(x1, y1, x2, y2, color) {
  const w = x2 - x1;
  const h = y2 - y1;
  ctx.fillStyle = color;
  ctx.fillRect(x1, y1, w, h);
}
function renderEdge(length, f) {
  for (let i = 0; i < length; i++) {
    const p1 = vs[f[i]]
    const p2 = vs[f[(i + 1) % length]]

    const NEAR = 0.01;

    const v1 = translateZ(rotateXZ(p1, angle), dz);
    const v2 = translateZ(rotateXZ(p2, angle), dz);
    if (v1.z <= NEAR || v2.z <= NEAR) continue;

    line(
      screen(project(v1)),
      screen(project(v2))
    );
  }
}
const fs = [
  // front back
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  // left right
  [1, 2, 6, 5],
  [0, 3, 7, 4],
  // top bottom
  [0, 1, 5, 4],
  [2, 3, 7, 6],
];

function renderFace(f, color) {
  const path = new Path2D();

  let v0 = translateZ(rotateXZ(vs[f[0]], angle), dz);
  if (v0.z <= NEAR) return;

  let p0 = screen(project(v0));
  path.moveTo(p0.x, p0.y);

  for (let i = 1; i < f.length; i++) {
    let v = translateZ(rotateXZ(vs[f[i]], angle), dz);
    if (v.z <= NEAR) return;
    let p = screen(project(v));
    path.lineTo(p.x, p.y);
  }

  path.closePath();
  ctx.fillStyle = color;
  ctx.fill(path);
}
function faceDepth(fs, angle) {
  fs.forEach(f => {
    // console.log(f)
    for (let i = 0; i < f.length; i++) {
      const pt = translateZ(rotateXZ(vs[f[i]], angle), dz)
      console.log(pt.z)
    }

  });
}
function animate() {
  if (!running) return
  // dz += 0.3 * dt;
  dz = 1;
  angle += Math.PI * dt;
  const colors = ["red", "blue", "orange", "green", "cyan", "magenta"];

  clr();
  fs.forEach((f, i) => {
    renderFace(f, colors[i % colors.length]);
    // renderEdge(f.length, f)
  });
  faceDepth(fs, angle)

  // requestAnimationFrame(animate)
};
animate()

pau.addEventListener('click', () => {
  running = false;
})
// setTimeout(() => {
//   animate();
//   running = false;
//   ctx.fillStyle = "red";
//   ctx.font = "20px monospace";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillText("Show Over!", width / 2, height / 2);
// }, playtime);
res.addEventListener('click', () => {
  running = true;
  animate();
  setTimeout(() => {
    running = false;
    console.log('Over!');
  }, playtime);
})
reload.addEventListener('click', () => {
  location.reload();
})

