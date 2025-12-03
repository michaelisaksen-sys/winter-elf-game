import * as THREE from 'three';

export class SkatingSystem {
    constructor(character, environment) {
        this.character = character;
        this.environment = environment;

        // Skating physics parameters
        this.momentum = new THREE.Vector3();
        this.acceleration = 15;
        this.deceleration = 5;
        this.maxSpeed = 12;
        this.turnSpeed = 3;

        // Trail effect (optional)
        this.trailPoints = [];
        this.maxTrailPoints = 50;
    }

    update(delta) {
        if (!this.character) return;

        // Check if character is on ice
        const onIce = this.environment.isOnIce(this.character.position);

        if (onIce && !this.character.isSkating && !this.character.isRidingCat) {
            this.enterSkating();
        } else if (!onIce && this.character.isSkating) {
            this.exitSkating();
        }

        // Update skating physics
        if (this.character.isSkating) {
            this.updateSkatingPhysics(delta);
        }
    }

    enterSkating() {
        this.character.isSkating = true;
        this.momentum.set(0, 0, 0);
        console.log('Started skating!');
    }

    exitSkating() {
        this.character.isSkating = false;
        this.momentum.set(0, 0, 0);
        console.log('Stopped skating');
    }

    applyInput(direction, speed) {
        if (!this.character.isSkating) return;

        // Apply acceleration in input direction
        if (direction.length() > 0) {
            this.momentum.x += direction.x * this.acceleration * 0.016;
            this.momentum.z += direction.z * this.acceleration * 0.016;
        }

        // Clamp to max speed
        const currentSpeed = Math.sqrt(this.momentum.x * this.momentum.x + this.momentum.z * this.momentum.z);
        if (currentSpeed > this.maxSpeed) {
            this.momentum.normalize().multiplyScalar(this.maxSpeed);
        }
    }

    updateSkatingPhysics(delta) {
        // Apply momentum to character position
        this.character.velocity.x = this.momentum.x;
        this.character.velocity.z = this.momentum.z;

        // Apply deceleration (friction on ice)
        const friction = this.deceleration * delta;
        this.momentum.x *= (1 - friction);
        this.momentum.z *= (1 - friction);

        // Stop if momentum is very low
        if (Math.abs(this.momentum.x) < 0.01) this.momentum.x = 0;
        if (Math.abs(this.momentum.z) < 0.01) this.momentum.z = 0;

        // Update character rotation based on momentum direction
        if (this.momentum.length() > 0.5) {
            const targetRotation = Math.atan2(this.momentum.x, this.momentum.z);
            const rotationDiff = targetRotation - this.character.rotation;

            // Smooth rotation
            this.character.rotation += rotationDiff * this.turnSpeed * delta;
        }

        // Add trail point
        this.addTrailPoint(this.character.position.clone());
    }

    addTrailPoint(position) {
        this.trailPoints.push(position);

        // Remove old points
        if (this.trailPoints.length > this.maxTrailPoints) {
            this.trailPoints.shift();
        }
    }

    reset() {
        this.momentum.set(0, 0, 0);
        this.trailPoints = [];
    }
}
