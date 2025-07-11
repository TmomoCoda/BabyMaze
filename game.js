    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gameOverEl = document.getElementById('gameOver');
    const restartBtn = document.getElementById('restart');
    const successEl = document.getElementById('success');
    const nextStageBtn = document.getElementById('nextStage');
    const nextStage3Btn = document.getElementById('nextStage3');

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
    let TILE;
    const INITIAL_SPEED = 3;
    const FOOD_EMOJIS = ['🍎','🍌','🥕','🍇','🍉','🍞','🍪','🍔','🍕','🍗','🍚','🍩','🍿','🍼','🥛','🥤'];
    let baby, food, mothers, timerId, timeStart, score, ammo, gameOver;
    let currentFoodEmoji = '🍎';
    let babyEmoji = '👶';
    const MOTHER_EMOJI = '🤱';
    let currentStage = 1;

    function resizeCanvas() {
      const size = Math.min(window.innerWidth, window.innerHeight);
      canvas.width = size;
      canvas.height = size;
      TILE = canvas.width / GRID.length;
    }

    window.addEventListener('resize', resizeCanvas);

    function init() {
      resizeCanvas();
      baby = { x: TILE + TILE/2, y: TILE + TILE/2, r: 15, vx:0, vy:0, speed: INITIAL_SPEED };
      spawnFood();
      mothers = [];
      let count = 0;
      if (currentStage === 1) count = 1;
      else if (currentStage === 2) count = 2;
      else if (currentStage === 3) count = 1;
      if (count > 0) spawnMothers(count);
      timeStart = Date.now();
      score = 0;
      ammo = 0;
      gameOver = false;
      gameOverEl.style.display = 'none';
      restartBtn.style.display = 'none';
      successEl.style.display = 'none';
      nextStageBtn.style.display = 'none';
      nextStage3Btn.style.display = 'none';
      clearTimeout(timerId);
      timerId = setTimeout(endGame, 13000);
      requestAnimationFrame(loop);
    }

    function spawnFood() {
      let gx, gy;
      do {
        gx = Math.floor(Math.random() * GRID.length);
        gy = Math.floor(Math.random() * GRID.length);
      } while (GRID[gy][gx] !== 0);
      const size = Math.max(12, Math.round(baby.r * 0.8));
      food = { x: gx * TILE + TILE/2, y: gy * TILE + TILE/2, r: size };
      currentFoodEmoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
      timeStart = Date.now();
    }

    function spawnMothers(count = 1) {
      mothers = [];
      for (let i = 0; i < count; i++) {
        let gx, gy;
        do {
          gx = Math.floor(Math.random() * GRID.length);
          gy = Math.floor(Math.random() * GRID.length);
        } while (GRID[gy][gx] !== 0 || (gx === 1 && gy === 1));
        const mother = { x: gx * TILE + TILE / 2, y: gy * TILE + TILE / 2, r: TILE * 0.4, vx: 0, vy: 0, speed: currentStage === 3 ? 0.5 : 0 };
        mothers.push(mother);
      }
    }

    function screenToBoard(sx, sy) {
      return { x: sx, y: sy };
    }

      canvas.addEventListener('click', e => {
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        const tx = e.clientX - rect.left;
        const ty = e.clientY - rect.top;
      const boardPos = screenToBoard(tx, ty);
      const dx = boardPos.x - baby.x;
      const dy = boardPos.y - baby.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        baby.vx = dx > 0 ? baby.speed : -baby.speed;
        baby.vy = 0;
      } else {
        baby.vx = 0;
        baby.vy = dy > 0 ? baby.speed : -baby.speed;
        }
      });

      // allow arrow keys to control the baby
      document.addEventListener('keydown', e => {
        if (gameOver) return;
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
        switch (e.key) {
          case 'ArrowUp':
            baby.vx = 0;
            baby.vy = -baby.speed;
            baby.x = Math.floor(baby.x / TILE) * TILE + TILE/2;
            break;
          case 'ArrowDown':
            baby.vx = 0;
            baby.vy = baby.speed;
            baby.x = Math.floor(baby.x / TILE) * TILE + TILE/2;
            break;
          case 'ArrowLeft':
            baby.vx = -baby.speed;
            baby.vy = 0;
            baby.y = Math.floor(baby.y / TILE) * TILE + TILE/2;
            break;
          case 'ArrowRight':
            baby.vx = baby.speed;
            baby.vy = 0;
            baby.y = Math.floor(baby.y / TILE) * TILE + TILE/2;
            break;
          case 'a':
          case 'A':
            throwFood();
            break;
        }
      });

    function startGame() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      currentStage = 1;
      successEl.style.display = 'none';
      nextStageBtn.style.display = 'none';
      init();
    }

    restartBtn.addEventListener('click', startGame);
    nextStageBtn.addEventListener('click', startStage2);
    nextStage3Btn.addEventListener('click', startStage3);

    function startStage2() {
      currentStage = 2;
      successEl.style.display = 'none';
      nextStageBtn.style.display = 'none';
      init();
    }

    function startStage3() {
      currentStage = 3;
      successEl.style.display = 'none';
      nextStageBtn.style.display = 'none';
      nextStage3Btn.style.display = 'none';
      init();
    }

    function throwFood() {
      if (ammo <= 0 || mothers.length === 0) return;
      let closest = -1;
      let dist = Infinity;
      for (let i = 0; i < mothers.length; i++) {
        const md = Math.hypot(baby.x - mothers[i].x, baby.y - mothers[i].y);
        if (md < dist) {
          dist = md;
          closest = i;
        }
      }
      if (dist <= TILE * 2 && closest >= 0) {
        mothers.splice(closest, 1);
        ammo -= 1;
      }
    }

    function isWall(x, y) {
      const gx = Math.floor(x / TILE);
      const gy = Math.floor(y / TILE);
      return GRID[gy] && GRID[gy][gx] === 1;
    }

    function update() {
      if (!gameOver) {
        const nextX = baby.x + baby.vx;
        const nextY = baby.y + baby.vy;
        if (!isWall(nextX, baby.y)) baby.x = nextX;
        else baby.vx = 0;
        if (!isWall(baby.x, nextY)) baby.y = nextY;
        else baby.vy = 0;
        // keep the baby aligned with the center of the row/column
        if (baby.vx !== 0) {
          baby.y = Math.floor(baby.y / TILE) * TILE + TILE / 2;
        } else if (baby.vy !== 0) {
          baby.x = Math.floor(baby.x / TILE) * TILE + TILE / 2;
        }
        const d = Math.hypot(baby.x - food.x, baby.y - food.y);
        if (d < baby.r + food.r) {
          baby.r += 2;
          baby.speed += 0.5;
          score += 1;
          ammo += 1;
          if (score >= 10 && currentStage === 1) {
            gameOver = true;
            successEl.style.display = 'block';
            nextStageBtn.style.display = 'block';
            babyEmoji = '👶';
            clearTimeout(timerId);
            return;
          }
          if (score >= 20 && currentStage === 2) {
            gameOver = true;
            successEl.style.display = 'block';
            nextStage3Btn.style.display = 'block';
            babyEmoji = '👶';
            clearTimeout(timerId);
            return;
          }
          if (score >= 30 && currentStage === 3) {
            gameOver = true;
            successEl.style.display = 'block';
            babyEmoji = '👶';
            restartBtn.style.display = 'block';
            clearTimeout(timerId);
            return;
          }
          babyEmoji = '😊';
          setTimeout(() => { babyEmoji = '👶'; }, 800);
          clearTimeout(timerId);
          spawnFood();
          timerId = setTimeout(endGame, 13000);
        }

        if (mothers.length > 0) {
          for (const m of mothers) {
            if (currentStage === 3 && m.speed) {
              const dx = baby.x - m.x;
              const dy = baby.y - m.y;
              const dist = Math.hypot(dx, dy);
              if (dist > 0) {
                const stepX = (dx / dist) * m.speed;
                const stepY = (dy / dist) * m.speed;
                const nx = m.x + stepX;
                const ny = m.y + stepY;
                if (!isWall(nx, m.y)) m.x = nx;
                if (!isWall(m.x, ny)) m.y = ny;
              }
            }
            const md = Math.hypot(baby.x - m.x, baby.y - m.y);
            if (md < baby.r + m.r) {
              endGame();
              return;
            }
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const t = Date.now() / 200;

      // draw cells
      for (let y = 0; y < GRID.length; y++) {
        for (let x = 0; x < GRID[y].length; x++) {
          if (GRID[y][x] === 1) {
            const b = Math.sin(t + x + y) * 4;
            ctx.font = `${TILE * 0.8}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌳', x * TILE + TILE / 2, y * TILE + TILE / 2 - b);
          } else {
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
          }
        }
      }
      // grid lines
      ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1;
      for (let i = 0; i <= GRID.length; i++) {
        ctx.beginPath(); ctx.moveTo(i * TILE, 0); ctx.lineTo(i * TILE, GRID.length * TILE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * TILE); ctx.lineTo(GRID.length * TILE, i * TILE); ctx.stroke();
      }
      // draw food as emoji
      if (!gameOver) {
        const bFood = Math.sin(t + food.x + food.y) * 4;
        ctx.font = `${food.r * 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(currentFoodEmoji, food.x, food.y - bFood);
      }
      // draw baby as emoji
      const bBaby = Math.sin(t + baby.x + baby.y) * 4;
      ctx.font = `${baby.r * 2}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(babyEmoji, baby.x, baby.y - bBaby);

      if (mothers.length > 0) {
        for (const m of mothers) {
          const bM = Math.sin(t + m.x + m.y) * 4;
          ctx.font = `${m.r * 2}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(MOTHER_EMOJI, m.x, m.y - bM);
        }
      }

      ctx.restore();

      // HUD
      const timeLeft = Math.max(0, 13 - Math.floor((Date.now() - timeStart) / 1000));
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(5,5,140,70);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Time: ${timeLeft}s`, 10, 30);
      ctx.fillText(`Score: ${score}`, 10, 50);
      ctx.fillText(`Ammo: ${ammo}`, 10, 70);
    }

    function loop() {
      update(); draw();
      if (!gameOver) requestAnimationFrame(loop);
    }

    function endGame() {
      gameOver = true;
      gameOverEl.style.display = 'block';
      restartBtn.style.display = 'block';
    }

    // show start button on load
