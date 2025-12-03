export class EnergySystem {
    constructor(character) {
        this.character = character;

        this.energy = 100;
        this.maxEnergy = 100;
        this.depletionRate = 2; // Energy lost per second
        this.sprintDepletionRate = 5;
        this.porridgeRestoration = 50;

        this.lastEatTime = 0;
        this.eatCooldown = 2000; // 2 seconds cooldown
    }

    update(delta) {
        // Deplete energy over time
        let depletion = this.depletionRate * delta;

        // Increase depletion if sprinting
        if (this.character.velocity.length() > this.character.walkSpeed) {
            depletion = this.sprintDepletionRate * delta;
        }

        this.energy = Math.max(0, this.energy - depletion);

        // Affect character speed based on energy
        this.updateCharacterSpeed();
    }

    updateCharacterSpeed() {
        // Low energy reduces speed
        if (this.energy < 20) {
            this.character.walkSpeed = 3;
            this.character.runSpeed = 5;
        } else if (this.energy < 50) {
            this.character.walkSpeed = 4;
            this.character.runSpeed = 6;
        } else {
            this.character.walkSpeed = 5;
            this.character.runSpeed = 8;
        }
    }

    eatPorridge() {
        const now = Date.now();
        if (now - this.lastEatTime < this.eatCooldown) {
            return false;
        }

        this.energy = Math.min(this.maxEnergy, this.energy + this.porridgeRestoration);
        this.lastEatTime = now;

        console.log(`Ate porridge! Energy: ${this.energy}`);
        return true;
    }

    getEnergyPercentage() {
        return (this.energy / this.maxEnergy) * 100;
    }

    reset() {
        this.energy = 100;
        this.lastEatTime = 0;
    }
}
