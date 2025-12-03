import * as THREE from 'three';

export class Controls {
    constructor(game) {
        this.game = game;

        // Character movement keys (Arrow keys)
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            jump: false,
            sprint: false,
            interact: false,
            pause: false,
        };

        // Camera control keys (WASD)
        this.cameraKeys = {
            up: false,      // W
            down: false,    // S
            left: false,    // A
            right: false,   // D
            zoomIn: false,  // Q
            zoomOut: false, // E (moved interact to F)
        };

        this.interactCooldown = false;

        this.init();
    }

    init() {
        // Keyboard events
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        // Mouse events
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('click', this.onMouseClick.bind(this));
    }

    onKeyDown(event) {
        switch (event.code) {
            // Arrow keys for character movement
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'ArrowRight':
                this.keys.right = true;
                break;

            // WASD for camera control
            case 'KeyW':
                this.cameraKeys.up = true;
                break;
            case 'KeyS':
                this.cameraKeys.down = true;
                break;
            case 'KeyA':
                this.cameraKeys.left = true;
                break;
            case 'KeyD':
                this.cameraKeys.right = true;
                break;

            // Other controls
            case 'Space':
                this.keys.jump = true;
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.sprint = true;
                break;
            case 'KeyE':
                this.keys.interact = true;
                break;
            case 'KeyQ':
                this.cameraKeys.zoomIn = true;
                break;
            case 'KeyR':
                this.cameraKeys.zoomOut = true;
                break;
            case 'Escape':
                this.togglePause();
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            // Arrow keys for character movement
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'ArrowRight':
                this.keys.right = false;
                break;

            // WASD for camera control
            case 'KeyW':
                this.cameraKeys.up = false;
                break;
            case 'KeyS':
                this.cameraKeys.down = false;
                break;
            case 'KeyA':
                this.cameraKeys.left = false;
                break;
            case 'KeyD':
                this.cameraKeys.right = false;
                break;

            // Other controls
            case 'Space':
                this.keys.jump = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.keys.sprint = false;
                break;
            case 'KeyE':
                this.keys.interact = false;
                break;
            case 'KeyQ':
                this.cameraKeys.zoomIn = false;
                break;
            case 'KeyR':
                this.cameraKeys.zoomOut = false;
                break;
        }
    }

    onMouseMove(event) {
        if (this.game.isPaused) return;

        this.mouseX = event.movementX || 0;
        this.mouseY = event.movementY || 0;
    }

    onMouseClick() {
        // Request pointer lock for better mouse control
        if (!this.game.isPaused && document.pointerLockElement !== document.body) {
            document.body.requestPointerLock();
        }
    }

    togglePause() {
        if (this.game.isPaused) {
            this.game.ui.hidePauseMenu();
        } else {
            this.game.ui.showPauseMenu();
        }
    }

    update(delta) {
        if (this.game.isPaused) return;

        const character = this.game.character;
        const cat = this.game.cat;

        if (!character) return;

        // Calculate movement direction
        const moveDirection = new THREE.Vector3();

        if (this.keys.forward) moveDirection.z += 1;
        if (this.keys.backward) moveDirection.z -= 1;
        if (this.keys.left) moveDirection.x += 1;
        if (this.keys.right) moveDirection.x -= 1;

        // Normalize direction
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
        }

        // Apply camera rotation to movement
        const cameraRotation = this.game.cameraController.azimuthAngle;
        const rotatedDirection = new THREE.Vector3();
        rotatedDirection.x = moveDirection.x * Math.cos(cameraRotation) - moveDirection.z * Math.sin(cameraRotation);
        rotatedDirection.z = moveDirection.x * Math.sin(cameraRotation) + moveDirection.z * Math.cos(cameraRotation);

        // Determine speed based on energy and sprint
        let speed = character.walkSpeed;
        if (this.keys.sprint && this.game.energySystem && this.game.energySystem.energy > 20) {
            speed = character.runSpeed;
        }

        // Adjust speed based on energy
        if (this.game.energySystem) {
            const energyMultiplier = Math.max(0.5, this.game.energySystem.energy / 100);
            speed *= energyMultiplier;
        }

        // If riding cat, move cat instead of character
        if (character.isRidingCat && cat) {
            cat.moveWithCharacter(character, rotatedDirection, speed);
        } else if (character.isSkating && this.game.skatingSystem) {
            // Ice skating uses momentum-based movement
            this.game.skatingSystem.applyInput(rotatedDirection, speed);
        } else {
            // Normal movement
            character.move(rotatedDirection, speed);
        }

        // Jump
        if (this.keys.jump) {
            character.jump();
            this.keys.jump = false; // Prevent continuous jumping
        }
    }

    getMovementDirection() {
        const direction = new THREE.Vector3();

        if (this.keys.forward) direction.z += 1;
        if (this.keys.backward) direction.z -= 1;
        if (this.keys.left) direction.x += 1;
        if (this.keys.right) direction.x -= 1;

        if (direction.length() > 0) {
            direction.normalize();
        }

        return direction;
    }
}
