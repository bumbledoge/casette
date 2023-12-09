import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const axesHelper = new THREE.AxesHelper(20);
const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
scene.add(axesHelper);
const camera = new THREE.PerspectiveCamera(
  75,
  marimi.width / marimi.height,
  0.1,
  100
);
camera.position.y = 6.5;
camera.lookAt(0, 0, 0);
camera.position.set(5, 6.5, 4);

scene.add(camera);

/**
 * Objects
 */
const buttonWidth = 1.5;

const button = new THREE.Mesh(
  new THREE.BoxGeometry(buttonWidth, 1, 0.5),
  new THREE.MeshStandardMaterial({ color: "white" })
);

const buttons = [];
for (let i = 0; i <= 8; i++) {
  const button1 = button.clone();

  button1.position.x += (buttonWidth + 0.05) * i;
  buttons.push(button1);
  scene.add(button1);
}

/**
 * Lights
 */
const light1 = new THREE.PointLight("white", 80);
light1.position.y = 5;
light1.position.z = 5;
light1.position.x = 2;
scene.add(light1);
const light2 = new THREE.AmbientLight("white", 0.5);
light2.position.y = -10;
light2.position.z = -10;
scene.add(light2);

/**
 * Renders and animation
 */

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(marimi.width, marimi.height);
renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

const tick = () => {
  // console.log(camera.position);
  // console.log(camera.rotation);

  // controls.update();
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();
