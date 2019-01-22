<template>
  <div v-if="isVisibleBABYLONScene" id='app'>
    <div id='nav'>
      <router-link to='/'>Home</router-link> |
      <router-link to='/about'>About</router-link>
    </div>
    <router-view
      :location="currentSceneName"
      :locations="scenes"
      @selectedLocation="onChangeLocation"
      @onStartTest="onStartTest"
      @onEndTest="onEndTest"
      :resultTest="resultTest"
      :numElements="numElements"
      :testMode="testMode"
    />
    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <shaft-modal v-if="showModal" @close="showModal = false">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">custom header</h3>
    </shaft-modal>
  </div>
  <div v-else class="loadView">
    <LoadView/>
  </div>
</template>

<script>
import BABYLON from 'babylonjs'
import 'babylonjs-gui'
import LoadView from './views/LoadView.vue'

import CreateCustomScene from './libs/CreateCustomScene'

export default {
  // props: {
  //   initialCurrentSceneName: {
  //     type: String,
  //     default: 'scene1'
  //   }
  // },
  data: function () {
    return {
      isVisibleBABYLONScene: false,
      isVisibleVUEView: false,
      testMode: false,
      testStarted: false,
      testEnded: !this.testStarted,
      numElements: 0,
      resultTest: 0,
      currentSceneName: 'scene1',
      scenes: [
        { text: 'scene1', value: 'scene1' },
        { text: 'scene2', value: 'scene2' },
        { text: 'scene3', value: 'scene3' },
        { text: 'scene4', value: 'scene4' },
        { text: 'scene5', value: 'scene5' },
        { text: 'scene6', value: 'scene6' },
        { text: 'scene7', value: 'scene7' }
      ],
      currentScene: null,
      tempSceneName: null,
      showModal: false
    }
  },
  methods: {
    onChangeLocation (value) {
      this.onEndTest (false)
      this.currentScene.isTransitionSceneOff = true
      this.tempSceneName = value
    },
    onLoadedChildren (value) {
      this.changeVisibleVUEView(value)
      // console.log(222222222) // someValue
    },
    changeVisibleBABYLONScene (value) {
      this.isVisibleBABYLONScene = value
    },
    changeVisibleVUEView (value) {
      this.isVisibleVUEView = value
    },
    onStartTest (value) {
      if (!this.testStarted) {
        this.testMode = value
        this.testEnded = !value
        this.numElements = 0
        this.currentScene.meshes.map(v => {
          if (v.name.search(/interactiveElements\w*/) !== -1) {
            if (v.visibility) {
              this.numElements += 1
            }
          }
        })
        this.resultTest = 0
      }
    },
    onEndTest (value) {
      if (this.testMode) {
        this.testMode = value
        this.testStarted = value
        this.testEnded = !value
        this.setVisibleElementsTest(true)
      }
    },
    setVisibleElementsTest (value) {
      this.currentScene.meshes.map(v => {
        if (v.name.search(/interactiveElements\w*/) !== -1) {
          v.visibility = value
        }
      })
    }
  },
  components: {
    LoadView
  },
  mounted () {
    this.$nextTick(function () {
      // this.changeVisibleVUEView(true)
      if (BABYLON.Engine.isSupported()) {
        var scope = this
        var canvas = document.querySelector('#renderCanvas')
        var engine = new BABYLON.Engine(canvas, true, { stencil: true }, false)
        engine.disableManifestCheck = true

        BABYLON.Effect.ShadersStore['fadePixelShader'] =
          'precision highp float;' +
          'varying vec2 vUV;' +
          'uniform sampler2D textureSampler;' +
          'uniform float fadeLevel;' +
          'void main(void){' +
          'vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;' +
          'baseColor.a = 1.0;' +
          'gl_FragColor = baseColor;' +
          '}'

        var scenesMap = []
        var parameters1 = {
          nameScene: 'scene1',
          cameraPosition: new BABYLON.Vector3(0, 7, 20),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 1,
          cubeMap: '1',
          exits: [
            {
              nameExitRoom: 'scene3',
              positionExitRoom: new BABYLON.Vector3(-5, -13, 49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: 'tv',
              positionElement: new BABYLON.Vector3(-46, 0, 24),
              rotationElement: new BABYLON.Vector3(0, -Math.PI / 2, 0)
            },
            {
              nameElement: 'bed',
              positionElement: new BABYLON.Vector3(46, -20, 46),
              rotationElement: new BABYLON.Vector3(0, Math.PI / 2, 0)
            }
          ],
          engine: engine
        }
        var scene1 = new CreateCustomScene(parameters1, scope)
        scenesMap = [ ...scenesMap, scene1 ]

        var parameters2 = {
          nameScene: 'scene2',
          cameraPosition: new BABYLON.Vector3(20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '2',
          exits: [
            {
              nameExitRoom: 'scene3',
              positionExitRoom: new BABYLON.Vector3(49, -11, -4),
              rotationExitRoom: new BABYLON.Vector3(0, Math.PI / 2, 0.07)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene2 = new CreateCustomScene(parameters2, scope)
        scenesMap = [ ...scenesMap, scene2 ]

        var parameters3 = {
          nameScene: 'scene3',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '3',
          exits: [
            {
              nameExitRoom: 'scene1',
              positionExitRoom: new BABYLON.Vector3(-49, -11, -20),
              rotationExitRoom: new BABYLON.Vector3(0, -Math.PI / 2, 0.1)
            },
            {
              nameExitRoom: 'scene2',
              positionExitRoom: new BABYLON.Vector3(-10, -22, 49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene4',
              positionExitRoom: new BABYLON.Vector3(49, -11, -25),
              rotationExitRoom: new BABYLON.Vector3(0, Math.PI / 2, 0.07)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene3 = new CreateCustomScene(parameters3, scope)
        scenesMap = [ ...scenesMap, scene3 ]

        var parameters4 = {
          nameScene: 'scene4',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '4',
          exits: [
            {
              nameExitRoom: 'scene3',
              positionExitRoom: new BABYLON.Vector3(-49, -11, 0),
              rotationExitRoom: new BABYLON.Vector3(0, -Math.PI / 2, 0)
            },
            {
              nameExitRoom: 'scene5',
              positionExitRoom: new BABYLON.Vector3(10, -11, -49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene4 = new CreateCustomScene(parameters4, scope)
        scenesMap = [ ...scenesMap, scene4 ]

        var parameters5 = {
          nameScene: 'scene5',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '5',
          exits: [
            {
              nameExitRoom: 'scene4',
              positionExitRoom: new BABYLON.Vector3(15, -11, -49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene6',
              positionExitRoom: new BABYLON.Vector3(15, -11, 49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene5 = new CreateCustomScene(parameters5, scope)
        scenesMap = [ ...scenesMap, scene5 ]

        var parameters6 = {
          nameScene: 'scene6',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '6',
          exits: [
            {
              nameExitRoom: 'scene5',
              positionExitRoom: new BABYLON.Vector3(0, -11, -49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene7',
              positionExitRoom: new BABYLON.Vector3(0, -11, 49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene6 = new CreateCustomScene(parameters6, scope)
        scenesMap = [ ...scenesMap, scene6 ]

        var parameters7 = {
          nameScene: 'scene7',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: '7',
          exits: [
            {
              nameExitRoom: 'scene6',
              positionExitRoom: new BABYLON.Vector3(0, -11, -49),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [],
          engine: engine
        }
        var scene7 = new CreateCustomScene(parameters7, scope)
        scenesMap = [ ...scenesMap, scene7 ]

        scope.currentScene = scene1
        if (scope.currentSceneName !== scope.currentScene.name) {
          engine.scenes.map(v => {
            if (v.name === scope.currentSceneName) {
              scope.currentScene = v
              scope.currentScene.activeCamera.attachControl(canvas, false)
              scope.currentScene.isTransitionSceneOn = true
            }
          })
        }
        scope.currentScene.activeCamera.attachControl(canvas, false)

        var changeVisibleBABYLONScene = this.changeVisibleBABYLONScene
        scope.currentScene.executeWhenReady(function () {
          changeVisibleBABYLONScene(true)
        })
        engine.runRenderLoop(function () {
          if (scope.currentSceneName !== scope.currentScene.name) {
            engine.scenes.map(v => {
              if (v.name === scope.currentSceneName) {
                scope.currentScene = v
                scope.currentScene.activeCamera.attachControl(canvas, false)
                scope.currentScene.isTransitionSceneOn = true
              }
            })
          }
          scope.currentScene.render()
        })
        window.addEventListener('resize', function () {
          engine.resize()
        })
      }
    })
  }
}
</script>

<style>
.loadView {
  width: 100%;
  height: 100%;
  backgroundColor: white;
}
#app {
  position:absolute;
  top:0;
  right:0;
  z-index:9999;
  background: rgba(0, 160, 160, 0.75);
  width:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #94ccff
}
#nav {
  padding: 30px
}

#nav a {
  font-weight: bold;
  color: #759fcb
}

#nav a.router-link-exact-active {
  color: #b94d26
}
</style>
