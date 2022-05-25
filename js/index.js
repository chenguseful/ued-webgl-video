import * as THREE from '../plugins/Three/build/three.module.js';
import {
    VRButton
} from '../plugins/Three/module/jsm/webxr/VRButton.js';
var camera, scene, renderer;
init();
animate();

function init() {
    var container = document.getElementById('container');
    container.addEventListener('click', function () {
        video.play();
    });
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.layers.enable(1);
    var video = document.getElementById('video');
    video.play();
    var texture = new THREE.Texture(video);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.format = THREE.RGBFormat;
    setInterval(function () {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            texture.needsUpdate = true;
        }
    }, 1000 / 24);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);
    var geometry = new THREE.SphereBufferGeometry(5000, 60, 40);
    geometry.scale(-1, 1, 1);
    var uvs = geometry.attributes.uv.array;
    for (var i = 0; i < uvs.length; i += 2) {
        uvs[i] *= 0.5;
    }
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = -Math.PI / 2;
    mesh.layers.set(1);
    scene.add(mesh);
    var geometry = new THREE.SphereBufferGeometry(5000, 60, 40);
    geometry.scale(-1, 1, 1);
    var uvs = geometry.attributes.uv.array;
    for (var i = 0; i < uvs.length; i += 2) {
        uvs[i] *= 0.5;
        uvs[i] += 0.5;
    }
    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = -Math.PI / 2;
    mesh.layers.set(2);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    container.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
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