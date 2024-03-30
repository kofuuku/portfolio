// import './style.css'

import * as THREE from 'three'; //importing the three js library 


// we always need: a scene, a renderer and a camera
//scene contains all the objects,cameras and lights

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //importing orbit controls class from threejs examples namespace

const scene = new THREE.Scene();

//to look at things inside the screen, we need a camera
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1,1000);  //field of view,aspect ratio(based off of users browser window),view frustum (to control which objects are visible relative to the camera)


console.log("Hello");


//to render out the actual graphics
//cavas: is the dom element the renderer uses
const renderer = new THREE.WebGLRenderer({         
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);            //keep pixel ratio same
renderer.setSize( window.innerWidth, window.innerHeight );  //fullscreen canvas
camera.position.setZ(30);                                   //moves camera along Z
camera.position.setX(-3);
renderer.render(scene,camera);                               // to draw





//steps to create a shape
// geometry/set of vectors: the points define the shape
//material: for color and texture 


//new THREE.Color(material).convertSRGBToLinear()

//Torus
const geometry = new THREE.TorusGeometry(10,3,16,100)    
const material = new THREE.MeshStandardMaterial({color:0Xbf4060}); //standard material reacts to light bouncing off of it
const torus = new THREE.Mesh(geometry,material);

scene.add(torus)


//Lights
const pointlight = new THREE.PointLight(0xffffff)  //0x=hexadecimal literal
pointlight.position.set(5,5,5)

const ambientlight = new THREE.AmbientLight(0xffffff); //uto put lighting across the entire scene
scene.add(pointlight,ambientlight)

//const lighthelper = new THREE.PointLightHelper(pointlight) //shows the position and direction of lightsource
//const gridhelper = new THREE.GridHelper(200,50); //gives us a 2d grid on screen
//scene.add(lighthelper,gridhelper)

const controls = new OrbitControls(camera,renderer.domElement);   //allows us to move around the scene using our mouse  (listens to dom events on the mouse and updates the camera position equivalently)



//populating the space with a bunch of randomly generated stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff})  
  const star = new THREE.Mesh(geometry,material); 

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));    //randomly generates an x,y,z position for each star by filling an array for each value and then we map each value to the rand function which randomly generates a balue b/w -10 to +100


  star.position.set(x,y,z);
  scene.add(star)

}

Array(200).fill().forEach(addStar)  //gives 200 random stars

// background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');  //to load another image
spaceTexture.colorSpace = THREE.SRGBColorSpace
scene.background = spaceTexture;

//me
const meTexture = new THREE.TextureLoader().load('me.png');
meTexture.colorSpace = THREE.SRGBColorSpace
const me = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:meTexture})
);

scene.add(me);


//Earth
const normalTexture = new THREE.TextureLoader().load('normal.jpg')
const earthTexture = new THREE.TextureLoader().load('earth.jpg')
earthTexture.colorSpace = THREE.SRGBColorSpace
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map:earthTexture, //maps the image around the sphere
    normalMap: normalTexture //gives it a texture
  })
);
scene.add(earth);

earth.position.setZ(10);       //both do the same thing 
earth.position.setX(-10);




function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x +=0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  me.rotation.y += 0.01;
  me.rotation.z += 0.01;

  camera.position.z = t*-0.01;
  camera.position.x = t*-0.0002;
  camera.position.y = t*-0.002;

}
document.body.onscroll = moveCamera  //assigned function to handle the document body onscroll event



// so that we dont hvae to rerender again and again
//recursive infinite loop that calls the render method automatically
function animate(){
  requestAnimationFrame(animate);   // tells the browser that you want to perform an animation

torus.rotation.x += 0.01;
torus.rotation.y += 0.005;
torus.rotation.z += 0.01;

earth.rotation.x +=0.05;
earth.rotation.y += 0.075;
earth.rotation.z += 0.05;


controls.update();  //to make sure the controls are updated

  renderer.render(scene,camera);
}

animate()
