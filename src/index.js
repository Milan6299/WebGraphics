const BG = '#000000'
const FG = 'rgb(100,255,100)'
const ctx = game.getContext("2d")

game.width = 400;
game.height = 400;

function clear() {
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, game.width, game.height)
}

const FPS = 60
function translate({ x, y, z }, dz) {
  return { x, y, z: z + dz }
}

function screen(p) {
  return {
    x: (p.x + 1) / 2 * game.width,
    y: (1 - (p.y + 1) / 2) * game.height
  }
}
function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
  }
}
function line(p1, p2) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = FG
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}
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
const fs = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

function rotateXZ({ x, y, z }, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  };
}
// renderP(f2)
let running = true

clear()
let dz = 1
let angle = 0
function animate() {
  if (!running) return
  const dt = 1 / FPS
  angle += Math.PI * dt
  clear()
  for (const f of fs) {
    for (let i = 0; i < f.length; i++) {
      const a = vs[f[i]];
      const b = vs[f[(i + 1) % f.length]];
      line(screen(project(translate(rotateXZ(a, angle), dz))),
        screen(project(translate(rotateXZ(b, angle), dz))))
    }
  }

  requestAnimationFrame(animate)
}

animate()

pau.addEventListener('click', () => {
  running = false
})
res.addEventListener('click', () => {
  running = true
  animate()
})
