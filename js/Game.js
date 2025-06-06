class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.soundManager = new SoundManager();
        this.player = new Player(this.canvas);
        this.enemies = [];
        this.powerups = [];
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        
        this.setupControls();
        this.lastEnemySpawn = 0;
        this.lastPowerupSpawn = 0;
        this.enemySpawnInterval = 2000;
        this.powerupSpawnInterval = 10000;
        
        // Cargar puntuaciones altas
        this.highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        
        this.setupEventListeners();
        this.showMenu();
    }

    setupEventListeners() {
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('high-scores-button').addEventListener('click', () => {
            this.showHighScores();
        });

        document.getElementById('save-score').addEventListener('click', () => {
            this.saveScore();
        });

        document.getElementById('play-again').addEventListener('click', () => {
            this.showMenu();
        });
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.paused) return;
            
            if (e.key === 'ArrowLeft') this.player.move('left');
            if (e.key === 'ArrowRight') this.player.move('right');
            if (e.key === ' ') {
                this.player.shoot();
                this.soundManager.play('shoot');
            }
            if (e.key === 'p') this.togglePause();
            if (e.key === 'm') this.soundManager.toggleMute();
        });

        // Controles táctiles para dispositivos móviles
        let touchStartX = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.gameOver || this.paused) return;
            
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            if (diff > 10) this.player.move('right');
            if (diff < -10) this.player.move('left');
            
            touchStartX = touchX;
        });

        this.canvas.addEventListener('touchend', () => {
            if (this.gameOver || this.paused) return;
            this.player.shoot();
            this.soundManager.play('shoot');
        });
    }

    showMenu() {
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('game').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
    }

    startGame() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        document.getElementById('game-over').classList.add('hidden');
        
        this.resetGame();
        this.soundManager.startBackground();
        this.animate();
    }

    resetGame() {
        this.player = new Player(this.canvas);
        this.enemies = [];
        this.powerups = [];
        this.score = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.updateHUD();
    }

    spawnEnemy() {
        const now = Date.now();
        if (now - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.enemies.push(new Enemy(this.canvas, this.level));
            this.lastEnemySpawn = now;
            
            // Reducir el intervalo de spawn con cada nivel
            this.enemySpawnInterval = Math.max(500, 2000 - (this.level * 100));
        }
    }

    spawnPowerup() {
        const now = Date.now();
        if (now - this.lastPowerupSpawn > this.powerupSpawnInterval) {
            const types = ['shield', 'multishot', 'speed'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            this.powerups.push(new PowerUp(this.canvas, randomType));
            this.lastPowerupSpawn = now;
        }
    }

    checkCollisions() {
        // Colisiones entre balas y enemigos
        this.enemies.forEach((enemy, enemyIndex) => {
            this.player.bullets.forEach((bullet, bulletIndex) => {
                if (checkCollision(
                    {x: bullet.x, y: bullet.y, width: 5, height: 10},
                    {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height}
                )) {
                    this.player.bullets.splice(bulletIndex, 1);
                    
                    if (enemy.hit()) {
                        this.enemies.splice(enemyIndex, 1);
                        this.score += enemy.points;
                        this.soundManager.play('explosion');
                        this.player.addParticles(10, '255, 100, 100');
                        this.updateHUD();
                        this.checkLevelUp();
                    }
                }
            });

            // Colisiones entre jugador y enemigos
            if (!this.player.powerups.shield && checkCollision(
                {x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height},
                {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height}
            )) {
                this.enemies.splice(enemyIndex, 1);
                this.player.lives--;
                this.soundManager.play('explosion');
                this.player.addParticles(20, '255, 200, 100');
                this.updateHUD();
                
                if (this.player.lives <= 0) {
                    this.endGame();
                }
            }
        });

        // Colisiones entre jugador y power-ups
        this.powerups.forEach((powerup, index) => {
            if (checkCollision(
                {x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height},
                {x: powerup.x, y: powerup.y, width: powerup.width, height: powerup.height}
            )) {
                this.powerups.splice(index, 1);
                this.player.activatePowerup(powerup.type);
                this.soundManager.play('powerup');
                this.player.addParticles(15, '100, 255, 100');
            }
        });
    }

    checkLevelUp() {
        if (this.score >= this.level * 1000) {
            this.level++;
            this.updateHUD();
            // Efecto visual de nivel superior
            this.player.addParticles(30, '255, 255, 100');
        }
    }

    updateHUD() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.player.lives;
        document.getElementById('levelValue').textContent = this.level;
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.soundManager.stopBackground();
        } else {
            this.soundManager.startBackground();
            this.animate();
        }
    }

    endGame() {
        this.gameOver = true;
        this.soundManager.stopBackground();
        document.getElementById('game').classList.add('hidden');
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
    }

    saveScore() {
        const playerName = document.getElementById('player-name').value || 'Anónimo';
        this.highScores.push({name: playerName, score: this.score});
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10); // Mantener solo los 10 mejores
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
        this.showMenu();
    }

    showHighScores() {
        // Implementar visualización de puntuaciones altas
    }

    animate() {
        if (this.gameOver || this.paused) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.spawnEnemy();
        this.spawnPowerup();
        
        this.player.draw();
        
        this.enemies = this.enemies.filter(enemy => !enemy.isOffScreen());
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
        
        this.powerups = this.powerups.filter(powerup => !powerup.isOffScreen());
        this.powerups.forEach(powerup => {
            powerup.update();
            powerup.draw();
        });
        
        this.checkCollisions();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    new Game();
});