export class Physics {
    constructor() {
        this.character = null;
        this.environment = null;
    }

    addCharacter(character) {
        this.character = character;
    }

    addEnvironment(environment) {
        this.environment = environment;
    }

    update(delta) {
        if (!this.character || !this.environment) return;

        // Simple ground collision
        if (this.character.position.y < 1) {
            this.character.position.y = 1;
            this.character.velocity.y = 0;
            this.character.isGrounded = true;
        }

        // Check collision with trees and other objects
        this.checkTerrainBounds();
    }

    checkTerrainBounds() {
        // Keep character within terrain bounds
        const maxDistance = 90;

        if (this.character.position.x > maxDistance) {
            this.character.position.x = maxDistance;
        }
        if (this.character.position.x < -maxDistance) {
            this.character.position.x = -maxDistance;
        }
        if (this.character.position.z > maxDistance) {
            this.character.position.z = maxDistance;
        }
        if (this.character.position.z < -maxDistance) {
            this.character.position.z = -maxDistance;
        }
    }

    checkCollision(position, radius) {
        // Simple collision detection with trees and objects
        if (!this.environment) return false;

        for (const tree of this.environment.trees) {
            const distance = Math.sqrt(
                Math.pow(position.x - tree.position.x, 2) +
                Math.pow(position.z - tree.position.z, 2)
            );

            if (distance < radius + 1) {
                return true;
            }
        }

        return false;
    }
}
