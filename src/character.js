import * as THREE from 'three';

export class Character {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3();
        this.rotation = 0;

        // Character states
        this.isGrounded = true;
        this.isJumping = false;
        this.isRidingCat = false;
        this.isSkating = false;
        this.isEating = false;

        // Movement parameters
        this.walkSpeed = 5;
        this.runSpeed = 8;
        this.jumpForce = 8;
        this.gravity = -20;

        // Animation
        this.animationState = 'idle';
        this.animationTime = 0;

        // Ice skating parameters
        this.skatingSpeed = 10;
        this.skatingMomentum = new THREE.Vector3();
    }

    create() {
        const elfGroup = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.5, 1.2, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2ecc71,
            roughness: 0.7,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.castShadow = true;
        elfGroup.add(body);

        // Head
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.8,
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.2;
        head.castShadow = true;
        elfGroup.add(head);

        // Elf ears
        const earGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
        const earMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.8,
        });

        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.35, 2.3, 0);
        leftEar.rotation.z = -Math.PI / 4;
        leftEar.castShadow = true;
        elfGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.35, 2.3, 0);
        rightEar.rotation.z = Math.PI / 4;
        rightEar.castShadow = true;
        elfGroup.add(rightEar);

        // Hat
        const hatGeometry = new THREE.ConeGeometry(0.45, 0.8, 8);
        const hatMaterial = new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            roughness: 0.7,
        });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 2.7;
        hat.castShadow = true;
        elfGroup.add(hat);

        // Hat pom-pom
        const pomGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const pomMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
        });
        const pom = new THREE.Mesh(pomGeometry, pomMaterial);
        pom.position.y = 3.1;
        elfGroup.add(pom);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 2.25, 0.35);
        elfGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 2.25, 0.35);
        elfGroup.add(rightEye);

        // Nose
        const noseGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb6b9,
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 2.1, 0.4);
        elfGroup.add(nose);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x2ecc71,
            roughness: 0.7,
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.6, 1.3, 0);
        leftArm.rotation.z = Math.PI / 6;
        leftArm.castShadow = true;
        elfGroup.add(leftArm);
        this.leftArm = leftArm;

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.6, 1.3, 0);
        rightArm.rotation.z = -Math.PI / 6;
        rightArm.castShadow = true;
        elfGroup.add(rightArm);
        this.rightArm = rightArm;

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8,
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.4, 0);
        leftLeg.castShadow = true;
        elfGroup.add(leftLeg);
        this.leftLeg = leftLeg;

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, 0.4, 0);
        rightLeg.castShadow = true;
        elfGroup.add(rightLeg);
        this.rightLeg = rightLeg;

        // Boots
        const bootGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.35);
        const bootMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.9,
        });

        const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
        leftBoot.position.set(-0.2, 0.05, 0.05);
        leftBoot.castShadow = true;
        elfGroup.add(leftBoot);

        const rightBoot = new THREE.Mesh(bootGeometry, bootMaterial);
        rightBoot.position.set(0.2, 0.05, 0.05);
        rightBoot.castShadow = true;
        elfGroup.add(rightBoot);

        // Store body parts for animations
        this.body = body;
        this.head = head;

        this.mesh = elfGroup;
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);
    }

    update(delta) {
        this.animationTime += delta;

        // Update animations
        this.updateAnimations(delta);

        // Apply gravity if not grounded
        if (!this.isGrounded && !this.isRidingCat) {
            this.velocity.y += this.gravity * delta;
        }

        // Update position
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;

        // Keep above ground
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isGrounded = true;
            this.isJumping = false;
        }

        // Update mesh position and rotation
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.y = this.rotation;
        }
    }

    updateAnimations(delta) {
        if (!this.leftArm || !this.rightArm || !this.leftLeg || !this.rightLeg) return;

        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

        if (this.isEating) {
            // Eating animation - move hands to mouth
            this.leftArm.rotation.z = Math.PI / 3;
            this.leftArm.rotation.x = -Math.PI / 2;
            this.rightArm.rotation.z = -Math.PI / 3;
            this.rightArm.rotation.x = -Math.PI / 2;
            return;
        }

        if (this.isSkating) {
            // Skating animation - gliding pose
            const wave = Math.sin(this.animationTime * 3) * 0.3;
            this.leftArm.rotation.z = Math.PI / 4 + wave;
            this.rightArm.rotation.z = -Math.PI / 4 - wave;
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;

            this.leftLeg.rotation.x = wave * 0.5;
            this.rightLeg.rotation.x = -wave * 0.5;
            return;
        }

        if (this.isRidingCat) {
            // Riding animation - hold reins pose
            this.leftArm.rotation.z = Math.PI / 6;
            this.leftArm.rotation.x = Math.PI / 4;
            this.rightArm.rotation.z = -Math.PI / 6;
            this.rightArm.rotation.x = Math.PI / 4;

            const bounce = Math.sin(this.animationTime * 8) * 0.05;
            this.mesh.position.y = this.position.y + bounce;
            return;
        }

        if (speed > 0.1 && this.isGrounded) {
            // Walking/running animation
            const frequency = speed > 6 ? 10 : 6;
            const amplitude = 0.5;

            this.leftArm.rotation.z = Math.PI / 6;
            this.rightArm.rotation.z = -Math.PI / 6;
            this.leftArm.rotation.x = Math.sin(this.animationTime * frequency) * amplitude;
            this.rightArm.rotation.x = -Math.sin(this.animationTime * frequency) * amplitude;

            this.leftLeg.rotation.x = Math.sin(this.animationTime * frequency) * amplitude;
            this.rightLeg.rotation.x = -Math.sin(this.animationTime * frequency) * amplitude;

            // Bob up and down
            const bob = Math.abs(Math.sin(this.animationTime * frequency)) * 0.1;
            this.mesh.position.y = this.position.y + bob;
        } else {
            // Idle animation
            const idleWave = Math.sin(this.animationTime * 2) * 0.1;
            this.leftArm.rotation.z = Math.PI / 6 + idleWave;
            this.rightArm.rotation.z = -Math.PI / 6 - idleWave;
            this.leftArm.rotation.x = 0;
            this.rightArm.rotation.x = 0;

            this.leftLeg.rotation.x = 0;
            this.rightLeg.rotation.x = 0;
        }
    }

    move(direction, speed) {
        if (this.isEating) return;

        const moveSpeed = speed * (this.isRidingCat ? 1.5 : 1);
        this.velocity.x = direction.x * moveSpeed;
        this.velocity.z = direction.z * moveSpeed;

        // Update rotation to face movement direction
        if (direction.length() > 0) {
            this.rotation = Math.atan2(direction.x, direction.z);
        }
    }

    jump() {
        if (this.isGrounded && !this.isJumping && !this.isRidingCat && !this.isSkating && !this.isEating) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            this.isJumping = true;
        }
    }

    playEatingAnimation() {
        this.isEating = true;
        setTimeout(() => {
            this.isEating = false;
        }, 2000);
    }

    reset() {
        this.position.set(0, 0, 0);
        this.velocity.set(0, 0, 0);
        this.rotation = 0;
        this.isGrounded = true;
        this.isJumping = false;
        this.isRidingCat = false;
        this.isSkating = false;
        this.isEating = false;

        if (this.mesh) {
            this.mesh.position.copy(this.position);
            this.mesh.rotation.y = this.rotation;
        }
    }
}
