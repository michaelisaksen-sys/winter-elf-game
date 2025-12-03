import * as THREE from 'three';
import { SceneManager } from './scene.js';
import { Character } from './character.js';
import { Cat } from './cat.js';
import { Environment } from './environment.js';
import { Controls } from './controls.js';
import { CameraController } from './camera.js';
import { Physics } from './physics.js';
import { SkatingSystem } from './skating.js';
import { EnergySystem } from './energy.js';
import { UI } from './ui.js';
import { ParticleSystem } from './particles.js';
import { AudioManager } from './audio.js';
import { Minimap } from './minimap.js';

class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.clock = new THREE.Clock();
        this.delta = 0;

        // Initialize systems
        this.sceneManager = new SceneManager();
        this.ui = new UI(this);
        this.controls = new Controls(this);
        this.physics = new Physics();
        this.audio = new AudioManager();

        // Game objects
        this.character = null;
        this.cat = null;
        this.environment = null;
        this.cameraController = null;
        this.skatingSystem = null;
        this.energySystem = null;
        this.particleSystem = null;
        this.minimap = null;

        // Bind methods
        this.animate = this.animate.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        window.addEventListener('resize', this.onWindowResize);
    }

    async init() {
        try {
            // Create environment
            this.environment = new Environment(this.sceneManager.scene);
            await this.environment.create();

            // Create character
            this.character = new Character(this.sceneManager.scene);
            this.character.create();

            // Create cat
            this.cat = new Cat(this.sceneManager.scene);
            this.cat.create();

            // Initialize camera controller
            this.cameraController = new CameraController(
                this.sceneManager.camera,
                this.character,
                this.sceneManager.renderer.domElement
            );

            // Initialize systems
            this.skatingSystem = new SkatingSystem(this.character, this.environment);
            this.energySystem = new EnergySystem(this.character);
            this.particleSystem = new ParticleSystem(this.sceneManager.scene);
            this.minimap = new Minimap(this.character, this.cat, this.environment);

            // Add objects to physics system
            this.physics.addCharacter(this.character);
            this.physics.addEnvironment(this.environment);

            console.log('Game initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing game:', error);
            return false;
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.clock.start();

        // Start audio
        this.audio.playAmbient();

        // Start animation loop
        this.animate();
    }

    pause() {
        this.isPaused = true;
        this.audio.pauseAll();
    }

    resume() {
        this.isPaused = false;
        this.audio.resumeAll();
    }

    restart() {
        // Reset character position
        this.character.reset();

        // Reset energy
        this.energySystem.reset();

        // Reset cat
        if (this.character.isRidingCat) {
            this.cat.dismount(this.character);
        }

        // Reset skating
        if (this.character.isSkating) {
            this.skatingSystem.exitSkating();
        }

        this.resume();
    }

    animate() {
        if (!this.isRunning) return;

        requestAnimationFrame(this.animate);

        if (this.isPaused) return;

        this.delta = this.clock.getDelta();

        // Update all systems
        this.update(this.delta);

        // Render scene
        this.sceneManager.render();
    }

    update(delta) {
        // Update controls
        this.controls.update(delta);

        // Update character
        if (this.character) {
            this.character.update(delta);
        }

        // Update cat
        if (this.cat) {
            this.cat.update(delta);
        }

        // Update camera
        if (this.cameraController) {
            this.cameraController.update(delta);
        }

        // Update physics
        this.physics.update(delta);

        // Update skating system
        if (this.skatingSystem) {
            this.skatingSystem.update(delta);
        }

        // Update energy system
        if (this.energySystem) {
            this.energySystem.update(delta);
        }

        // Update particles
        if (this.particleSystem) {
            this.particleSystem.update(delta);
        }

        // Check interactions
        this.checkInteractions();

        // Update UI
        this.ui.update();

        // Update minimap
        if (this.minimap) {
            this.minimap.update();
        }
    }

    checkInteractions() {
        // Check cat interaction
        const catDistance = this.character.position.distanceTo(this.cat.position);
        if (catDistance < 3 && !this.character.isRidingCat) {
            this.ui.showInteractionPrompt('Press E to ride the cat');

            if (this.controls.keys.interact && !this.controls.interactCooldown) {
                this.cat.mount(this.character);
                this.controls.interactCooldown = true;
                setTimeout(() => this.controls.interactCooldown = false, 500);
            }
        } else if (this.character.isRidingCat) {
            if (this.controls.keys.interact && !this.controls.interactCooldown) {
                this.cat.dismount(this.character);
                this.controls.interactCooldown = true;
                setTimeout(() => this.controls.interactCooldown = false, 500);
            }
        }

        // Check porridge bowls
        const bowls = this.environment.porridgeBowls || [];
        let nearBowl = false;

        for (const bowl of bowls) {
            const bowlDistance = this.character.position.distanceTo(bowl.position);
            if (bowlDistance < 2) {
                nearBowl = true;
                this.ui.showInteractionPrompt('Press E to eat porridge');

                if (this.controls.keys.interact && !this.controls.interactCooldown) {
                    this.energySystem.eatPorridge();
                    this.character.playEatingAnimation();
                    this.audio.playEatSound();
                    this.controls.interactCooldown = true;
                    setTimeout(() => this.controls.interactCooldown = false, 2000);
                }
                break;
            }
        }

        if (!nearBowl && catDistance >= 3) {
            this.ui.hideInteractionPrompt();
        }
    }

    onWindowResize() {
        this.sceneManager.onResize();
        if (this.cameraController) {
            this.cameraController.onResize();
        }
    }
}

// Initialize game when page loads
let game;

window.addEventListener('DOMContentLoaded', async () => {
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');

    loadingProgress.style.width = '20%';

    // Create game instance
    game = new Game();
    window.game = game; // For debugging

    loadingProgress.style.width = '50%';

    // Initialize game
    const success = await game.init();

    loadingProgress.style.width = '100%';

    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);

    if (!success) {
        alert('Failed to initialize game. Please refresh the page.');
    }
});

export { Game };
