import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//GUI
const gui = new dat.GUI()
//canvas
const canvas = document.querySelector('.webgl')
//scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837', 1, 15)
//2:how far from the camera does the fog start
//6:how far from the camera will the fog be fully opaque
scene.fog = fog

//Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const k = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, k,0.1,100)
camera.position.set(5,4,4)
scene.add(camera)

//Texture
const textureLoader = new THREE.TextureLoader()

/**
 * House 
 */

//Group
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({color:'#ac8e82'})
)
walls.position.y = 2.5/2
house.add(walls)

//Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y = 1 / 2 + 2.5
roof.rotation.y = Math.PI/4
house.add(roof)

//Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2),
    new THREE.MeshStandardMaterial({color:'#aa7b7b'})
)
door.position.y =1
door.position.z = 2 + 0.01
house.add(door)

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

//Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++){
    const angle = 2 * Math.PI * Math.random()
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}


//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20),
    new THREE.MeshStandardMaterial({color:'#a9c388'})
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0

scene.add(floor)

// Lights
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('b9d5ff',0.12)
moonLight.position.set(4, 5, -2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
gui.add(ambientLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(ambientLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(ambientLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

//DoorLight
const dooorLight = new THREE.PointLight('#ff7d46', 1, 7)
dooorLight.position.set(0, 2.2, 2.7)
house.add(dooorLight)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


var renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
// step1:
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap  //shadow.radius会失效

const clock = new THREE.Clock()
const tick = () => {
    const elapseTime = clock.getElapsedTime()

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()