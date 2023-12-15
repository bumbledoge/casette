import * as THREE from "three";
import gsap from "gsap";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const gui = new GUI();
const raycaster = new THREE.Raycaster();
let currentIntersect = null,
  pressedButtonNr = null,
  currentIntersectNr = null;

const marimi = {
  width: 1500,
  height: 1100,
  cameraPerspective: 1500 / 1100,
  aspectRatio: 1500 / 1100,
  viewSize: 10,
};
console.log(marimi.width, marimi.height);
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
// gui.add(camera.rotation, "x", -12, 12, 0.001);
// gui.add(camera.rotation, "y", -12, 12, 0.001);
// gui.add(camera.rotation, "z", -1, 1, 0.0001);

// gui.add(camera.position, "x", -12, 12, 0.001);
// gui.add(camera.position, "y", -12, 12, 0.001);
gui.add(camera.position, "z", 5.5, 30, 0.001).name("scroll");

// console.log(scene.rotation);
// camera.rotation.y = Math.PI / 20;
// camera.position.z = 8;
// camera.position.x = 8;

scene.add(camera);

/**
 * Objects
 */
// masa
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(32, 32),
  new THREE.MeshStandardMaterial({ color: "blue" })
);
plane.position.set(5, -0.4, 2);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// post
const buttonWidth = 1.5;

const textureLoader = new THREE.TextureLoader();
let shadowTexture = textureLoader.load("/textures/simpleShadow.jpg");
shadowTexture.colorSpace = THREE.SRGBColorSpace;
console.log(shadowTexture);

const post = new THREE.Mesh(
  new THREE.BoxGeometry(buttonWidth * 4, 1, 6),
  new THREE.MeshStandardMaterial({
    color: "white",
  })
);
const post2 = post.clone();
const post3 = post.clone();
const post4 = post.clone();
post.position.set(2.25, -0.5, 4);
post2.position.set(9, -0.5, 4);
post3.position.set(2.25, -0.5, 11);
post4.position.set(9, -0.5, 11);
// post.receiveShadow = true;
// post2.receiveShadow = true;
// post3.receiveShadow = true;
// post4.receiveShadow = true;

scene.add(post, post2);

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

let vespa = undefined;
loader.load("/vespa.glb", (gltf) => {
  vespa = gltf.scene;
  vespa.position.set(...post.position);
  vespa.scale.setScalar(2);
  vespa.position.y += 1;
  vespa.position.z += 1;
  vespa.position.x -= 1;
  vespa.rotation.z = 0;
  vespa.rotation.y = -2.1;
  vespa.rotation.x = -1;
  vespa.castShadow = true;
  scene.add(vespa);
});

/**
 * Lights
 */
const light1 = new THREE.PointLight("white", 20);
light1.position.y = 5;
light1.position.z = 5;
light1.position.x = 10;
scene.add(light1);

const light2 = new THREE.AmbientLight("white", 1);
light2.position.y = -10;
light2.position.z = -10;
// scene.add(light2);

const light3 = new THREE.PointLight("white", 200);
light3.position.y = 7.7;
light3.position.z = 5;
light3.position.x = 4;
light3.castShadow = true;
scene.add(light3);

gui.add(light3.position, "x", -10, 10, 0.001);
gui.add(light3.position, "y", -10, 10, 0.001);
gui.add(light3.position, "z", -10, 10, 0.001);
/**
 * Renders and animation
 */
// const body = document.querySelector("body");
// let bodySize = canvas.offsetLeft;
// window.addEventListener("resize", () => {
//   console.log("pair: ", canvas.offsetLeft, bodySize);
//   if (canvas.offsetLeft > bodySize) {
//     textsButtons.forEach((el, i) => {
//       el.style.left = el.offsetLeft + canvas.offsetLeft + "px";
//     });
//   } else {
//     textsButtons.forEach((el, i) => {
//       el.style.left = el.offsetLeft + canvas.offsetLeft + "px";
//     });
//   }
//   bodySize = canvas.offsetLeft;
//   // // Update sizes
//   // marimi.width = window.innerWidth;
//   // marimi.height = window.innerHeight;

//   // // Update camera
//   // camera.aspect = marimi.width / marimi.height;
//   // camera.updateProjectionMatrix();

//   // // Update renderer
//   // renderer.setSize(marimi.width, marimi.height);
//   // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / marimi.width) * 2 - 1;
  mouse.y = -(event.clientY / marimi.height) * 2 + 1;

  // console.log(mouse);
});

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(marimi.width, marimi.height);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

const textsButtons = [...document.querySelectorAll(".homeButton")];
textsButtons.forEach((el, i) => {
  const buttonPos = buttons[i].position.clone();
  buttonPos.project(camera);

  const translateX = (buttonPos.x + 1) * 0.5 * marimi.width - 85; // 85 - point is not exactly in center
  const translateY = buttonPos.y * 0.5 * 84;
  textsButtons[i].style.left = translateX + "px";
  textsButtons[i].style.top = translateY + "px";
});
window.addEventListener("click", () => {
  if (buttons[currentIntersectNr]) {
    gsap.to(buttons[currentIntersectNr].position, {
      duration: 0.5,
      y: -0.5,
      ease: "elastic.out(1.5,1)",
    });
    gsap.to(textsButtons[currentIntersectNr], {
      duration: 0.5,
      top: textsButtons[currentIntersectNr].offsetTop - 12,
      left: textsButtons[currentIntersectNr].offsetLeft + 15,
      ease: "elastic.out(1.5,1)",
    });
    if (pressedButtonNr !== null) {
      gsap.to(buttons[pressedButtonNr].position, {
        duration: 0.4,
        y: 0,
        ease: "elastic.out(1.5,1)",
      });
      gsap.to(textsButtons[pressedButtonNr], {
        duration: 0.5,
        top: textsButtons[pressedButtonNr].offsetTop - 39,
        left: textsButtons[pressedButtonNr].offsetLeft - 15,
        ease: "elastic.out(1.5,1)",
      });
    }
    pressedButtonNr = currentIntersectNr;
  }
});

const clock = new THREE.Clock();
let currentTime,
  deltaTime,
  previousTime = clock.getElapsedTime();
const tick = () => {
  currentTime = clock.getElapsedTime();
  deltaTime = previousTime - currentTime;

  vespa && (vespa.rotation.x = Math.sin(currentTime) * 0.15 - 1.2);
  vespa && (vespa.rotation.y = Math.cos(currentTime) * 0.15 - 2);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buttons);

  if (intersects.length) {
    currentIntersect = intersects[0];
    buttons.forEach((el, i) => {
      if (currentIntersect.object.uuid === el.uuid) {
        currentIntersectNr = i;
      }
    });
  } else {
    currentIntersect = null;
    currentIntersectNr = null;
  }

  previousTime = currentTime;
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
};
tick();
