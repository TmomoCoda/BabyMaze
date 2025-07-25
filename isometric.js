// Isometric Baby Maze Game
// Render the maze using DOM elements transformed into an isometric grid

const GRID = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,1,0,1,0,1],
  [1,1,1,1,0,1,0,1,0,1],
  [1,0,0,1,0,0,0,1,0,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

// Size of logic grid tiles in pixels (movement/collision)
const LOGIC_TILE = 60;
// Visual isometric tile size
const TILE_W = 64;
const TILE_H = 32;
const BOARD_OFFSET_X = (GRID.length - 1) * TILE_W / 2;
const BOARD_W = GRID.length * TILE_W;
const BOARD_H = GRID.length * TILE_H;

// Emoji sprites
const FOOD_EMOJIS = ['\uD83C\uDF4E','\uD83C\uDF4C','\uD83E\uDD55','\uD83C\uDF47','\uD83C\uDF49','\uD83C\uDF5A'];
const BABY_EMOJI = '\uD83D\uDC76';
const MOTHER_EMOJI = '\uD83E\uDD1D';

let tileSize = LOGIC_TILE; // convenience
let baby, food, mothers, timerId, gameOver;
let tiles = [];
let score = 0;
let ammo = 0;
let timeStart = 0;
let tick = 0;

// DOM elements
const board = document.getElementById('gameBoard');
const gameOverEl = document.getElementById('gameOver');
const restartBtn = document.getElementById('restart');
const successEl = document.getElementById('success');
const nextStageBtn = document.getElementById('nextStage');
const nextStage3Btn = document.getElementById('nextStage3');

board.style.width = BOARD_W + 'px';
board.style.height = BOARD_H + 'px';

const playerEl = document.createElement('div');
playerEl.className = 'entity player';
playerEl.textContent = BABY_EMOJI;
board.appendChild(playerEl);

const foodEl = document.createElement('div');
foodEl.className = 'entity food';
board.appendChild(foodEl);

const motherContainer = document.createElement('div');
motherContainer.id = 'mothers';
board.appendChild(motherContainer);

function gridToIso(col, row){
  const isoX = (col - row) * TILE_W/2;
  const isoY = (col + row) * TILE_H/4;
  return [isoX, isoY];
}

function centerIso(col, row){
  const [x, y] = gridToIso(col, row);
  return { x: x + BOARD_OFFSET_X + TILE_W / 2, y: y + TILE_H / 2 };
}

function createTiles(){
  board.innerHTML = '';
  tiles = [];
  for(let y=0; y<GRID.length; y++){
    for(let x=0; x<GRID[y].length; x++){
      const tile = document.createElement('div');
      tile.className = 'tile ' + (GRID[y][x] ? 'wall' : 'floor');
      const [isoX, isoY] = gridToIso(x, y);
      tile.style.transform = `translate3d(${isoX + BOARD_OFFSET_X}px, ${isoY}px, 0) rotateX(60deg) rotateZ(45deg)`;
      tile.dataset.row = y;
      tile.dataset.col = x;
      tiles.push(tile);
    }
  }
  board.appendChild(playerEl);
  board.appendChild(foodEl);
  board.appendChild(motherContainer);
}

function resizeBoard(){
  const scale = Math.min(window.innerWidth / BOARD_W, window.innerHeight / BOARD_H);
  board.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', resizeBoard);

function init(){
  createTiles();
  resizeBoard();
  baby = { x: tileSize + tileSize/2, y: tileSize + tileSize/2, vx:0, vy:0, speed:3 };
  spawnFood();
  mothers = [];
  timeStart = Date.now();
  score = 0;
  ammo = 0;
  gameOver = false;
  gameOverEl.classList.add('hidden');
  restartBtn.classList.add('hidden');
  successEl.classList.add('hidden');
  nextStageBtn.classList.add('hidden');
  nextStage3Btn.classList.add('hidden');
  clearTimeout(timerId);
  timerId = setTimeout(endGame, 13000);
  renderScene();
  requestAnimationFrame(loop);
}

function spawnFood(){
  let gx, gy;
  do {
    gx = Math.floor(Math.random() * GRID.length);
    gy = Math.floor(Math.random() * GRID.length);
  } while(GRID[gy][gx] !== 0);
  food = { x: gx * tileSize + tileSize/2, y: gy * tileSize + tileSize/2 };
  const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
  foodEl.textContent = emoji;
}

function isWall(px, py){
  const gx = Math.floor(px / tileSize);
  const gy = Math.floor(py / tileSize);
  return GRID[gy] && GRID[gy][gx] === 1;
}

function update(){
  if(gameOver) return;
  const nextX = baby.x + baby.vx;
  const nextY = baby.y + baby.vy;
  if(!isWall(nextX, baby.y)) baby.x = nextX; else baby.vx = 0;
  if(!isWall(baby.x, nextY)) baby.y = nextY; else baby.vy = 0;

  const d = Math.hypot(baby.x - food.x, baby.y - food.y);
  if(d < tileSize/2){
    score += 1;
    spawnFood();
    clearTimeout(timerId);
    timerId = setTimeout(endGame, 13000);
  }
}

function renderScene(){
  board.innerHTML = '';
  const items = tiles.map(t => ({
    row: parseInt(t.dataset.row,10),
    col: parseInt(t.dataset.col,10),
    el: t
  }));

  const babyRow = baby.y / tileSize;
  const babyCol = baby.x / tileSize;
  const [bIsoX, bIsoY] = gridToIso(babyCol, babyRow);
  const bounceBaby = Math.sin(tick/10)*4;
  playerEl.style.transform = `translate3d(${bIsoX + BOARD_OFFSET_X}px, ${bIsoY - TILE_H + bounceBaby}px, 5px) rotateX(60deg) rotateZ(45deg)`;
  items.push({row: babyRow, col: babyCol, el: playerEl});

  const foodRow = food.y / tileSize;
  const foodCol = food.x / tileSize;
  const [fIsoX, fIsoY] = gridToIso(foodCol, foodRow);
  const bounceFood = Math.sin(tick/10 + 1)*4;
  foodEl.style.transform = `translate3d(${fIsoX + BOARD_OFFSET_X}px, ${fIsoY - TILE_H/2 + bounceFood}px, 5px) rotateX(60deg) rotateZ(45deg)`;
  items.push({row: foodRow, col: foodCol, el: foodEl});

  items.sort((a,b)=> (a.row + a.col) - (b.row + b.col));
  items.forEach(i => board.appendChild(i.el));
}

function loop(){
  update();
  tick++;
  renderScene();
  if(!gameOver) requestAnimationFrame(loop);
}

function endGame(){
  gameOver = true;
  gameOverEl.classList.remove('hidden');
  restartBtn.classList.remove('hidden');
}

board.addEventListener('click', e => {
  if(gameOver) return;
  const rect = board.getBoundingClientRect();
  const sx = (e.clientX - rect.left) / (parseFloat(board.style.transform.replace(/scale\(([^)]+)\)/,'$1')) || 1);
  const sy = (e.clientY - rect.top) / (parseFloat(board.style.transform.replace(/scale\(([^)]+)\)/,'$1')) || 1);
  const ox = sx - BOARD_OFFSET_X;
  const gx = (sy / (TILE_H/4) + ox / (TILE_W/2)) / 2;
  const gy = (sy / (TILE_H/4) - ox / (TILE_W/2)) / 2;
  const px = gx * tileSize + tileSize/2;
  const py = gy * tileSize + tileSize/2;
  const dx = px - baby.x;
  const dy = py - baby.y;
  if(Math.abs(dx) > Math.abs(dy)){
    baby.vx = dx > 0 ? baby.speed : -baby.speed;
    baby.vy = 0;
  } else {
    baby.vx = 0;
    baby.vy = dy > 0 ? baby.speed : -baby.speed;
  }
});

document.addEventListener('keydown', e => {
  if(gameOver) return;
  switch(e.key){
    case 'ArrowUp': baby.vx = 0; baby.vy = -baby.speed; break;
    case 'ArrowDown': baby.vx = 0; baby.vy = baby.speed; break;
    case 'ArrowLeft': baby.vx = -baby.speed; baby.vy = 0; break;
    case 'ArrowRight': baby.vx = baby.speed; baby.vy = 0; break;
  }
});

restartBtn.addEventListener('click', init);

init();
