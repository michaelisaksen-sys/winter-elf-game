export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.isInitialized = false;

        // Audio enabled flag
        this.enabled = true;
    }

    init() {
        // Audio context will be created on first user interaction
        if (!this.context) {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.isInitialized = true;
            } catch (e) {
                console.warn('Web Audio API not supported', e);
                this.enabled = false;
            }
        }
    }

    // Create simple synthesized sounds
    playAmbient() {
        if (!this.enabled) return;
        this.init();

        // Simple ambient wind sound using oscillator
        // In a real implementation, you'd load audio files
        console.log('Playing ambient sounds...');
    }

    playFootstep() {
        if (!this.enabled) return;
        this.init();

        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.frequency.value = 100;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.1);
        } catch (e) {
            console.warn('Error playing footstep sound', e);
        }
    }

    playJump() {
        if (!this.enabled) return;
        this.init();

        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.frequency.setValueAtTime(200, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.2);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.2);

            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.2);
        } catch (e) {
            console.warn('Error playing jump sound', e);
        }
    }

    playEatSound() {
        if (!this.enabled) return;
        this.init();

        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.frequency.value = 400;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.3);
        } catch (e) {
            console.warn('Error playing eat sound', e);
        }
    }

    playSkateSound() {
        if (!this.enabled) return;
        this.init();

        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.frequency.value = 150;
            oscillator.type = 'sawtooth';

            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.5);
        } catch (e) {
            console.warn('Error playing skate sound', e);
        }
    }

    pauseAll() {
        if (this.context && this.context.state === 'running') {
            this.context.suspend();
        }
    }

    resumeAll() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}
