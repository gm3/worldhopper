import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 20;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const controls = new OrbitControls( camera, renderer.domElement );
    const loader = new GLTFLoader();

    let planeSize = 1;
    let planeHeight = 1;
    let numSpirals = 2;
    let spiralRadius = 10;
    let spiralHeight = 10 * numSpirals;
    let spiralSpeed = .0001;
    let geometry = new THREE.PlaneGeometry(planeSize, planeHeight);

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    const spiral = new THREE.Object3D();

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

   


    fetch("links.csv")
  .then(response => response.text())
  .then(data => {
    const rows = data.split("\n");
    const numPlanes = rows.length;
    const promises = [];

    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].split(",");
      if (cols && cols.length >= 3) { // Check if there are at least three columns and cols is not undefined
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = `images/${cols[0]?.trim()?.replace(/"/g, "")}`;

        });
        promises.push(promise);
      }
    }

    Promise.all(promises).then(images => {
      for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].split(",");
        if (cols && cols.length >= 3) { // Check if there are at least three columns and cols is not undefined
          const img = images.shift();
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
    
          const planeWithImage = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide }));
          const t = i / numPlanes * Math.PI * 2;
          const x = Math.cos(t) * i / numPlanes * spiralRadius;
          const y = (i % numPlanes) / numPlanes * spiralHeight + Math.floor(i / numPlanes) * spiralHeight * numSpirals;

          const z = Math.sin(t) * i / numPlanes * spiralRadius;
          planeWithImage.position.set(x, y, z);
          planeWithImage.lookAt(new THREE.Vector3());
          planeWithImage.name = `Plane ${i+1}`;
          planeWithImage.userData = { url: cols[1]?.trim(), name: cols[0]?.trim(), date: cols[2]?.trim(), originalY: y }; // Store the additional data in the userData property
    
          spiral.add(planeWithImage);
        }
      }
      scene.add(spiral);
    }).catch(error => console.log(error));
  });


      
function onDocumentMouseDown(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(spiral.children);

  if (intersects.length > 0) {
    const firstIntersect = intersects[0];
    if (firstIntersect.object.userData.url) {
      window.open(firstIntersect.object.userData.url, '_blank');
    }
  }
}

document.getElementById('canvas').addEventListener('mousedown', onDocumentMouseDown, false);


const animate = function () {
  requestAnimationFrame(animate);
  spiral.rotation.y += spiralSpeed;
  renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function updatePlaneSize(event) {
  planeSize = Number(event.target.value);
  document.getElementById("planeSizeValue").textContent = planeSize;

  const numPlanes = spiral.children.length;
  for (let i = 0; i < numPlanes; i++) {
    const plane = spiral.children[i];
    const geometry = new THREE.PlaneGeometry(planeSize, planeHeight);
    plane.geometry.dispose();
    plane.geometry = geometry;
  }
}


    function updatePlaneHeight(value) {
      planeHeight = value;
      document.getElementById("planeHeightValue").textContent = planeHeight;
      const numPlanes = spiral.children.length;
      for (let i = 0; i < numPlanes; i++) {
        const plane = spiral.children[i];
        const t = i / numPlanes * Math.PI * 2;
        const x = Math.cos(t) * i / numPlanes * spiralRadius;
        const y = i / numPlanes * spiralHeight;
        const z = Math.sin(t) * i / numPlanes * spiralRadius;
        plane.position.set(x, y, z);
        const geometry = new THREE.PlaneGeometry(planeSize, planeHeight);
        plane.geometry.dispose();
        plane.geometry = geometry;
      }
    }

    function updateSpiralRadius(event) {
      spiralRadius = Number(event.target.value);
      document.getElementById("spiralRadiusValue").textContent = spiralRadius;
      for (let i = 0; i < spiral.children.length; i++) {
        const t = i / spiral.children.length * Math.PI * 2;
        const x = Math.cos(t) * i / spiral.children.length * spiralRadius;
        const z = Math.sin(t) * i / spiral.children.length * spiralRadius;
        spiral.children[i].position.set(x, spiral.children[i].position.y, z);
      }
    }

    function updateSpiralHeight(event) {
      spiralHeight = Number(event.target.value);
      document.getElementById("spiralHeightValue").textContent = spiralHeight;
      for (let i = 0; i < spiral.children.length; i++) {
        const y = i / spiral.children.length * spiralHeight;
        spiral.children[i].position.set(spiral.children[i].position.x, y, spiral.children[i].position.z);
      }
    }

    function updateSpiral() {
      while (spiral.children.length) {
        spiral.remove(spiral.children[0]);
      }}

      const modal = document.createElement('div');
modal.classList.add('modal');
document.body.appendChild(modal);

function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(spiral.children);

  if (intersects.length > 0) {
    const firstIntersect = intersects[0];
    if (firstIntersect.object.userData.url) {
      const url = firstIntersect.object.userData.url;
      const name = firstIntersect.object.userData.name; // Get the name from userData
      const date = firstIntersect.object.userData.date; // Get the date from userData
      const rect = renderer.domElement.getBoundingClientRect();
      modal.style.top = `${event.clientY - rect.top}px`;
      modal.style.left = `${event.clientX - rect.left + 50}px`;
      modal.innerHTML = `<h3>${name}</h3><p>${date}</p><p>Click to open ${url}</p>`;
      modal.style.display = 'block';
      spiral.children.forEach(plane => {
        if (plane === firstIntersect.object) {
          plane.scale.set(2, 2, 2);
          
        } else {
          plane.scale.set(1, 1, 1);
        }
      });
    }
  } else {
    modal.style.display = 'none';
    spiral.children.forEach(plane => plane.scale.set(1, 1, 1));
  }
}

document.addEventListener('mousemove', onDocumentMouseMove);


      document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("planeSizeSlider").addEventListener("input", (event) => updatePlaneSize(event));
        document.getElementById("planeHeightSlider").addEventListener("input", (event) => updatePlaneHeight(event.target.value));
        document.getElementById("spiralRadiusSlider").addEventListener("input", (event) => updateSpiralRadius(event));
        document.getElementById("spiralHeightSlider").addEventListener("input", (event) => updateSpiralHeight(event));
      
        
      });

      updateSpiral();
      