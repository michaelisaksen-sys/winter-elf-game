import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.snowParticles = null;
        this.particleCount = 2000;

        this.create();
    }

    create() {
        // Create snow particles
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Random position in a large area
            positions.push(
                (Math.random() - 0.5) * 200,
                Math.random() * 50 + 10,
                (Math.random() - 0.5) * 200
            );

            // Random falling velocity
            velocities.push(
                (Math.random() - 0.5) * 0.2,
                -Math.random() * 0.5 - 0.3,
                (Math.random() - 0.5) * 0.2
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

        // Create material
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            map: this.createSnowflakeTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.snowParticles = new THREE.Points(geometry, material);
        this.scene.add(this.snowParticles);
    }

    createSnowflakeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    update(delta) {
        if (!this.snowParticles) return;

        const positions = this.snowParticles.geometry.attributes.position.array;
        const velocities = this.snowParticles.geometry.attributes.velocity.array;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Update position based on velocity
            positions[i3] += velocities[i3] * delta * 10;
            positions[i3 + 1] += velocities[i3 + 1] * delta * 10;
            positions[i3 + 2] += velocities[i3 + 2] * delta * 10;

            // Reset particles that fall below ground
            if (positions[i3 + 1] < 0) {
                positions[i3 + 1] = 50 + Math.random() * 10;
                positions[i3] = (Math.random() - 0.5) * 200;
                positions[i3 + 2] = (Math.random() - 0.5) * 200;
            }
        }

        this.snowParticles.geometry.attributes.position.needsUpdate = true;
    }
}
