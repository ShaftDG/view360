<template>
  <div v-if="isVisibleBABYLONScene" id='app'>
    <shaft-elastic-header
      :startMove="currentScene"
    >
      <template slot="header">
        <!--<router-view-->
          <!--:location="currentSceneName"-->
          <!--:locations="scenes"-->
          <!--@selectedLocation="onChangeLocation"-->
          <!--@onStartTest="onStartTest"-->
          <!--@onEndTest="onEndTest"-->
          <!--:resultTest="resultTest"-->
          <!--:numElements="numElements"-->
          <!--:testMode="testMode"-->
        <!--/>-->

        <p v-if="showMsg">{{greeting}}</p>
        <!--<shaft-button @click="onStartTest(true)">Begin test</shaft-button>-->
        <!--<shaft-button @click="onEndTest(false)">End test</shaft-button>-->
        <!--<shaft-dropdown :options="locations"-->
        <!--:selected="location"-->
        <!--@updateOption="onChange($event)"-->
        <!--:placeholder="'Select an Item'">-->
        <!--</shaft-dropdown>-->
        <shaft-navbar :options="scenes"
                      :selected="currentSceneName"
                      @updateOption="onChangeLocation($event)"
                      :placeholder="'Select an Item'">
        </shaft-navbar>
      </template>
      <!--<template slot="content"></template>-->
    </shaft-elastic-header>
    <div class="hint" ref="hint" v-if="showHint">
      {{textHint}}
    </div>
    <shaft-modal v-if="showModal"
                 :type="'modal-container'"
                 @close="showModal = false">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">{{nameElement}}</h3>
      <!--<iframe slot="body" src="https://ru.vuejs.org/v2/guide/components.html"-->
      <iframe id="modalIframe" slot="body" :src="iframe.src"
              width="100%" height="100%" frameborder="0" allowfullscreen>
      </iframe>
    </shaft-modal>
    <shaft-modal v-if="testEnded && testMode"
                 :type="'modal-container-congratulations'"
                 @close="onEndTest">
      <div slot="body">
        <h1>Congratulations!</h1>
        <h2>You correctly marked {{resultTest}} items out of {{numElements}}</h2>
      </div>
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
import ShaftNavbar from './components/ShaftNavbar'

import CreateCustomScene from './libs/CreateCustomScene'

export default {
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
        { text: 'living room', value: 'living-room' },
        { text: 'kitchen', value: 'kitchen' },
        { text: 'scene4', value: 'scene4' },
        { text: 'scene5', value: 'scene5' },
        { text: 'scene6', value: 'scene6' },
        { text: 'scene7', value: 'scene7' }
      ],
      currentScene: null,
      tempSceneName: null,
      showModal: false,
      showHint: false,
      textHint: 'opening_scene',
      nameElement: '',
      iframe: {
        src: 'http://192.168.1.55:8080',
        style: null,
        wrapperStyle: null
      }
    }
  },
  computed: {
    greeting: function () {
      return this.resultTest + ' correct answers out of ' + this.numElements
    },
    showMsg: function () {
      return this.testMode
    }
  },
  methods: {
    onMoveMouseGlobal: function (e) {
      var hint = this.$refs.hint
      if (hint) {
        e = e.changedTouches ? e.changedTouches[0] : e
        hint.style.transform = 'translate(' + e.clientX + 'px, ' + (e.clientY - 40) + 'px)'
      }
    },
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
    LoadView,
    ShaftNavbar
  },
  created: function () {
    window.addEventListener('mousemove',this.onMoveMouseGlobal);
  },
  destroyed: function () {
    window.removeEventListener('mousemove', this.onMoveMouseGlobal);
  },
  mounted () {
    this.hint = this.$refs.hint
    this.$nextTick(function () {
      // this.changeVisibleVUEView(true)
      if (BABYLON.Engine.isSupported()) {
        var scope = this
        var canvas = document.getElementById('renderCanvas')
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
              nameExitRoom: 'kitchen',
              positionExitRoom: new BABYLON.Vector3(-5, -13, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: 'tv',
              positionElement: new BABYLON.Vector3(-460, 0, 24),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'http://81.25.47.128/JewelSlot/'
            },
            {
              nameElement: 'bed',
              positionElement: new BABYLON.Vector3(460, -20, 46),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'http://192.168.1.55:8080'
            }
          ]
        }
        var scene1 = new CreateCustomScene(parameters1, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene1 ]

        var parameters2 = {
          nameScene: 'living-room',
          cameraPosition: new BABYLON.Vector3(20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 5, 0),
          fadeLevel: 0,
          cubeMap: 'living_room',
          exits: [
            {
              nameExitRoom: 'kitchen',
              positionExitRoom: new BABYLON.Vector3(940, -11, -4),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene2 = new CreateCustomScene(parameters2, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene2 ]

        var parameters3 = {
          nameScene: 'kitchen',
          cameraPosition: new BABYLON.Vector3(-200, 100, 100),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'kitchen',
          exits: [
            {
              nameExitRoom: 'scene1',
              positionExitRoom: new BABYLON.Vector3(-10, -22, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'living-room',
              positionExitRoom: new BABYLON.Vector3(-940, -11, -20),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene4',
              positionExitRoom: new BABYLON.Vector3(940, -11, -25),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene3 = new CreateCustomScene(parameters3, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene3 ]

        var parameters4 = {
          nameScene: 'scene4',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: '4',
          exits: [
            {
              nameExitRoom: 'kitchen',
              positionExitRoom: new BABYLON.Vector3(-940, -11, 0),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene5',
              positionExitRoom: new BABYLON.Vector3(10, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene4 = new CreateCustomScene(parameters4, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene4 ]

        var parameters5 = {
          nameScene: 'scene5',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: '5',
          exits: [
            {
              nameExitRoom: 'scene4',
              positionExitRoom: new BABYLON.Vector3(15, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene6',
              positionExitRoom: new BABYLON.Vector3(15, -11, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene5 = new CreateCustomScene(parameters5, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene5 ]

        var parameters6 = {
          nameScene: 'scene6',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: '6',
          exits: [
            {
              nameExitRoom: 'scene5',
              positionExitRoom: new BABYLON.Vector3(0, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene7',
              positionExitRoom: new BABYLON.Vector3(0, -11, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene6 = new CreateCustomScene(parameters6, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene6 ]

        var parameters7 = {
          nameScene: 'scene7',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: '7',
          exits: [
            {
              nameExitRoom: 'scene6',
              positionExitRoom: new BABYLON.Vector3(0, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene7 = new CreateCustomScene(parameters7, scope, engine, canvas)
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
  /*background: rgba(0, 160, 160, 0.75);*/
  width:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #94ccff
}
:root {
  --width: 300px;
}
.hint {
  position: absolute;
  width: var(--width);
  height: 10px;
  top: 0px;
  left: calc((var(--width) / 2) - var(--width));
  font-size: 18pt;
  text-shadow: 0 0 10px #101921, 0 0 15px #0c2638;
  text-align: center;
  color: #dfefff;
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
