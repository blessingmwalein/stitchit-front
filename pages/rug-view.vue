<template>
    <div class="p-4">
      <h2 class="text-lg font-bold">3D Rug Customizer</h2>
  
      <!-- Form Inputs -->
      <div class="flex gap-4 my-4">
        <input v-model="rugWidth" type="number" placeholder="Width (cm)" class="border p-2">
        <input v-model="rugHeight" type="number" placeholder="Height (cm)" class="border p-2">
        <select v-model="rugShape" class="border p-2">
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="oval">Oval</option>
        </select>
      </div>
  
      <!-- 3D Rug Preview -->
      <div ref="sceneContainer" class="scene-container"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  
  // Reactive state
  const rugWidth = ref(100);
  const rugHeight = ref(150);
  const rugShape = ref("rectangle");
  const sceneContainer = ref(null);
  
  let scene, camera, renderer, rug, floor, controls;
  let rugTexture, floorTexture;
  
  const loadTexture = (url) => {
    const loader = new THREE.TextureLoader();
    return loader.load(url);
  };
  
  const createScene = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background
  
    // Camera
    camera = new THREE.PerspectiveCamera(45, 1.5, 1, 1000);
    camera.position.set(0, 100, 200);
  
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 300);
    sceneContainer.value.appendChild(renderer.domElement);
  
    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 200, 200);
    scene.add(light);
  
    // Floor (Tiles)
    floorTexture = loadTexture("https://static.vecteezy.com/system/resources/thumbnails/010/971/072/small_2x/old-ceramic-tile-with-cement-texture-cement-and-concrete-stone-mosaic-tile-photo.jpg");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
  
    const floorGeometry = new THREE.PlaneGeometry(400, 400);
    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Lay flat
    scene.add(floor);
  
    // Rug (Placeholder)
    rugTexture = loadTexture("/images/rug2.png");
    createRug();
  
    // Controls (Orbit)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  
    animate();
  };
  
  const createRug = () => {
    if (rug) scene.remove(rug);
  
    let geometry;
    if (rugShape.value === "rectangle") {
      geometry = new THREE.PlaneGeometry(rugWidth.value, rugHeight.value);
    } else if (rugShape.value === "circle") {
      geometry = new THREE.CircleGeometry(rugWidth.value / 2, 32);
    } else {
      geometry = new THREE.EllipseGeometry(rugWidth.value / 2, rugHeight.value / 2, 32);
    }
  
    const material = new THREE.MeshStandardMaterial({ map: rugTexture });
    rug = new THREE.Mesh(geometry, material);
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 1;
    scene.add(rug);
  };
  
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  
  // Watch for changes and update rug
  watch([rugWidth, rugHeight, rugShape], createRug);
  
  // Initialize Three.js scene on mount
  onMounted(createScene);
  </script>
  
  <style scoped>
  .scene-container {
    width: 100%;
    height: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }
  </style>