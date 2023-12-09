import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const raycaster = new THREE.Raycaster();
let currentIntersect = null,
  previousIntersect = null,
  thirdTry = null,
  pressedButton = null;

const axesHelper = new THREE.AxesHelper(20);
const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
// scene.add(axesHelper);
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
for (let i = 0; i < 8; i++) {
  const button1 = button.clone();
  const clonedMaterial = new THREE.MeshStandardMaterial({ color: "white" });
  button1.material = clonedMaterial;

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
window.addEventListener("resize", () => {
  // Update sizes
  marimi.width = window.innerWidth;
  marimi.height = window.innerHeight;

  // Update camera
  camera.aspect = marimi.width / marimi.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(marimi.width, marimi.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / marimi.width) * 2 - 1;
  mouse.y = -(event.clientY / marimi.height) * 2 + 1;

  // console.log(mouse);
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(marimi.width, marimi.height);
renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

window.addEventListener("click", () => {
  if (currentIntersect) {
    gsap.to(currentIntersect.object.position, {
      duration: 0.5,
      y: -0.5,
      ease: "elastic.out(1.5,1)",
    });
    pressedButton &&
      gsap.to(pressedButton.object.position, {
        duration: 0.5,
        y: 0,
        ease: "elastic.out(1.5,1)",
      });
    pressedButton = currentIntersect;
  }
});

const tick = () => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(buttons);

  if (intersects.length) {
    thirdTry = currentIntersect;
    currentIntersect = intersects[0];
  } else {
    currentIntersect = null;
  }

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();
