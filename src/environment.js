import * as THREE from 'three';

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
        this.trees = [];
        this.cabin = null;
        this.lake = null;
        this.mountains = [];
        this.porridgeBowls = [];
        this.iceArea = { center: new THREE.Vector3(30, 0, 30), radius: 15 };
    }

    async create() {
        this.createTerrain();
        this.createLake();
        this.createTrees();
        this.createCabin();
        this.createMountains();
        this.createPorridgeBowls();
        this.createDecorations();
    }

    createTerrain() {
        // Create large snow-covered ground
        const groundSize = 200;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 50, 50);

        // Add some gentle waves to the terrain
        const positions = groundGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getY(i);
            const wave = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 1.5;
            positions.setZ(i, wave);
        }
        groundGeometry.computeVertexNormals();

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8,
            metalness: 0.1,
        });

        this.terrain = new THREE.Mesh(groundGeometry, groundMaterial);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.receiveShadow = true;
        this.scene.add(this.terrain);
    }

    createLake() {
        // Create frozen lake surface
        const lakeGeometry = new THREE.CircleGeometry(this.iceArea.radius, 32);
        const lakeMaterial = new THREE.MeshStandardMaterial({
            color: 0xc8e6f5,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.9,
        });

        this.lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
        this.lake.rotation.x = -Math.PI / 2;
        this.lake.position.set(this.iceArea.center.x, 0.1, this.iceArea.center.z);
        this.lake.receiveShadow = true;
        this.scene.add(this.lake);

        // Add ice edge
        const edgeGeometry = new THREE.TorusGeometry(this.iceArea.radius, 0.3, 8, 32);
        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0xe0f2f7,
            roughness: 0.6,
        });
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.rotation.x = Math.PI / 2;
        edge.position.set(this.iceArea.center.x, 0.05, this.iceArea.center.z);
        this.scene.add(edge);
    }

    createTrees() {
        const treePositions = [
            { x: -20, z: -20 },
            { x: -15, z: -30 },
            { x: -25, z: -15 },
            { x: 15, z: -25 },
            { x: 20, z: -18 },
            { x: -30, z: 10 },
            { x: -25, z: 20 },
            { x: 50, z: 10 },
            { x: 45, z: 20 },
            { x: 50, z: -10 },
            { x: 10, z: 50 },
            { x: 20, z: 55 },
            { x: -10, z: 45 },
        ];

        treePositions.forEach(pos => {
            const tree = this.createPineTree();
            tree.position.set(pos.x, 0, pos.z);
            this.trees.push(tree);
            this.scene.add(tree);
        });
    }

    createPineTree() {
        const treeGroup = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a3728,
            roughness: 0.9,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Foliage (3 cone layers)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d5016,
            roughness: 0.8,
        });

        for (let i = 0; i < 3; i++) {
            const size = 3 - i * 0.6;
            const foliageGeometry = new THREE.ConeGeometry(size, size * 1.2, 8);
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.y = 3 + i * 1.8;
            foliage.castShadow = true;
            treeGroup.add(foliage);

            // Add snow on top
            const snowGeometry = new THREE.ConeGeometry(size * 0.9, size * 0.3, 8);
            const snowMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.9,
            });
            const snow = new THREE.Mesh(snowGeometry, snowMaterial);
            snow.position.y = 3 + i * 1.8 + size * 0.6;
            treeGroup.add(snow);
        }

        return treeGroup;
    }

    createCabin() {
        const cabinGroup = new THREE.Group();

        // Main cabin body
        const cabinGeometry = new THREE.BoxGeometry(6, 4, 5);
        const cabinMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.9,
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.y = 2;
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        cabinGroup.add(cabin);

        // Roof
        const roofGeometry = new THREE.ConeGeometry(4.5, 2.5, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8,
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 5.25;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        cabinGroup.add(roof);

        // Snow on roof
        const snowRoofGeometry = new THREE.ConeGeometry(4.6, 0.5, 4);
        const snowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
        });
        const snowRoof = new THREE.Mesh(snowRoofGeometry, snowMaterial);
        snowRoof.position.y = 6.5;
        snowRoof.rotation.y = Math.PI / 4;
        cabinGroup.add(snowRoof);

        // Door
        const doorGeometry = new THREE.BoxGeometry(1.2, 2.2, 0.2);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d2817,
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.1, 2.6);
        cabinGroup.add(door);

        // Windows
        const windowGeometry = new THREE.BoxGeometry(1, 1, 0.2);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffeb9c,
            emissive: 0xffeb9c,
            emissiveIntensity: 0.3,
        });

        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-2, 2.5, 2.6);
        cabinGroup.add(window1);

        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(2, 2.5, 2.6);
        cabinGroup.add(window2);

        // Chimney
        const chimneyGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const chimneyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b0000,
            roughness: 0.7,
        });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(2, 6, 0);
        chimney.castShadow = true;
        cabinGroup.add(chimney);

        // Smoke particles (simple)
        const smokeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const smokeMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.4,
        });
        for (let i = 0; i < 3; i++) {
            const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
            smoke.position.set(2 + Math.random() * 0.5 - 0.25, 7 + i * 0.8, Math.random() * 0.5 - 0.25);
            cabinGroup.add(smoke);
        }

        cabinGroup.position.set(-15, 0, 5);
        this.cabin = cabinGroup;
        this.scene.add(cabinGroup);
    }

    createMountains() {
        // Create distant mountains
        const mountainPositions = [
            { x: -80, z: -60, scale: 1.2 },
            { x: -50, z: -70, scale: 1 },
            { x: -20, z: -65, scale: 0.9 },
            { x: 20, z: -68, scale: 1.1 },
            { x: 60, z: -65, scale: 1 },
            { x: 90, z: -60, scale: 1.3 },
        ];

        mountainPositions.forEach(pos => {
            const mountain = this.createMountain();
            mountain.position.set(pos.x, 0, pos.z);
            mountain.scale.set(pos.scale, pos.scale, pos.scale);
            this.mountains.push(mountain);
            this.scene.add(mountain);
        });
    }

    createMountain() {
        const geometry = new THREE.ConeGeometry(15, 30, 6);
        const material = new THREE.MeshStandardMaterial({
            color: 0xe6e6e6,
            roughness: 0.9,
            flatShading: true,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.y = 15;
        mountain.castShadow = true;

        // Add snow cap
        const capGeometry = new THREE.ConeGeometry(12, 10, 6);
        const capMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.9,
        });
        const cap = new THREE.Mesh(capGeometry, capMaterial);
        cap.position.y = 20;
        mountain.add(cap);

        return mountain;
    }

    createPorridgeBowls() {
        const bowlPositions = [
            { x: -12, z: 8 },   // Near cabin
            { x: 25, z: 18 },   // Near lake
            { x: 5, z: -10 },   // Random location
        ];

        bowlPositions.forEach(pos => {
            const bowl = this.createPorridgeBowl();
            bowl.position.set(pos.x, 0.5, pos.z);
            this.porridgeBowls.push(bowl);
            this.scene.add(bowl);
        });
    }

    createPorridgeBowl() {
        const bowlGroup = new THREE.Group();

        // Small table
        const tableGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.8, 8);
        const tableMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.8,
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = 0.4;
        table.castShadow = true;
        bowlGroup.add(table);

        // Bowl
        const bowlGeometry = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const bowlMaterial = new THREE.MeshStandardMaterial({
            color: 0xd2691e,
            roughness: 0.6,
        });
        const bowl = new THREE.Mesh(bowlGeometry, bowlMaterial);
        bowl.position.y = 0.8;
        bowl.castShadow = true;
        bowlGroup.add(bowl);

        // Porridge inside
        const porridgeGeometry = new THREE.CircleGeometry(0.35, 16);
        const porridgeMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5deb3,
            roughness: 0.9,
        });
        const porridge = new THREE.Mesh(porridgeGeometry, porridgeMaterial);
        porridge.rotation.x = -Math.PI / 2;
        porridge.position.y = 0.85;
        bowlGroup.add(porridge);

        // Steam effect (simple)
        const steamGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const steamMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
        });
        for (let i = 0; i < 3; i++) {
            const steam = new THREE.Mesh(steamGeometry, steamMaterial);
            steam.position.set(Math.random() * 0.2 - 0.1, 1 + i * 0.2, Math.random() * 0.2 - 0.1);
            bowlGroup.add(steam);
        }

        return bowlGroup;
    }

    createDecorations() {
        // Add some rocks
        const rockPositions = [
            { x: 10, z: 15 },
            { x: -5, z: -5 },
            { x: 40, z: 5 },
        ];

        rockPositions.forEach(pos => {
            const rock = this.createRock();
            rock.position.set(pos.x, 0.5, pos.z);
            this.scene.add(rock);
        });
    }

    createRock() {
        const geometry = new THREE.DodecahedronGeometry(1, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.9,
            flatShading: true,
        });
        const rock = new THREE.Mesh(geometry, material);
        rock.castShadow = true;
        rock.receiveShadow = true;

        // Random rotation and scale
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.scale.set(
            0.5 + Math.random() * 0.5,
            0.5 + Math.random() * 0.5,
            0.5 + Math.random() * 0.5
        );

        return rock;
    }

    isOnIce(position) {
        const distance = Math.sqrt(
            Math.pow(position.x - this.iceArea.center.x, 2) +
            Math.pow(position.z - this.iceArea.center.z, 2)
        );
        return distance < this.iceArea.radius;
    }
}
