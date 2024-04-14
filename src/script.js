import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
gui.add(ambientLight, "intensity", 0, 5, 1).name("AmbientLight"); //Lights every part of the scene

const directionLight = new THREE.DirectionalLight(0x00fffc, 0); //All the rays are coming towards the center
scene.add(directionLight);
gui.add(directionLight, "intensity", 0, 5, 1).name("DirectionalLight");

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x00fffc, 0); //red blue intensity
//it comes like ambient light that is comes from everywhere
scene.add(hemisphereLight);
gui.add(hemisphereLight, "intensity", 0, 5, 1).name("HemisphereLight");

//Infinitely small point illuminating in every direction
const pointLight = new THREE.PointLight(0xffffff, 0, 10, 2);
//by default light intensity does't fade on objects
//we can control the fade distance and how fast it fades with distance and decay property on light
pointLight.position.x = 4;
pointLight.position.y = 0;
pointLight.position.z = 0;
scene.add(pointLight);
gui.add(pointLight, "intensity", 0, 25, 1).name("PointLight");

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 0, 10, 10); //intensity , width and height
scene.add(rectAreaLight);
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
gui.add(rectAreaLight, "intensity", 0, 20, 2).name("RectAreaLight");

const spotLight = new THREE.SpotLight(0x78ff00, 0, 10, Math.PI * 0.1, 0.25, 1); //color, intensity, distance, angle, penumbra(blur at side), decay
scene.add(spotLight);
gui.add(spotLight, "intensity", 0, 100, 1).name("SpotLight");

//Minimal stress = Ambient Light, Hemisphere Light
//Moderate stress = Directional Light, Point Light
//High stress = Spot Light, Rect Area Light

//Bake the light into the texture This can be done in the 3D software
//Drawback we can move light anymore and we have to load huge textures

//Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);
gui.add(hemisphereLightHelper, "visible").name("Hemisphere Light Helper");

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionLight,
  0.2
);
scene.add(directionalLightHelper);
gui.add(directionalLightHelper, "visible").name("directionalLightHelper");

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);
gui.add(pointLightHelper, "visible").name("pointLightHelper");

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});
gui.add(spotLightHelper, "visible").name("spotLightHelper");

const rectAreaLightHelper = new THREE.RectAreaLight(rectAreaLight);
scene.add(rectAreaLightHelper);
gui.add(rectAreaLightHelper, "visible").name("RectArea Light Helper");

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
//Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

//Cube
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

//torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

//Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
