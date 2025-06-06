class PowerUp {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type; // 'shield', 'multishot', 'speed'
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2;
        this.image = new Image();
        this.image.src = `assets/images/powerup.png`;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.y > this.canvas.height;
    }
}