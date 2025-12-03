export class UI {
    constructor(game) {
        this.game = game;

        // UI elements
        this.mainMenu = document.getElementById('main-menu');
        this.controlsScreen = document.getElementById('controls-screen');
        this.pauseMenu = document.getElementById('pause-menu');
        this.gameHud = document.getElementById('game-hud');
        this.interactionPrompt = document.getElementById('interaction-prompt');
        this.energyBar = document.getElementById('energy-bar');
        this.energyValue = document.getElementById('energy-value');
        this.activityIndicator = document.getElementById('activity-indicator');

        this.init();
    }

    init() {
        // Main menu buttons
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('controls-button').addEventListener('click', () => {
            this.showControls();
        });

        document.getElementById('back-button').addEventListener('click', () => {
            this.hideControls();
        });

        // Pause menu buttons
        document.getElementById('resume-button').addEventListener('click', () => {
            this.resumeGame();
        });

        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
    }

    startGame() {
        this.mainMenu.style.display = 'none';
        this.gameHud.style.display = 'block';
        this.game.start();
    }

    showControls() {
        this.mainMenu.style.display = 'none';
        this.controlsScreen.style.display = 'flex';
    }

    hideControls() {
        this.controlsScreen.style.display = 'none';
        this.mainMenu.style.display = 'flex';
    }

    showPauseMenu() {
        this.pauseMenu.style.display = 'flex';
        this.game.pause();
    }

    hidePauseMenu() {
        this.pauseMenu.style.display = 'none';
        this.game.resume();
    }

    resumeGame() {
        this.hidePauseMenu();
    }

    restartGame() {
        this.hidePauseMenu();
        this.game.restart();
    }

    update() {
        // Update energy bar
        if (this.game.energySystem) {
            const energyPercent = this.game.energySystem.getEnergyPercentage();
            this.energyBar.style.width = energyPercent + '%';
            this.energyValue.textContent = Math.round(energyPercent) + '%';

            // Change color based on energy level
            if (energyPercent < 20) {
                this.energyBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%)';
            } else if (energyPercent < 50) {
                this.energyBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #feca57 100%)';
            } else {
                this.energyBar.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)';
            }
        }

        // Update activity indicator
        this.updateActivityIndicator();
    }

    updateActivityIndicator() {
        const character = this.game.character;
        if (!character) return;

        let activity = '';

        if (character.isRidingCat) {
            activity = '🐱 Riding Cat';
        } else if (character.isSkating) {
            activity = '⛸️ Ice Skating';
        } else if (character.isEating) {
            activity = '🥣 Eating Porridge';
        }

        if (activity) {
            this.activityIndicator.textContent = activity;
            this.activityIndicator.style.display = 'block';
        } else {
            this.activityIndicator.style.display = 'none';
        }
    }

    showInteractionPrompt(text) {
        this.interactionPrompt.textContent = text;
        this.interactionPrompt.style.display = 'block';
    }

    hideInteractionPrompt() {
        this.interactionPrompt.style.display = 'none';
    }
}
