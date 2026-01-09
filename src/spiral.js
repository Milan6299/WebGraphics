console.log(game)
const BG = '#000000'
const FG = 'rgb(100,255,50)'

const ctx = game.getContext("2d")
game.width = 300
game.height = 300
// game.width = 1000
// game.height = 500
const height = 300
const width = 300
const xoff = 0
const yoff = 0
// const xoff = 500
// const yoff = 250

function clr() {
  ctx.fillStyle = BG
  ctx.fillRect(xoff, yoff, height, width)
}

function project({ x, y, z }) {
  return {
    x: x / z,
    y: y / z,
    z
  }
}

function screen({ x, y, z }) {
  return {
    x: (x + 1) / 2 * width,
    y: (1 - (y + 1) / 2) * height,
    z
  }
}

function rotateXZ({ x, y, z }, angle) {
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x: x * c - z * s,
    y,
    z: x * s + z * c,
  }
}
function rotateYZ({ x, y, z }, angle) {
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x,
    y: y * c - z * s,
    z: y * s + z * c,
  }
}
function rotateXY({ x, y, z }, angle) {
  const s = Math.sin(angle)
  const c = Math.cos(angle)
  return {
    x: x * c - y * s,
    y: x * s + y * c,
    z
  }
}
function translateZ({ x, y, z }, dz) {
  return {
    x, y, z: z + dz
  }
}

const FPS = 60
const dt = 1 / FPS
const playtime = 2000

let dz = 1
let angle = 0

let running = true

const vs = [
  { x: 0.5, y: 0.5, z: 1 },
  { x: -0.5, y: 0.5, z: 1 },
  { x: -0.5, y: -0.5, z: 1 },
  { x: 0.5, y: -0.5, z: 1 },
  { x: 0, y: 1, z: 1 },
  { x: -1, y: 0, z: 1 },
  { x: -0, y: -1, z: 1 },
  { x: 1, y: 0, z: 1 },
  { x: 0, y: 0, z: 1 },
]
function animate() {
  if (!running) return
  dz -= dt
  angle += Math.PI * dt
  clr()
  for (let i = 0; i < vs.length; ++i) {
    const pt = screen(project(translateZ(rotateXY(vs[i], angle), dz)))
    if (pt.z <= 0) continue
    const s = 10 / pt.z
    ctx.fillStyle = FG
    ctx.fillRect(
      xoff + pt.x - s / 2,
      yoff + pt.y - s / 2,
      s,
      s
    )
  }
  requestAnimationFrame(animate)
}
animate()

pau.addEventListener('click', () => {
  running = false
})
setTimeout(() => {
  animate()
  running = false
  ctx.fillStyle = "red"
  ctx.font = "20px monospace"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("Show Over!", width / 2, height / 2)
}, playtime)
res.addEventListener('click', () => {
  running = true
  animate()
  setTimeout(() => {
    running = false
    console.log('Over!')
  }, playtime)
})
reload.addEventListener('click', () => {
  location.reload()
})

