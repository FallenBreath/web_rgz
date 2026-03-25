import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


function initViewer(container) {
    const modelUrl = container.dataset.url;
    if (!modelUrl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 50;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(3, 4, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const loader = new GLTFLoader();

    loader.load(
        modelUrl,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            centerModel(model, camera, controls);
            animate();
        },
        undefined,
        function (error) {
            console.error('Ошибка загрузки модели:', error);
            container.innerHTML = '<p style="color:red; font-size:14px;">Ошибка загрузки модели</p>';
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function centerModel(model, camera, controls) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z);

    const fov = camera.fov * (Math.PI / 180);
    let cameraDistance = (maxDim / 2) / Math.tan(fov / 2);

    cameraDistance *= 1.6;

    camera.near = Math.max(maxDim / 100, 0.01);
    camera.far = maxDim * 100;
    camera.updateProjectionMatrix();

    camera.position.set(
        maxDim * 0.4,
        maxDim * 0.3,
        cameraDistance
    );

    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.minDistance = maxDim * 0.3;
    controls.maxDistance = maxDim * 10;
    controls.update();
}

document.querySelectorAll('.card-preview, .detail-viewer').forEach(container => {
    const button = container.querySelector('.preview-button');

    if (button) {
        button.addEventListener('click', () => {
            initViewer(container);
        });
    }
});