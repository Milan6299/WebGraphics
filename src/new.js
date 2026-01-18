console.log(game);
const BG = '#494949';
const FG = 'rgb(100,255,50)';
const ctx = game.getContext("2d");
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


const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

// const vs = [
//   { x: 0.5, y: 0.5, z: 1.5 },
//   { x: -0.5, y: 0.5, z: 1.5 },
//   { x: -0.5, y: -0.5, z: 1.5 },
//   { x: 0.5, y: -0.5, z: 1.5 },
//   { x: 1, y: 1, z: 1 },
//   { x: -1, y: 1, z: 1 },
//   { x: -1, y: -1, z: 1 },
//   { x: 1, y: -1, z: 1 },
// ];
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
// const vs = [
//   { x: 0.5, y: 0.5, z: 1 },
//   { x: -0.5, y: 0.5, z: 1 },
//   { x: -0.5, y: -0.5, z: 1 },
//   { x: 0.5, y: -0.5, z: 1 },
//   { x: 0, y: 1, z: 1 },
//   { x: -1, y: 0, z: 1 },
//   { x: -0, y: -1, z: 1 },
//   { x: 1, y: 0, z: 1 },
//   { x: 0, y: 0, z: 1 },
// ]
function line(p1, p2) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = FG;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}
function animate() {
  if (!running) return
  // dz += 0.3 * dt;
  dz = 1;
  angle += Math.PI * dt;
  clr();
  for (let f of fs) {
    // console.log(f)
    for (let i = 0; i < f.length; i++) {
      const p1 = vs[f[i]]
      const p2 = vs[f[(i + 1) % f.length]]
      // console.log(f, " values: ", p1, p2)
      // if (p1.z == 0 || p2.z == 0) continue
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
  requestAnimationFrame(animate)
};
animate()

pau.addEventListener('click', () => {
  running = false;
})
setTimeout(() => {
  animate();
  running = false;
  ctx.fillStyle = "red";
  ctx.font = "20px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Show Over!", width / 2, height / 2);
}, playtime);
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

