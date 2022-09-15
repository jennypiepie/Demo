import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'
import { BufferAttribute } from 'three'

//GUI
const gui = new dat.GUI({closed:true})
//canvas
const canvas = document.querySelector('.webgl')
//scene
const scene = new THREE.Scene()


/**
 *Galaxy 
 */

const parameters = {}
parameters.count = 20000
parameters.radius = 5
parameters.branches = 3
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    //如果之前已经有points存在，先清空
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count)
    const randomness = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++){
        const i3 = i * 3

        //position
        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        positions[i3 + 0] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius

        //randomness
        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5?radius*0.5:-radius*0.5)
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5?radius*0.5:-radius*0.5)
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5?radius*0.5:-radius*0.5)

        randomness[i3 + 0] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ

        //color
        const mixColor = insideColor.clone()
        mixColor.lerp(outsideColor, radius / parameters.radius)
        
        colors[i3 + 0] = mixColor.r
        colors[i3 + 1] = mixColor.g
        colors[i3 + 2] = mixColor.b

        //scale
        scales[i] = Math.random()
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness',new THREE.BufferAttribute(randomness,3))

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: 30 * renderer.getPixelRatio()} 
        }
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)

}



//改变count和size时重新执行generateGalaxy方法
gui.add(parameters,'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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

generateGalaxy()

const clock = new THREE.Clock()

const tick = () => {
    const elapseTime = clock.getElapsedTime()

    // update material
    material.uniforms.uTime.value = elapseTime

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()