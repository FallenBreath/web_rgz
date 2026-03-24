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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 50;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    loader.load(
        modelUrl,
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);

            centerModel(model, camera);
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
}

function centerModel(model, camera) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    cameraZ *= 1.8;
    camera.position.set(0, 0, cameraZ);

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
}

document.querySelectorAll('[id^="model-container-"]').forEach(container => {
    initViewer(container);
});