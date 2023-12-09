import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI();
const raycaster = new THREE.Raycaster();
let currentIntersect = null,
  pressedButton = null;

const marimi = {
  width: window.innerWidth,
  height: window.innerHeight,
  cameraPerspective: 32,
  aspectRatio: window.innerWidth / window.innerHeight,
  viewSize: 10,
};
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  (-marimi.aspectRatio * marimi.viewSize) / 2,
  (marimi.aspectRatio * marimi.viewSize) / 2,
  marimi.viewSize / 2,
  -marimi.viewSize / 2,
  0.1,
  100
);
camera.position.set(6.8, 6.3, 5.5);
camera.rotation.set(4.9, 6.5, 0);

// camera.lookAt(camera.position.x, 0, 0);
gui.add(camera.rotation, "x", -12, 12, 0.001);
gui.add(camera.rotation, "y", -12, 12, 0.001);
gui.add(camera.rotation, "z", -1, 1, 0.0001);

gui.add(camera.position, "x", -12, 12, 0.001);
gui.add(camera.position, "y", -12, 12, 0.001);
gui.add(camera.position, "z", -12, 12, 0.001);

console.log(scene.rotation);
// camera.rotation.y = Math.PI / 20;
// camera.position.z = 8;
// camera.position.x = 8;

scene.add(camera);

/**
 * Objects
 */
// masa
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(32, 16),
  new THREE.MeshStandardMaterial({ color: "blue" })
);
plane.position.set(5, -0.4, 2);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// post
const buttonWidth = 1.5;
const post = new THREE.Mesh(
  new THREE.BoxGeometry(buttonWidth * 4, 1, 6),
  new THREE.MeshStandardMaterial({ color: "white" })
);
post.position.set(2.25, -0.5, 4);
scene.add(post);

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
// buttons[0].rotation.z = Math.PI / 8;

/**
 * Lights
 */
const light1 = new THREE.PointLight("white", 100);
light1.position.y = 10;
light1.position.z = 0;
light1.position.x = 5;
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

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
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
        duration: 0.4,
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
    currentIntersect = intersects[0];
  } else {
    currentIntersect = null;
  }

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();
