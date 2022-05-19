import * as THREE from "https://unpkg.com/three@0.120.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls";

let container, scene, camera, renderer, card, controls;

var dispTexture, materialFront, materialBack, mesh;

// Used to determine shape geometry and special loading requirements for animated gifs. Values should be "Sticker", "Card", or "AnimatedSticker".
var assetType = "AnimatedSticker"; 

// Used for Cards and Stickets, not used for Animated Stickers
var assetFrontURL = 'CardFront.jpg'; // Assign this from Product object
var assetBackURL = 'CardBack.jpg'; // Assign this from Product object

var geometryX;
var geometryY;
var geometryZ;

// Determine needed shape geometry
if (assetType == "Card") {
    geometryX = 2;
    geometryY = 3;
    geometryZ = 0;
} else if (assetType == "Sticker") {
    geometryX = 2;
    geometryY = 2;
    geometryZ = 0;
} else if (assetType == "AnimatedSticker") {
    geometryX = 2;
    geometryY = 2;
    geometryZ = 0;
} else {
    geometryX = 2;
    geometryY = 2;
    geometryZ = 2;
}

init();
animate();

function init(){
    var supGif, gifCanvas;

    if (assetType == "Card" || assetType == "Sticker") {
        container = document.getElementById("card");
    } else if (assetType == "AnimatedSticker") {
        // Get Canvas
        supGif = new SuperGif({ gif: document.getElementById('animgif') });
        supGif.load();
        gifCanvas = supGif.get_canvas();
    }

    // Create Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create Scene
    scene = new THREE.Scene();

    // Add Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
  
    if (assetType == "Card" || assetType == "Sticker") {
        const loader = new THREE.TextureLoader();

        // Create front material
        materialFront = new THREE.MeshStandardMaterial();
        materialFront.map = loader.load(assetFrontURL);
        materialFront.transparent = true;

        // Create back material
        materialBack = new THREE.MeshStandardMaterial();
        materialBack.map = loader.load(assetBackURL);
        materialBack.transparent = true;

    } else if (assetType == "AnimatedSticker") {
        // Create Texture from gif canvas
        dispTexture = new THREE.Texture(gifCanvas); 

        // create front material from gif canvas
        materialFront = new THREE.MeshStandardMaterial();
        materialFront.map = new THREE.Texture(gifCanvas);
        materialFront.displacementMap = materialFront.map;
        materialFront.transparent = true;

        // create back material from front material
        materialBack = new THREE.MeshStandardMaterial();
        materialBack = materialFront;
    }

    // Create Geometry
    const geometry = new THREE.BoxGeometry(geometryX, geometryY, geometryZ);
    
    // Create Materials Array for box
    const materials = [
        , // Left
        , // Right
        , // Top
        , // Bottom
        materialFront, // Front
        materialBack, // Back
    ];

    // Create mesh
    mesh = new THREE.Mesh(
        geometry, 
        materials );
    scene.add(mesh);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setup OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.update();
  
    window.addEventListener('resize', onWindowResize, false);
}

function animate(){
    if (assetType == "AnimatedSticker") {
        materialFront.map.needsUpdate = true;
        materialFront.displacementScale = 200;
        materialFront.displacementMap.needsUpdate = true;

        materialBack.map.needsUpdate = true;
        materialBack.displacementScale = 200;
        materialBack.displacementMap.needsUpdate = true;
    }

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

