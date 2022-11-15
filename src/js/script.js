// IMPORT

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import sky from "../img/sky.jpg"

// RENDERER
const loader = new GLTFLoader()
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

// SCENE
const scene = new THREE.Scene()
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([sky,sky,sky,sky,sky,sky])
scene.fog = new THREE.FogExp2(0XFFFFFF,0.01)

// CAMERA
const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.001,10000)
camera.position.set(0,10,30)

// VAR
var dy = 0
let random = 0
let gameFrame = 0
var physicCTR = 0
var cameraLookAty = 0
var score = 0
var scoreDiv = document.getElementById('score')
const planeColor = new THREE.Color("rgb(113, 191, 46)");
var abresArray = []

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// HeightMap
const groundGeo = new THREE.PlaneGeometry(500,200,150,150)
let disMap = new THREE.TextureLoader().setPath("../").load("heightMap.png")
disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping
disMap.repeat.set(10,10)
const groundMat = new THREE.MeshStandardMaterial({color:planeColor,wireframe:false,displacementMap:disMap,displacementScale:1.5,})
var groundMesh = new THREE.Mesh(groundGeo,groundMat)
var groundMesh1 = new THREE.Mesh(groundGeo,groundMat)
groundMesh.receiveShadow = true
groundMesh.rotation.x = -0.5 * Math.PI
groundMesh.position.z = -70
scene.add(groundMesh)

// LIGHT

const ambientLight = new THREE.AmbientLight(0x333333)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF)
directionalLight.position.set(-30,5,40)
directionalLight.castShadow = true
directionalLight.shadow.camera.top = 50
directionalLight.shadow.camera.right = 100
scene.add(ambientLight,directionalLight)

// OBJECT

var column1 
var column2 
var column3

var currentColumn = 1

var died = false
var colunmBonus = {one:"",tow:"",three:""}

loader.load("../colonne.glb",function(gltf){
        gltf.scene.traverse(function (child) {if (child.isMesh) {child.castShadow = true}})
        column1 = gltf.scene.clone()
        column2 = gltf.scene.clone()
        column3 = gltf.scene.clone() 
        scene.add(column1,column2,column3)
        
        loader.load("../untitled1.glb",function(gltf){
                gltf.scene.traverse(function (child) {if (child.isMesh) {child.castShadow = true}})
                for (let i = 0; i<20;i++){ 
                    abresArray.push(gltf.scene.clone())
                    scene.add(abresArray[i])
                    if (i<=10){
                        abresArray[i].position.set(randomInteger(-40,-8),0,randomInteger(-100,30))
                    }else {
                        abresArray[i].position.set(randomInteger(8,40),0,randomInteger(-100,30))
                    }
                    random = randomInteger(0,10)/20
                    abresArray[i].scale.set(0.9+random,0.9+random,0.9+random)
                    abresArray[i].rotation.y = Math.floor(Math.random() * 100)
                }
                loader.load("../arbre2.glb",function(gltf){
                    gltf.scene.traverse(function (child) {if (child.isMesh) {child.castShadow = true}})
                    for (let i = 20; i<40;i++){ 
                        abresArray.push(gltf.scene.clone())
                        scene.add(abresArray[i])
                        if (i<=30){
                            abresArray[i].position.set(randomInteger(-150,-8),0,randomInteger(-100,30))
                        }else {
                            abresArray[i].position.set(randomInteger(8,150),0,randomInteger(-100,30))
                    }
                        random = randomInteger(0,10)/20
                        abresArray[i].scale.set(0.9+random,0.9+random,0.9+random)
                        abresArray[i].rotation.y = Math.floor(Math.random() * 100)
                    }
                    renderer.setAnimationLoop(animate)
                }
            )}
        )
    }
)

function checkIfImDeadBrooother(camera,colunmBonus,currentColumn){
    if (currentColumn == 1 && column1.position.z >26){if (camera.position.y < 6.3+colunmBonus.one ||camera.position.y > 5.2+colunmBonus.one +8.6){died = true}}
    if (currentColumn == 2 && column2.position.z >26){if (camera.position.y < 6.3+colunmBonus.tow ||camera.position.y > 5.2+colunmBonus.tow +8.6){died = true}}
    if (currentColumn == 3 && column3.position.z >26){if(camera.position.y < 6.3+colunmBonus.three||camera.position.y > 5.2+colunmBonus.three   +8.6){died = true}}
}

// ANIMATE

function animate(time){
    scoreDiv.innerHTML = score
    if(gameFrame == 0){
        random = Math.round((Math.random()*100)/6)
        column1.position.set(0,-23 + random,-20)
        colunmBonus.one =random

        random = Math.round((Math.random()*100)/6)
        column2.position.set(0,-23 + random,-40)
        colunmBonus.tow =random

        random = Math.round((Math.random()*100)/6)
        column3.position.set(0,-23 + random,-60)
        colunmBonus.three =random
    }
    // check collision for player
    checkIfImDeadBrooother(camera,colunmBonus,currentColumn)
    if (camera.position.y <= 2){
        camera.position.y = 2
        died = true
    }else {
        physicCTR += 3
        camera.position.y += dy - 0.0025 *physicCTR
        if (dy - 0.002 *physicCTR > 0 && cameraLookAty <10*10){
            cameraLookAty += 1
            camera.lookAt(0, camera.position.y+cameraLookAty/10, 0);
        }
        if (dy - 0.002 *physicCTR < 0 && cameraLookAty >-5*10) {
            cameraLookAty -= 1
            camera.lookAt(0, camera.position.y+cameraLookAty/10, 0);
        }
        dy = dy *0.7
    }

    if (!died){
        column1.position.z += 0.3
        column2.position.z += 0.3
        column3.position.z += 0.3

        if (column1.position.z > 31){
            random = Math.round((Math.random()*100)/6)
            colunmBonus.one =random
            column1.position.z = -30
            column1.position.y = -23 + random
            currentColumn = 2
            score ++
        }
        if (column2.position.z > 31){
            random = Math.round((Math.random()*100)/6)
            colunmBonus.tow =random
            column2.position.z = -30
            column2.position.y = -23 + random
            currentColumn = 3
            score ++
        }
        if (column3.position.z > 31){
            random = Math.round((Math.random()*100)/6)
            colunmBonus.three =random
            column3.position.z = -30
            column3.position.y = -23 + random
            currentColumn = 1
            score ++
        }

        abresArray.forEach(function(arbre){
            arbre.position.z += 0.3
            if (arbre.position.z > 31){arbre.position.z = -100}
        })  
    }
    
    gameFrame += 1
    renderer.render(scene,camera)
}


document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        if (!died && camera.position.y < 26){
            physicCTR = 0
            dy += 1
        }
    }
})

document.addEventListener('click', event => {
        if (!died && camera.position.y < 26){
            physicCTR = 0
            dy += 1
        }
})

function playEvent(event){

}