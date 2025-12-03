import * as THREE from 'three';

export class CameraController {
    constructor(camera, target, domElement) {
        this.camera = camera;
        this.target = target;
        this.domElement = domElement;

        // Camera parameters
        this.distance = 10;
        this.minDistance = 5;
        this.maxDistance = 20;
        this.height = 5;
        this.minHeight = 2;
        this.maxHeight = 15;

        // Rotation
        this.azimuthAngle = 0;
        this.polarAngle = Math.PI / 6;
        this.minPolarAngle = 0.1;
        this.maxPolarAngle = Math.PI / 2.5;

        // Smoothing
        this.smoothness = 0.1;
        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();

        // Mouse sensitivity
        this.rotateSpeed = 0.003;
        this.zoomSpeed = 0.5;

        this.init();
    }

    init() {
        // Mouse wheel for zoom
        this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));

        // Mouse move for camera rotation
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Store mouse movement
        this.mouseMovementX = 0;
        this.mouseMovementY = 0;

        // Initial position
        this.updateCameraPosition();
        this.currentPosition.copy(this.camera.position);
        this.currentLookAt.copy(this.target.position);
    }

    onMouseWheel(event) {
        event.preventDefault();

        const delta = event.deltaY * 0.001 * this.zoomSpeed;
        this.distance = THREE.MathUtils.clamp(
            this.distance + delta,
            this.minDistance,
            this.maxDistance
        );
    }

    onMouseMove(event) {
        if (document.pointerLockElement === document.body) {
            this.mouseMovementX = event.movementX || 0;
            this.mouseMovementY = event.movementY || 0;
        }
    }

    update(delta) {
        // Apply stored mouse movement
        if (this.mouseMovementX !== 0 || this.mouseMovementY !== 0) {
            this.azimuthAngle -= this.mouseMovementX * this.rotateSpeed;
            this.polarAngle += this.mouseMovementY * this.rotateSpeed;

            this.polarAngle = THREE.MathUtils.clamp(
                this.polarAngle,
                this.minPolarAngle,
                this.maxPolarAngle
            );

            // Reset movement
            this.mouseMovementX = 0;
            this.mouseMovementY = 0;
        }

        // Update camera position
        this.updateCameraPosition();

        // Smooth camera movement
        this.currentPosition.lerp(this.camera.position, this.smoothness);
        this.currentLookAt.lerp(this.getTargetLookAt(), this.smoothness);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentLookAt);
    }

    updateCameraPosition() {
        const targetPosition = this.getTargetLookAt();

        // Calculate camera position based on angles
        const x = this.distance * Math.sin(this.polarAngle) * Math.cos(this.azimuthAngle);
        const y = this.distance * Math.cos(this.polarAngle);
        const z = this.distance * Math.sin(this.polarAngle) * Math.sin(this.azimuthAngle);

        this.camera.position.set(
            targetPosition.x + x,
            targetPosition.y + y,
            targetPosition.z + z
        );
    }

    getTargetLookAt() {
        // Look at a point slightly above the target
        return new THREE.Vector3(
            this.target.position.x,
            this.target.position.y + 1,
            this.target.position.z
        );
    }

    onResize() {
        // Handle window resize if needed
    }
}
