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
    camera.layers.enable( 1 );

    scene = new THREE.Scene();

    var geometry = new THREE.SphereBufferGeometry(500, 50, 50);
    geometry.scale(-1, 1, 1);

    var video = document.getElementById('video');
    video.play();

    var texture = new THREE.VideoTexture(video);
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.layers.enable( 1 );

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType( 'local' );
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

    renderer.render(scene, camera);

}