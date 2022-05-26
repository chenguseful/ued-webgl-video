import * as THREE from '../plugins/Three/build/three.module.js';
import {
    VRButton
} from '../plugins/Three/module/jsm/webxr/VRButton.js';

var camera, scene, renderer;

var isUserInteracting = false,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    distance = 50,
    onPointerDownPointerX = 0,
    onPointerDownPointerY = 0,
    onPointerDownLon = 0,
    onPointerDownLat = 0;

init();
animate();

function init() {

    var container, mesh;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    var video = document.getElementById('video');
    video.play();

    var texture = new THREE.VideoTexture(video);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

    if (isUserInteracting === true) {

        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (onPointerDownPointerY - event.clientY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentMouseUp() {

    isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

    distance += event.deltaY * 0.05;

    distance = THREE.MathUtils.clamp(distance, 1, 50);

}

function animate() {

    requestAnimationFrame(animate);
    update();

}

function update() {

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
    camera.position.y = distance * Math.cos(phi);
    camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);

}