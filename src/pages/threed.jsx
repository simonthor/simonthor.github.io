import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeD = ({ 
    width = '100%', 
    height = '1000px' 
}) => {
    const mountRef = useRef(null);
    const [models, setModels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!mountRef.current) return

        const loader = new GLTFLoader();
        const modelPromises = [];

        const promise1 = new Promise((resolve) => {
            loader.load( '/3dmodels/stick/stick2.glb', ( gltf ) => {
                const root = gltf.scene;
                root.updateMatrixWorld();
                root.position.set(1, 1, 0); // Adjust as needed
                root.rotation.set(0, 0, 0); // Reset rotation
                resolve(root);
            },
            undefined, // No progress callback
            (error) => {
                console.error('Error loading glTF model:', error);
                resolve(null);
            });
        });
        modelPromises.push(promise1);
        
        const promise2 = new Promise((resolve) => {
            loader.load( '/3dmodels/stick/stick1.glb', ( gltf ) => {
                const root = gltf.scene;
                root.updateMatrixWorld();
                root.position.set(-1, 1, 0); // Adjust as needed
                root.rotation.set(0, 0, 0); // Reset rotation
                resolve(root);
            },
            undefined, // No progress callback
            (error) => {
                console.error('Error loading glTF model:', error);
                resolve(null);
            });
        });
        modelPromises.push(promise2);

        const promise3 = new Promise((resolve) => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(0, 0.5, 0); // Adjust as needed
            resolve(cube);
        });
        modelPromises.push(promise3);

        Promise.all(modelPromises).then((loadedModels) => {
            const validModels = loadedModels.filter(model => model !== null);
            setModels(validModels);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!mountRef.current || isLoading || models.length === 0) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const mouse = new THREE.Vector2();

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75, 
            mountRef.current.clientWidth / mountRef.current.clientHeight, 
            0.1, 
            1000
        );
        camera.position.set(3, 3, 3);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        let isRightClick = false; // Right mouse button

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        models.forEach(model => scene.add(model));  // <-- Add loaded models to scene

        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
        
        // Show the 3 axes using arrows with labels x, y, z
        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        // Create drag controls for the objects
        const dragControls = new DragControls(models, camera, renderer.domElement);
        const rotationSensitivity = 10; // The higher the faster the rotation
        let originalY;
        let originalX;
        let dragOffset = new THREE.Vector3();

        // Raycasting function
        const getIntersection = () => {
            raycaster.setFromCamera(mouse, camera);
            let intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersection);
            return intersection ? new THREE.Vector3(intersection.x, originalY, intersection.z) : null;
        };

        // Update mouse position on mousemove
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Track right-click
        window.addEventListener('mousedown', (event) => {
            isRightClick = event.button === 2;
        });

        window.addEventListener('mouseup', () => {
            isRightClick = false;
            originalX = undefined;
            originalY = undefined;
        });

        // Restrict movement to X and Z plane
        dragControls.addEventListener('dragstart', (event) => {
            orbitControls.enabled = false;
            originalY = event.object.position.y;
            if (isRightClick) {
                originalX = mouse.x;
                return;
            }
            // Calculate the offset
            const intersection = getIntersection();
            if (intersection) {
                dragOffset.copy(intersection).sub(event.object.position);
            }
        });


        // Rotate an object around an arbitrary axis in world space       
        const rotateAroundWorldAxis = (object, axis, radians) => {
            const rotWorldMatrix = new THREE.Matrix4();
            rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
            
            // pre-multiply
            rotWorldMatrix.multiply(object.matrix); 

            object.matrix = rotWorldMatrix;

            object.rotation.setFromRotationMatrix(object.matrix);
        }

        dragControls.addEventListener('drag', (event) => {
            if (!event.object) return;

            if (isRightClick) {
                if (originalX === undefined) {
                    originalX = mouse.x;
                    return;
                }
                
                rotateAroundWorldAxis(event.object, new THREE.Vector3(0, 1, 0), (mouse.x - originalX)*rotationSensitivity);

                originalX = mouse.x;
                return;
            }

            const intersection = getIntersection();
            if (intersection) {
                event.object.position.copy(intersection).sub(dragOffset);
            }
        });

        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
            dragOffset.set(0, 0, 0);
        });

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            orbitControls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            if (!mountRef.current) return;
            
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', () => {});
            window.removeEventListener('mouseup', () => {});
            if (dragControls) dragControls.dispose();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            // Dispose of GPU resources
            scene.traverse((object) => {
                if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                    } else {
                    object.material.dispose();//
                    }
                }
                }
            });
        };

    }, [isLoading, models]);

    return <div ref={mountRef} style={{ width, height }} />;
};

export default ThreeD;
