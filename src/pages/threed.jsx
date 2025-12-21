import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { DragControls } from 'three/addons/controls/DragControls.js';

const ThreeD = ({ 
    width = '100%', 
    height = '1000px' 
}) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

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
        camera.position.z = 5;

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

        // Add a simple cube to the scene
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Create drag controls for the cube
        const objects = [cube];
        const dragControls = new DragControls(objects, camera, renderer.domElement);
        const rotationSensitivity = 2; // The higher the faster the rotation
        // Store original Y position
        let originalY;
        let originalX;

        // Raycasting function
        function getIntersection() {
            // Raycast from camera through mouse position
            raycaster.setFromCamera(mouse, camera);
            let intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersection);
            return intersection ? new THREE.Vector3(intersection.x, originalY, intersection.z) : null;
        }
        
        // Update mouse position on mousemove
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Update mouse position on mousemove
        window.addEventListener('mousedown', (event) => {
            isRightClick = event.button == 2;
        });

        window.addEventListener('mouseup', () => {
            isRightClick = false;
        });

        // Restrict movement to X and Z plane
        dragControls.addEventListener('dragstart', (event) => {
            orbitControls.enabled = false;
            originalY = event.object.position.y;
        });

        dragControls.addEventListener('drag', (event) => {
            if (!event.object) return;

            if (isRightClick) {
                if (originalX === undefined) {
                    originalX = mouse.x;
                    return;
                }
                // event.object.rotation.y += event.object.userData.lastMouseX - mouse.x
                event.object.rotation.set(0, event.object.rotation.y + (mouse.x - originalX)*rotationSensitivity, 0);
                originalX = mouse.x;
                return;
            }

            const intersection = getIntersection();
            if (intersection) {
                event.object.position.copy(intersection);
            }
        });

        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });

        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

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
            dragControls.dispose();
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            scene.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width, height }} />;
};

export default ThreeD;
