document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const mainMenuButton = document.getElementById('main-menu-button');
    const scoreValue = document.getElementById('score-value');
    const livesValue = document.getElementById('lives-value');
    const finalScore = document.getElementById('final-score');
    const canvas = document.getElementById('gameCanvas');

    // Configuración del canvas
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    let game = null;

    // Función para iniciar el juego
    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameOverScreen.classList.add('hidden');
        
        game = new Game(canvas, ctx);
        game.start();
        
        // Actualizar UI
        updateScore(0);
        updateLives(3);
    }

    // Función para mostrar game over
    function showGameOver() {
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        finalScore.textContent = game.score;
    }

    // Función para volver al menú principal
    function showMainMenu() {
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        if (game) {
            game.stop();
            game = null;
        }
    }

    // Funciones para actualizar la UI
    function updateScore(score) {
        scoreValue.textContent = score;
    }

    function updateLives(lives) {
        livesValue.textContent = lives;
    }

    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    mainMenuButton.addEventListener('click', showMainMenu);

    // Eventos del juego
    window.addEventListener('gameOver', () => {
        showGameOver();
    });

    window.addEventListener('scoreUpdate', (e) => {
        updateScore(e.detail.score);
    });

    window.addEventListener('livesUpdate', (e) => {
        updateLives(e.detail.lives);
    });
}); 