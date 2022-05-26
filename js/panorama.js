import * as THREE from '../plugins/Three/build/three.module.js';
import {
    VRButton
} from '../plugins/Three/module/jsm/webxr/VRButton.js';

var camera;
var renderer;
var scene;

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    document.body.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    //

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.layers.enable(1);

    var video = document.getElementById('video');
    video.play();

    var geometryL = new THREE.SphereBufferGeometry(50, 50, 50);
    geometryL.scale(-1, 1, 1);

    var textureL = new THREE.VideoTexture(video);
    var materialL = new THREE.MeshBasicMaterial({
        map: textureL
    });

    var skyBoxL = new THREE.Mesh(geometryL, materialL);
    skyBoxL.layers.set(1);
    scene.add(skyBoxL);

    var geometryR = new THREE.SphereBufferGeometry(50, 50, 50);
    geometryR.scale(-1, 1, 1);

    var textureR = new THREE.VideoTexture(video);
    var materialR = new THREE.MeshBasicMaterial({
        map: textureR
    });

    var skyBoxR = new THREE.Mesh(geometryR, materialR);
    skyBoxR.layers.set(2);
    scene.add(skyBoxR);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    renderer.setAnimationLoop(render);

}

function render() {

    renderer.render(scene, camera);

}