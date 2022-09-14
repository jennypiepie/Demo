import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//GUI
const gui = new dat.GUI({closed:true})
//canvas
const canvas = document.querySelector('.webgl')
//scene
const scene = new THREE.Scene()

//Fog
const fog = new THREE.Fog('#262837', 1, 15)
//2:how far from the camera does the fog start
//6:how far from the camera will the fog be fully opaque
scene.fog = fog

//Texture
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg') 
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAOTexture = textureLoader.load('/textures/door/ao.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg') 
const bricksAOTexture = textureLoader.load('/textures/bricks/ao.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg') 
const grassAOTexture = textureLoader.load('/textures/grass/ao.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// grassColorTexture.repeat.set(8, 8)
// grassAOTexture.repeat.set(8, 8)
// grassNormalTexture.repeat.set(8, 8)
// grassRoughnessTexture.repeat.set(8, 8)

// grassColorTexture.wrapS = THREE.RepeatWrapping
// grassAOTexture.wrapS = THREE.RepeatWrapping
// grassNormalTexture.wrapS = THREE.RepeatWrapping
// grassRoughnessTexture.wrapS = THREE.RepeatWrapping


/**
 * House 
 */

//Group
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAOTexture,
        normalMap: bricksNormalTexture,
        roughnessMap:bricksRoughnessTexture
    })
)

walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
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
    new THREE.PlaneBufferGeometry(2, 2,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap:doorAOTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
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
    grave.castShadow = true
    graves.add(grave)
}


//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAOTexture,
        normalMap: grassNormalTexture,
        roughnessMap:grassRoughnessTexture
    })
)

floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
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

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)


//Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const k = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, k,0.1,100)
camera.position.set(5,4,4)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

var renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
//Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
dooorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

dooorLight.shadow.mapSize.width = 256
dooorLight.shadow.mapSize.height = 256
dooorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

const clock = new THREE.Clock()
const tick = () => {
    const elapseTime = clock.getElapsedTime()

    //update ghosts
    const ghost1Angle = elapseTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = -elapseTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapseTime * 2.5)

    const ghost3Angle = -elapseTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7+Math.sin(elapseTime*0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7+Math.sin(elapseTime*0.32))
    ghost3.position.y = Math.sin(elapseTime * 4) + Math.sin(elapseTime * 2)

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()