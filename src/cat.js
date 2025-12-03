import * as THREE from 'three';

export class Cat {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.position = new THREE.Vector3(5, 0.5, 5);
        this.rotation = 0;

        // Animation
        this.animationTime = 0;
        this.idleAnimationTime = 0;
        this.tailSwayTime = 0;

        // State
        this.isMounted = false;
    }

    create() {
        const catGroup = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.2, 0.6, 0.8);
        const catMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.8,
        });
        const body = new THREE.Mesh(bodyGeometry, catMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        catGroup.add(body);
        this.body = body;

        // Head
        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const head = new THREE.Mesh(headGeometry, catMaterial);
        head.position.set(0, 0.75, 0.65);
        head.castShadow = true;
        catGroup.add(head);
        this.head = head;

        // Ears
        const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);
        const leftEar = new THREE.Mesh(earGeometry, catMaterial);
        leftEar.position.set(-0.15, 0.95, 0.65);
        leftEar.castShadow = true;
        catGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, catMaterial);
        rightEar.position.set(0.15, 0.95, 0.65);
        rightEar.castShadow = true;
        catGroup.add(rightEar);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.3,
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12, 0.78, 0.9);
        catGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12, 0.78, 0.9);
        catGroup.add(rightEye);

        // Pupils
        const pupilGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const pupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
        });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(-0.12, 0.78, 0.95);
        catGroup.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0.12, 0.78, 0.95);
        catGroup.add(rightPupil);

        // Nose
        const noseGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: 0xff69b4,
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0.68, 0.92);
        catGroup.add(nose);

        // Whiskers
        const whiskerGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.5, 4);
        const whiskerMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
        });

        for (let i = 0; i < 3; i++) {
            const leftWhisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
            leftWhisker.position.set(-0.25, 0.7 - i * 0.05, 0.85);
            leftWhisker.rotation.z = Math.PI / 2;
            leftWhisker.rotation.y = -Math.PI / 6;
            catGroup.add(leftWhisker);

            const rightWhisker = new THREE.Mesh(whiskerGeometry, whiskerMaterial);
            rightWhisker.position.set(0.25, 0.7 - i * 0.05, 0.85);
            rightWhisker.rotation.z = Math.PI / 2;
            rightWhisker.rotation.y = Math.PI / 6;
            catGroup.add(rightWhisker);
        }

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);

        const frontLeftLeg = new THREE.Mesh(legGeometry, catMaterial);
        frontLeftLeg.position.set(-0.35, 0.25, 0.3);
        frontLeftLeg.castShadow = true;
        catGroup.add(frontLeftLeg);
        this.frontLeftLeg = frontLeftLeg;

        const frontRightLeg = new THREE.Mesh(legGeometry, catMaterial);
        frontRightLeg.position.set(0.35, 0.25, 0.3);
        frontRightLeg.castShadow = true;
        catGroup.add(frontRightLeg);
        this.frontRightLeg = frontRightLeg;

        const backLeftLeg = new THREE.Mesh(legGeometry, catMaterial);
        backLeftLeg.position.set(-0.35, 0.25, -0.2);
        backLeftLeg.castShadow = true;
        catGroup.add(backLeftLeg);
        this.backLeftLeg = backLeftLeg;

        const backRightLeg = new THREE.Mesh(legGeometry, catMaterial);
        backRightLeg.position.set(0.35, 0.25, -0.2);
        backRightLeg.castShadow = true;
        catGroup.add(backRightLeg);
        this.backRightLeg = backRightLeg;

        // Tail
        const tailSegments = [];
        for (let i = 0; i < 5; i++) {
            const size = 0.15 - i * 0.02;
            const segmentGeometry = new THREE.SphereGeometry(size, 8, 8);
            const segment = new THREE.Mesh(segmentGeometry, catMaterial);
            segment.castShadow = true;
            catGroup.add(segment);
            tailSegments.push(segment);
        }
        this.tailSegments = tailSegments;

        this.mesh = catGroup;
        this.mesh.position.copy(this.position);
        this.scene.add(this.mesh);
    }

    update(delta) {
        this.animationTime += delta;
        this.idleAnimationTime += delta;
        this.tailSwayTime += delta;

        if (!this.mesh) return;

        // Update tail animation
        this.updateTail();

        if (!this.isMounted) {
            // Idle animations when not mounted
            this.updateIdleAnimation();
        } else {
            // Walking animation when mounted
            this.updateWalkingAnimation();
        }

        // Update mesh position
        this.mesh.position.copy(this.position);
        this.mesh.rotation.y = this.rotation;
    }

    updateTail() {
        if (!this.tailSegments) return;

        const tailBaseX = -0.6;
        const tailBaseY = 0.7;
        const tailBaseZ = -0.4;

        for (let i = 0; i < this.tailSegments.length; i++) {
            const segment = this.tailSegments[i];
            const offset = i * 0.2;
            const sway = Math.sin(this.tailSwayTime * 3 + i * 0.5) * 0.3;
            const lift = Math.cos(this.tailSwayTime * 3 + i * 0.5) * 0.2;

            segment.position.set(
                tailBaseX - offset * 0.3 + sway,
                tailBaseY + i * 0.15 + lift,
                tailBaseZ
            );
        }
    }

    updateIdleAnimation() {
        // Gentle breathing
        const breathe = Math.sin(this.idleAnimationTime * 2) * 0.02;
        if (this.body) {
            this.body.scale.y = 1 + breathe;
        }

        // Occasional head movement
        if (this.head) {
            const headBob = Math.sin(this.idleAnimationTime * 1.5) * 0.1;
            this.head.rotation.x = headBob;
        }
    }

    updateWalkingAnimation() {
        const frequency = 8;
        const legSwing = 0.5;

        if (this.frontLeftLeg && this.frontRightLeg && this.backLeftLeg && this.backRightLeg) {
            this.frontLeftLeg.rotation.x = Math.sin(this.animationTime * frequency) * legSwing;
            this.frontRightLeg.rotation.x = -Math.sin(this.animationTime * frequency) * legSwing;
            this.backLeftLeg.rotation.x = -Math.sin(this.animationTime * frequency) * legSwing;
            this.backRightLeg.rotation.x = Math.sin(this.animationTime * frequency) * legSwing;
        }

        // Body bounce
        const bounce = Math.abs(Math.sin(this.animationTime * frequency)) * 0.05;
        this.mesh.position.y = this.position.y + bounce;
    }

    mount(character) {
        if (this.isMounted) return;

        this.isMounted = true;
        character.isRidingCat = true;

        // Position character on cat
        this.attachCharacter(character);
    }

    dismount(character) {
        if (!this.isMounted) return;

        this.isMounted = false;
        character.isRidingCat = false;

        // Place character next to cat
        character.position.set(
            this.position.x + 2,
            1,
            this.position.z
        );
    }

    attachCharacter(character) {
        // Position character on top of cat
        character.position.set(
            this.position.x,
            this.position.y + 0.8,
            this.position.z
        );
    }

    moveWithCharacter(character, direction, speed) {
        if (!this.isMounted) return;

        // Move cat based on character input
        const catSpeed = speed * 1.5;
        this.position.x += direction.x * catSpeed * 0.016;
        this.position.z += direction.z * catSpeed * 0.016;

        // Update rotation
        if (direction.length() > 0) {
            this.rotation = Math.atan2(direction.x, direction.z);
        }

        // Update character position to stay on cat
        this.attachCharacter(character);
        character.rotation = this.rotation;
    }
}
