export class Minimap {
    constructor(character, cat, environment) {
        this.character = character;
        this.cat = cat;
        this.environment = environment;

        this.canvas = document.getElementById('minimap-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        // Map settings
        this.scale = 1.5; // pixels per world unit
        this.centerX = this.canvas ? this.canvas.width / 2 : 75;
        this.centerY = this.canvas ? this.canvas.height / 2 : 75;
        this.worldSize = 100; // Half the terrain size
    }

    update() {
        if (!this.ctx || !this.canvas || !this.character) return;

        const ctx = this.ctx;
        const canvas = this.canvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        ctx.fillStyle = 'rgba(20, 30, 50, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate offset based on character position
        const offsetX = this.centerX - this.character.position.x * this.scale;
        const offsetY = this.centerY - this.character.position.z * this.scale;

        // Draw frozen lake
        if (this.environment && this.environment.iceArea) {
            const lake = this.environment.iceArea;
            const lakeX = offsetX + lake.center.x * this.scale;
            const lakeY = offsetY + lake.center.z * this.scale;
            const lakeRadius = lake.radius * this.scale;

            ctx.beginPath();
            ctx.arc(lakeX, lakeY, lakeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 230, 245, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(200, 230, 245, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw cabin
        if (this.environment && this.environment.cabin) {
            const cabinX = offsetX + this.environment.cabin.position.x * this.scale;
            const cabinY = offsetY + this.environment.cabin.position.z * this.scale;

            ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
            ctx.fillRect(cabinX - 3, cabinY - 3, 6, 6);
            ctx.strokeStyle = 'rgba(255, 235, 156, 0.6)';
            ctx.lineWidth = 1;
            ctx.strokeRect(cabinX - 3, cabinY - 3, 6, 6);
        }

        // Draw trees
        if (this.environment && this.environment.trees) {
            ctx.fillStyle = 'rgba(45, 80, 22, 0.6)';
            for (const tree of this.environment.trees) {
                const treeX = offsetX + tree.position.x * this.scale;
                const treeY = offsetY + tree.position.z * this.scale;

                // Only draw if on screen
                if (treeX > -5 && treeX < canvas.width + 5 &&
                    treeY > -5 && treeY < canvas.height + 5) {
                    ctx.beginPath();
                    ctx.arc(treeX, treeY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Draw porridge bowls
        if (this.environment && this.environment.porridgeBowls) {
            for (const bowl of this.environment.porridgeBowls) {
                const bowlX = offsetX + bowl.position.x * this.scale;
                const bowlY = offsetY + bowl.position.z * this.scale;

                // Draw bowl icon
                ctx.beginPath();
                ctx.arc(bowlX, bowlY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 222, 179, 0.9)';
                ctx.fill();
                ctx.strokeStyle = 'rgba(210, 105, 30, 0.9)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Draw cat
        if (this.cat && !this.character.isRidingCat) {
            const catX = offsetX + this.cat.position.x * this.scale;
            const catY = offsetY + this.cat.position.z * this.scale;

            // Draw cat icon
            ctx.beginPath();
            ctx.arc(catX, catY, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw character (always in center)
        const charX = this.centerX;
        const charY = this.centerY;

        // Character direction indicator
        ctx.save();
        ctx.translate(charX, charY);
        ctx.rotate(this.character.rotation);

        // Draw character triangle pointing forward
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-4, 4);
        ctx.lineTo(4, 4);
        ctx.closePath();

        if (this.character.isRidingCat) {
            ctx.fillStyle = 'rgba(255, 100, 255, 0.9)';
        } else if (this.character.isSkating) {
            ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
        } else {
            ctx.fillStyle = 'rgba(46, 204, 113, 0.9)';
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Draw compass
        this.drawCompass(ctx, canvas);
    }

    drawCompass(ctx, canvas) {
        const compassX = canvas.width - 20;
        const compassY = 20;
        const compassRadius = 12;

        // Compass background
        ctx.beginPath();
        ctx.arc(compassX, compassY, compassRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // North indicator
        ctx.save();
        ctx.translate(compassX, compassY);

        // N arrow
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(-3, -2);
        ctx.lineTo(3, -2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
        ctx.fill();

        // N letter
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', 0, 5);

        ctx.restore();
    }
}
