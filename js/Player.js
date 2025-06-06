class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 50;
        this.height = 50;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
        this.bullets = [];
        this.lives = 3;
        this.powerups = {
            shield: false,
            multishot: false,
            speed: false
        };
        this.powerupTimers = {};
        
        this.image = new Image();
        this.image.src = 'assets/images/player.png';
        
        this.particles = [];
    }

    draw() {
        // Dibujar escudo si está activo
        if (this.powerups.shield) {
            this.ctx.beginPath();
            this.ctx.arc(this.x + this.width/2, this.y + this.height/2, 
                        this.width/1.5, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        // Dibujar nave
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        
        // Dibujar balas
        this.bullets.forEach((bullet, index) => {
            bullet.y -= 7;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(bullet.x, bullet.y, 5, 10);
            
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });

        // Actualizar y dibujar partículas
        this.particles = this.particles.filter(particle => particle.life > 0);
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
    }

    move(direction) {
        const speedMultiplier = this.powerups.speed ? 1.5 : 1;
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed * speedMultiplier;
        }
        if (direction === 'right' && this.x < this.canvas.width - this.width) {
            this.x += this.speed * speedMultiplier;
        }
    }

    shoot() {
        if (this.powerups.multishot) {
            // Disparo triple
            this.bullets.push(
                {x: this.x + this.width / 2, y: this.y},
                {x: this.x + this.width / 2 - 20, y: this.y},
                {x: this.x + this.width / 2 + 20, y: this.y}
            );
        } else {
            // Disparo normal
            this.bullets.push({x: this.x + this.width / 2, y: this.y});
        }
    }

    activatePowerup(type) {
        this.powerups[type] = true;
        if (this.powerupTimers[type]) {
            clearTimeout(this.powerupTimers[type]);
        }
        this.powerupTimers[type] = setTimeout(() => {
            this.powerups[type] = false;
        }, 10000); // 10 segundos de duración
    }

    addParticles(count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push(
                new Particle(
                    this.x + this.width/2,
                    this.y + this.height/2,
                    color
                )
            );
        }
    }
}