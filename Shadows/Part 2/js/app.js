import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import t from './img/t.png';
import t1 from './img/t1.png';
import gsap from 'gsap';
import * as dat from "dat.gui";

let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {
  constructor() {


    // this.container = options.dom;
    // this.width = this.container.offsetWidth;
    // this.height = this.container.offsetHeight;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({ antialias: true } );
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(this.renderer.domElement);

    this.textures = [
      new THREE.TextureLoader().load(t),
      new THREE.TextureLoader().load(t1),
    ]

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 3000);
    this.camera.position.z = 1000;
    this.scene = new THREE.Scene();
    this.time = 0;
    this.move = 0;
    // this.progress = 0;
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.settings();
    this.mouseEffects();
    this.addObjects();
    this.render();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  mouseEffects() {
    window.addEventListener('mousedown', (e) => {
      gsap.to(this.material.uniforms.mousePressed, {
        duration: 1,
        value: 1,
        ease: "elastic.out(1, 0.3)"
      })
    });

    window.addEventListener('mouseup', (e) => {
      gsap.to(this.material.uniforms.mousePressed, {
        duration: 1,
        value: 0,
        ease: "elastic.out(1, 0.3)"
      })
    });

    window.addEventListener('mousewheel', (e) => {
      this.move += e.wheelDeltaY / 1000;
      this.progress += e.wheelDeltaY / 1000;

    });

    this.test = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2000,2000),
        new THREE.MeshBasicMaterial()
    )
    
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // calculate objects intersecting the picking ray
      let intersects = this.raycaster.intersectObjects([this.test]);

      this.point.x = intersects[0].point.x;
      this.point.y = intersects[0].point.y;

    }, false);

  }
  addObjects() {

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,

      uniforms: {
        progress: { type: "f", value: 0 },
        t: { type: "t", value: this.textures[0] },
        t1: { type: "t", value: this.textures[1] },
        mousePressed: { type: "g", value: 0 },
        mouse: { type: "v2", value: null },
        transition: { type: "f", value: 0 },
        move: { type: "f", value: 0 },
        time: { type: "f", value: 0 },

      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,

    })

    let number = 512*512;
    this.geometry = new THREE.BufferGeometry(1, 1, 10, 10);
    this.positions = new THREE.BufferAttribute(new Float32Array(number*3),3);
    this.coordinates = new THREE.BufferAttribute(new Float32Array(number*3),3);
    this.speeds = new THREE.BufferAttribute(new Float32Array(number),1);
    this.offset = new THREE.BufferAttribute(new Float32Array(number),1);
    this.direction = new THREE.BufferAttribute(new Float32Array(number),1);
    this.press = new THREE.BufferAttribute(new Float32Array(number),1);

    function rand(a,b) {
      return a + (b-a) * Math.random();
    }

    let index = 0;
    for (let i = 0; i < 512; i++) {
      let posX = i-256;
      for (let j = 0; j < 512; j++) {
        this.positions.setXYZ(index, posX*2, (j-256)*2,0);
        this.coordinates.setXYZ(index, i, j,0);
        this.offset.setX(index, rand(-1000,1000));
        this.speeds.setX(index, rand(0.4,1));
        this.direction.setX(index, Math.random() > 0.5 ? 1:-1);
        this.press.setX(index, rand(0.4,1));

        index++;
      }
    }

    this.geometry.setAttribute("position", this.positions);
    this.geometry.setAttribute("aCoord", this.coordinates);
    this.geometry.setAttribute("aOffset", this.offset);
    this.geometry.setAttribute("aSpeed", this.speeds);
    this.geometry.setAttribute("aPress", this.press);
    this.geometry.setAttribute("aDirection", this.direction);

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);

  }

  render() {
    let next = Math.floor(this.move + 50) % 2;
    let prev = (Math.floor(this.move) + 51) % 2;

    this.time++;
    this.material.uniforms.transition.value = this.settings.progress;
    this.material.uniforms.t.value = this.textures[next];
    this.material.uniforms.t1.value = this.textures[prev];
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.move.value = this.move;
    this.material.uniforms.mouse.value = this.point;

    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }

}

new Sketch();


