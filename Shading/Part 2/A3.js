/*
 * UBC CPSC 314
 * Assignment 3 Template
 */

// Setup the renderer
// You should look into js/setup.js to see what exactly is done here.
const { renderer, canvas } = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Load floor textures
const floorColorTexture = new THREE.TextureLoader().load('texture/concrete.jpg');
floorColorTexture.minFilter = THREE.LinearFilter;
floorColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const floorNormalTexture = new THREE.TextureLoader().load('texture/normal.png');
floorNormalTexture.minFilter = THREE.LinearFilter;
floorNormalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Uniforms - Pass these into the appropriate vertex and fragment shader files
const colorMap = { type: 't', value: floorColorTexture };
const normalMap = { type: 't', value: floorNormalTexture };

const gradColor = { type: 'c', value: new THREE.Color(0xff6219) }; // outer color
const gradColor2 = { type: 'c', value: new THREE.Color(0xffcb30) }; // inner color

const spherePosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
const tangentDirection = { type: 'v3', value: new THREE.Vector3(0.5, 0.0, 1.0) };

const ambientColor = { type: 'c', value: new THREE.Color(0x575657) };
const diffuseColor = { type: 'c', value: new THREE.Color(0xdbe4eb) };
const specularColor = { type: 'c', value: new THREE.Color(0xffffff) };
const lightColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const toonColor = { type: 'c', value: new THREE.Color(0xff6219) }; // outer color
const toonColor2 = { type: 'c', value: new THREE.Color(0xffcb30) }; // inner color
const outlineColor = { type: 'c', value: new THREE.Color(0x000000) };

const kAmbient = { type: "f", value: 0.3 };
const kDiffuse = { type: "f", value: 0.6 };
const kSpecular = { type: "f", value: 1.0 };
const shininess = { type: "f", value: 10.0 };
const ticks = { type: "f", value: 0.0 };

// Shader materials
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition
  }
});

const floorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    colorMap: colorMap,
    normalMap: normalMap
  }
});

const phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    ambientColor: ambientColor,
    diffuseColor: diffuseColor,
    specularColor: specularColor,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess,
  }
});

const anisoMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    ambientColor: ambientColor,
    diffuseColor: diffuseColor,
    specularColor: specularColor,
    kAmbient: kAmbient,
    kDiffuse: kDiffuse,
    kSpecular: kSpecular,
    shininess: shininess,
    lightColor: lightColor,
    tangentDirection: tangentDirection,
  }
});

const toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    toonColor: toonColor,
    toonColor2: toonColor2,
    outlineColor: outlineColor,
  }
});

const squaresMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    ticks: ticks,
    gradColor: gradColor,
    gradColor2: gradColor2,
  }
});

// Load shaders
const shaderFiles = [
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/squares.vs.glsl',
  'glsl/squares.fs.glsl',
  'glsl/floor.vs.glsl',
  'glsl/floor.fs.glsl',
  'glsl/aniso.vs.glsl',
  'glsl/aniso.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];

  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];

  anisoMaterial.vertexShader = shaders['glsl/aniso.vs.glsl'];
  anisoMaterial.fragmentShader = shaders['glsl/aniso.fs.glsl'];

  squaresMaterial.vertexShader = shaders['glsl/squares.vs.glsl'];
  squaresMaterial.fragmentShader = shaders['glsl/squares.fs.glsl'];

  floorMaterial.vertexShader = shaders['glsl/floor.vs.glsl'];
  floorMaterial.fragmentShader = shaders['glsl/floor.fs.glsl'];
});

// Set up scenes
let scenes = [];
const { scene, camera, worldFrame } = createScene(canvas);


const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry);
spherePosition.value.set(0.0, 5.0, -10.0);

scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 1000);
sphereLight.position.set(0.0, 7.0, -10.0);
spherePosition.value.set(0.0, 5.0, -10.0);
scene.add(sphereLight);


// const sphereLight = new THREE.PointLight(0xffffff, 1, 300);
// scene.add((sphereLight);
//
//   // Create the main sphere geometry (light source)
//   // https://threejs.org/docs/#api/en/geometries/SphereGeometry
//   const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
//   const sphere = new THREE.Mesh(sphereGeometry);
//   sphere.position.set(0.0, 20.0, 0.0);
//   sphereLight.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
//   sphere.parent = worldFrame;
//   scene.add(sphere);

  // Look at the definition of loadOBJ to familiarize yourself with
  // how each parameter affects the loaded object.
// loadAndPlaceOBJ('obj/armadillo.obj', phongMaterial , function (armadillo) {
//     armadillo.position.set(0.0, -2.0, -10.0);
//     armadillo.rotation.y = Math.PI;
//     armadillo.scale.set(10, 10, 10);
//     armadillo.parent = worldFrame;
//     scene.add(armadillo);
//   });

// loadAndPlaceOBJ('obj/lamp.obj', phongMaterial, function (lamp) {
//   lamp.position.set(0.0, -10.0, 0.0);
//   lamp.rotation.y = Math.PI;
//   lamp.scale.set(10, 10, 10);
//   lamp.parent = worldFrame;
//   scene.add(lamp);
// });


// Image map / base map / diffuse map
const teddyBase = new THREE.TextureLoader().load('images/teddy/Teddy_BaseColor.png');
// Normal Map
const teddyNormal = new THREE.TextureLoader().load('images/teddy/Teddy_Normal.png');
// AO, roughness, and metalness map
const teddyOccRoughMetal = new THREE.TextureLoader().load('images/teddy/Teddy_OcclusionRoughnessMetallic.png');

const teddyMaterial = new THREE.MeshStandardMaterial({
  map: teddyBase,
  normalMap: teddyNormal,
  aoMap: teddyOccRoughMetal,
  metalnessMap: teddyOccRoughMetal,
  roughnessMap: teddyOccRoughMetal,
  //side: THREE.DoubleSide
});

loadAndPlaceOBJ('obj/Teddy.obj', teddyMaterial, function (teddy) {
  teddy.position.set(0.0, 0.0, -20.0);
  // teddy.rotation.y = Math.PI;
  // teddy.scale.set(1, 1, 1);
  teddy.parent = worldFrame;
  scene.add(teddy);
});


// Diffuse texture map (this defines the main colors of the floor)
const floorDiff = new THREE.TextureLoader().load('images/grass/Grass_003_COLOR.jpg');
// Ambient occlusion map
const floorAo = new THREE.TextureLoader().load('images/grass/Grass_003_OCC.jpg');
// Displacement map
const floorDisp = new THREE.TextureLoader().load('images/grass/Grass_003_DISP.jpg');
// Normal map
const floorNorm = new THREE.TextureLoader().load('images/grass/Grass_003_NRM.jpg');
// Roughness map
const floorRoughness = new THREE.TextureLoader().load('images/grass/Grass_003_ROUGH.jpg');

const groundMaterial = new THREE.MeshStandardMaterial({
  map: floorDiff,
  aoMap: floorAo,
  displacementMap: floorDisp,
  normalMap: floorNorm,
  roughnessMap: floorRoughness,
  side: THREE.DoubleSide
});

const terrainGeometry = new THREE.BoxGeometry(200, 200, 2);
const terrain = new THREE.Mesh(terrainGeometry, groundMaterial);
terrain.scale.set(0.5,0.5,0.5);
terrain.position.y = -10.4;
terrain.rotation.set(- Math.PI / 2, 0, 0);
scene.add(terrain);
  
// scene.add(sphereLight);
scenes.push({ scene, camera });

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  // sphereLight.position.set(spherePosition.value.x, spherePosition.value.y, spherePosition.value.z);

  // The following tells three.js that some uniforms might have changed
  sphereMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  squaresMaterial.needsUpdate = true;
  floorMaterial.needsUpdate = true;
}

// clock = THREE.Clock;

// Setup update callback
function update() {
  checkKeyboard();
  ticks.value += 1 / 100.0;

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  // const { scene, camera } = scenes[mode];
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
