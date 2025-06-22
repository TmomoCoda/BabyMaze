// 3D Isometric Baby Maze Hunt

// Game config and state
const config = {
  tileSize: 64,
  gridSize: 9,
  babyPatience: 100,
  babyPatienceDecrement: 0.5,
  playerSpeed: 300,
  babySpeed: 500
};

const state = {
  currentStage: 1,
  gameStarted: false,
  player: { x: 1, y: 1 },
  baby: { x: 7, y: 7 },
  goal: { x: 4, y: 4 },
  babyPatience: config.babyPatience,
  lastUpdate: 0,
  moving: false,
  moveDirection: null
};

const elements = {
  board: document.getElementById('game-board'),
  welcome: document.getElementById('welcome'),
  gameOver: document.getElementById('game-over'),
  success: document.getElementById('success'),
  startBtn: document.getElementById('start-game'),
  restartBtn: document.getElementById('restart'),
  nextStageBtn: document.getElementById('next-stage'),
  nextStage3Btn: document.getElementById('next-stage3'),
  stageDisplay: document.getElementById('stage-display'),
  patienceDisplay: document.getElementById('patience-display'),
  patienceBar: document.getElementById('patience-bar'),
  upBtn: document.getElementById('up'),
  downBtn: document.getElementById('down'),
  leftBtn: document.getElementById('left'),
  rightBtn: document.getElementById('right')
};

// Simple stage layout data
const stages = {
  1: {
    walls: [
      [2,2],[2,3],[2,4],[2,5],[2,6],
      [6,2],[6,3],[6,4],[6,5],[6,6],
      [3,2],[4,2],[5,2],
      [3,6],[4,6],[5,6]
    ],
    water: []
  },
  2: {
    walls: [
      [1,1],[1,2],[1,3],[1,4],[7,5],[7,6],[7,7],
      [2,7],[3,7],[4,7],[5,7],[6,7]
    ],
    water: [
      [4,4],[4,5],[5,4],[5,5]
    ]
  },
  3: {
    walls: [
      [0,3],[1,3],[2,3],[3,3],[4,3],
      [5,5],[6,5],[7,5],[8,5]
    ],
    water: [
      [2,6],[3,6],[4,6],
      [5,1],[6,1],[7,1]
    ]
  }
};

let playerEl, babyEl, goalEl;

function tileId(x, y){
  return `tile-${x}-${y}`;
}

function createBoard(){
  elements.board.innerHTML = '';
  const size = config.tileSize;
  const g = config.gridSize;

  for(let y=0; y<g; y++){
    for(let x=0; x<g; x++){
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = tileId(x,y);
      tile.style.width = `${size}px`;
      tile.style.height = `${size}px`;
      tile.style.transform = `translate3d(${x*size}px, ${y*size}px, 0)`;
      elements.board.appendChild(tile);
    }
  }

  playerEl = document.createElement('div');
  playerEl.className = 'entity player';
  playerEl.textContent = '😃';
  elements.board.appendChild(playerEl);

  babyEl = document.createElement('div');
  babyEl.className = 'entity baby';
  babyEl.textContent = '👶';
  elements.board.appendChild(babyEl);

  goalEl = document.createElement('div');
  goalEl.className = 'entity goal';
  goalEl.textContent = '🎁';
  elements.board.appendChild(goalEl);
}

function applyStage(stage){
  const g = config.gridSize;
  for(let y=0; y<g; y++){
    for(let x=0; x<g; x++){
      const id = tileId(x,y);
      const tile = document.getElementById(id);
      tile.className = 'tile';
    }
  }
  stage.walls.forEach(([x,y])=>{
    const tile = document.getElementById(tileId(x,y));
    if(tile) tile.classList.add('wall');
  });
  stage.water.forEach(([x,y])=>{
    const tile = document.getElementById(tileId(x,y));
    if(tile) tile.classList.add('water');
  });
}

function posToPixels(pos){
  return pos*config.tileSize;
}

function updateEntities(){
  const size = config.tileSize;
  playerEl.style.transform = `translate3d(${posToPixels(state.player.x)}px, ${posToPixels(state.player.y)}px, 20px)`;
  babyEl.style.transform = `translate3d(${posToPixels(state.baby.x)}px, ${posToPixels(state.baby.y)}px, 20px)`;
  goalEl.style.transform = `translate3d(${posToPixels(state.goal.x)}px, ${posToPixels(state.goal.y)}px, 20px)`;
}

function inBounds(x,y){
  return x>=0 && y>=0 && x<config.gridSize && y<config.gridSize;
}

function isWall(x,y){
  const stage = stages[state.currentStage];
  return stage.walls.some(w=>w[0]===x && w[1]===y);
}

function movePlayer(dx,dy){
  const nx = state.player.x + dx;
  const ny = state.player.y + dy;
  if(!inBounds(nx,ny) || isWall(nx,ny)) return;
  state.player.x = nx;
  state.player.y = ny;
  state.moving = true;
}

function stepBaby(dt){
  // simple follow behaviour towards player
  const dx = state.player.x - state.baby.x;
  const dy = state.player.y - state.baby.y;
  if(Math.abs(dx)+Math.abs(dy) === 0) return;
  const step = dt > config.babySpeed ? 1 : 0;
  if(step){
    if(Math.abs(dx) > Math.abs(dy)){
      const mx = dx>0?1:-1;
      if(!isWall(state.baby.x+mx, state.baby.y)) state.baby.x += mx;
    }else{
      const my = dy>0?1:-1;
      if(!isWall(state.baby.x, state.baby.y+my)) state.baby.y += my;
    }
  }
}

function checkWin(){
  if(state.player.x === state.baby.x && state.player.y === state.baby.y){
    state.gameStarted = false;
    elements.success.style.display = 'block';
    if(state.currentStage === 1){
      elements.nextStageBtn.style.display = 'inline-block';
    } else if(state.currentStage === 2){
      elements.nextStage3Btn.style.display = 'inline-block';
    }
  }
}

function updateHUD(){
  elements.stageDisplay.textContent = state.currentStage;
  elements.patienceDisplay.textContent = `${Math.round(state.babyPatience)}%`;
  elements.patienceBar.style.width = `${state.babyPatience}%`;
}

function gameLoop(timestamp){
  if(!state.gameStarted) return;
  const dt = timestamp - state.lastUpdate;
  state.lastUpdate = timestamp;
  state.babyPatience -= config.babyPatienceDecrement * dt / 1000;
  if(state.babyPatience <= 0){
    state.gameStarted = false;
    elements.gameOver.style.display = 'block';
    elements.restartBtn.style.display = 'inline-block';
    return;
  }
  stepBaby(dt);
  updateEntities();
  updateHUD();
  checkWin();
  requestAnimationFrame(gameLoop);
}

function startStage(num){
  state.currentStage = num;
  state.player = { x:1, y:1 };
  state.baby = { x:7, y:7 };
  state.goal = { x:4, y:4 };
  state.babyPatience = config.babyPatience;
  state.gameStarted = true;
  state.lastUpdate = performance.now();
  elements.welcome.style.display = 'none';
  elements.gameOver.style.display = 'none';
  elements.success.style.display = 'none';
  elements.restartBtn.style.display = 'none';
  elements.nextStageBtn.style.display = 'none';
  elements.nextStage3Btn.style.display = 'none';
  createBoard();
  applyStage(stages[num]);
  updateEntities();
  updateHUD();
  requestAnimationFrame(gameLoop);
}

function bindControls(){
  elements.startBtn.addEventListener('click', ()=> startStage(1));
  elements.restartBtn.addEventListener('click', ()=> startStage(state.currentStage));
  elements.nextStageBtn.addEventListener('click', ()=> startStage(2));
  elements.nextStage3Btn.addEventListener('click', ()=> startStage(3));

  elements.upBtn.addEventListener('click', ()=> movePlayer(0,-1));
  elements.downBtn.addEventListener('click', ()=> movePlayer(0,1));
  elements.leftBtn.addEventListener('click', ()=> movePlayer(-1,0));
  elements.rightBtn.addEventListener('click', ()=> movePlayer(1,0));

  document.addEventListener('keydown', e=>{
    switch(e.key){
      case 'ArrowUp': movePlayer(0,-1); break;
      case 'ArrowDown': movePlayer(0,1); break;
      case 'ArrowLeft': movePlayer(-1,0); break;
      case 'ArrowRight': movePlayer(1,0); break;
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  bindControls();
  createBoard();
  updateEntities();
});

