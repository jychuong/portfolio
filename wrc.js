// Import three.js core
import * as THREE from "./build/three.module.js";

// Import add-ons for glTF models, orbit controls, and font loader
import {
  OrbitControls
} from "./src/OrbitControls.js";
import {
  GLTFLoader
} from "./src/GLTFLoader.js";

let container, scene, camera, renderer, mesh, mixer, controls, clock;


let ticker = 0;

// Call init and animate functions (defined below)
init();
animate();

function init() {

  //Identify div in HTML to place scene
  container = document.getElementById("space3");

  //Crate clock for animation
  clock = new THREE.Clock();

  //Create scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,1500
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFFFFF);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add scene to gltf.html
  container.appendChild(renderer.domElement);

  // Material to be added to preanimated model
  var newMaterial = new THREE.MeshStandardMaterial({
    color: 0x2E5939
  });

  // Load preanimated model, add material, and add it to the scene
  const loader = new GLTFLoader().load(
    "./3js/wrc.glb",
    function(gltf) {
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          // child.material = newMaterial;
          //makes colors more like the blender model
          renderer.outputEncoding = THREE.sRGBEncoding;
        }
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.set(.2, -0.3, 0.1);
      mesh.rotation.set(0, 0.8, 0);
      mesh.scale.set(1.5, 1.5, 1.5);
      // Add model to scene
      scene.add(mesh);
      //Check for and play animation frames
      mixer = new THREE.AnimationMixer(mesh);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );



  // Add Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2;
  controls.maxDistance = 5;
  controls.target.set(0, 0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = .5;
  // these controll how we orbit the model
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;



  // Position our camera so we can see the shape
  camera.position.z = 0;
  camera.position.x = 1;
  camera.position.y = 0;

  // Add a directional light to the scene
  const light = new THREE.DirectionalLight( 0xDFD6FF, 0.5 );
  light.position.set( 0, 10, 10 );
  light.castShadow = true;
  scene.add( light );

  // Add a directional light to the scene
  const light3 = new THREE.DirectionalLight( 0xDFD6FF, 0.5 );
  light.position.set( -5, -5, -5 );
  light.castShadow = true;
  scene.add( light3 );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  const light2 = new THREE.DirectionalLight( 0xDFD6FF, 0.3, 100 );
  light2.position.set( 5, 2, 10 );
  light2.castShadow = true;
  scene.add( light2 );


  // Add an ambient light to the scene
  const ambientLight = new THREE.AmbientLight(0xAEADFF, 0.6);
  scene.add(ambientLight);

}

// Respond to Window Resizing
window.addEventListener("resize", onWindowResize);

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 1, window.innerHeight / 1);
  render();
}

// Define animate loop
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  render();
}

// Define the render loop
function render() {
  renderer.render(scene, camera);
  manualAnimation();
}
