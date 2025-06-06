class SoundManager {
    constructor() {
        this.sounds = {
            shoot: new Audio('assets/sounds/shoot.wav'),
            explosion: new Audio('assets/sounds/explosion.wav'),
            powerup: new Audio('assets/sounds/powerup.wav'),
            background: new Audio('assets/sounds/background-music.mp3')
        };

        this.sounds.background.loop = true;
        this.muted = false;
    }

    play(soundName) {
        if (!this.muted && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        }
    }

    startBackground() {
        if (!this.muted) {
            this.sounds.background.play();
        }
    }

    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBackground();
        } else {
            this.startBackground();
        }
    }
}