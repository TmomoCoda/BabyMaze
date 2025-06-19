// Times-Table Quest main script

// ----- DataStore -----
class DataStore {
  constructor() {
    this.stats = JSON.parse(localStorage.getItem('ttq-stats') || '{}');
  }
  save() {
    localStorage.setItem('ttq-stats', JSON.stringify(this.stats));
  }
  record(table, correct, time) {
    const rec = this.stats[table] || { tries: 0, correct: 0, bestTime: null };
    rec.tries++;
    if (correct) rec.correct++;
    if (!rec.bestTime || time < rec.bestTime) rec.bestTime = time;
    this.stats[table] = rec;
    this.save();
  }
}

// ----- QuizEngine -----
class QuizEngine {
  constructor() {
    this.history = [];
  }
  nextQuestion(table) {
    let factor;
    do {
      factor = Math.floor(Math.random()*12)+1;
    } while (this.history.slice(-5).includes(factor));
    this.history.push(factor);
    return { a: table, b: factor, answer: table*factor };
  }
}

// ----- UI Helpers -----
function toast(msg, type='success') {
  const el = document.getElementById('toast');
  el.className = `toast-${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(()=> el.style.display='none', 1500);
}

function confetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.classList.remove('hidden');
  const pieces = Array.from({length:100}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*6+4,
    c: `hsl(${Math.random()*360},70%,60%)`
  }));
  let ticks = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      p.y += 2;
    });
    if (ticks++ < 30) requestAnimationFrame(draw); else canvas.classList.add('hidden');
  }
  draw();
}

// ----- Gamification -----
class Game {
  constructor() {
    this.xp = 0;
    this.level = 1;
    this.streak = 0;
    this.engine = new QuizEngine();
    this.store = new DataStore();
    this.currentTable = 1;
    this.question = null;
    this.bindUI();
  }

  bindUI() {
    const select = document.getElementById('tableSelect');
    for(let i=1;i<=12;i++){
      const opt = document.createElement('option');
      opt.value = i; opt.textContent = `x${i}`;
      select.appendChild(opt);
    }
    document.getElementById('startBtn').addEventListener('click', ()=>this.start());
    document.getElementById('answerForm').addEventListener('submit', e=>{
      e.preventDefault();
      this.submitAnswer();
    });
    document.getElementById('closeModal').addEventListener('click', ()=>{
      document.getElementById('trophyModal').classList.add('hidden');
    });
    document.getElementById('contrastToggle').addEventListener('click',()=>{
      document.body.classList.toggle('high-contrast');
    });
    document.addEventListener('keydown', e=>{
      if(e.key==='Enter') this.submitAnswer();
    });
  }

  start() {
    this.currentTable = parseInt(document.getElementById('tableSelect').value,10);
    document.getElementById('trainer').classList.remove('hidden');
    this.next();
  }

  next() {
    this.question = this.engine.nextQuestion(this.currentTable);
    const card = document.getElementById('card');
    card.classList.remove('flip');
    card.querySelector('.front').textContent = `${this.question.a} x ?`;
    card.querySelector('.back').textContent = `${this.question.a} x ${this.question.b}`;
    document.getElementById('answerForm').classList.remove('hidden');
    document.getElementById('answerInput').value='';
    document.getElementById('answerInput').focus();
  }

  submitAnswer() {
    const val = parseInt(document.getElementById('answerInput').value,10);
    if(isNaN(val)) return;
    const correct = val === this.question.answer;
    if(correct){
      this.streak++;
      this.xp += 10 + (this.streak%5===0?5:0);
      toast('Great!', 'success');
      if(this.streak%5===0) confetti();
    } else {
      this.streak=0;
      toast('Try again', 'error');
    }
    if(this.xp>= this.level*120){
      this.level++;
      document.getElementById('level').textContent = `Lvl ${this.level}`;
    }
    document.getElementById('xpFill').style.width = `${(this.xp%120)/1.2}%`;
    document.getElementById('streak').textContent = `Streak: ${this.streak}`;
    this.next();
  }
}

// start the game when DOM ready
window.addEventListener('DOMContentLoaded',()=>{
  new Game();
});
