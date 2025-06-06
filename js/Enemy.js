class Enemy {
    constructor(canvas, level) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 40;
        this.height = 40;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.baseSpeed = 2;
        this.speed = this.baseSpeed + (level * 0.5);
        this.points = 100 + (level * 50);
        this.health = 1 + Math.floor(level / 3);
        
        this.image = new Image();
        this.image.src = 'assets/images/enemy.png';
        
        // Movimiento sinusoidal
        this.amplitude = Math.random() * 50 + 25;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.startX = this.x;
        this.time = 0;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        // Barra de vida si tiene más de 1 de vida
        if (this.health > 1) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x, this.y - 10, this.width, 5);
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(this.x, this.y - 10, 
                            (this.width * this.health) / (1 + Math.floor(level / 3)), 5);
        }
    }

    update() {
        this.time += this.frequency;
        this.x = this.startX + Math.sin(this.time) * this.amplitude;
        this.y += this.speed;
    }

    isOffScreen() {
        return this.y > this.canvas.height;
    }

    hit() {
        this.health--;
        return this.health <= 0;
    }
}