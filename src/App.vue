<template>
  <div v-if="isVisibleBABYLONScene" id='app'>
    <!--<shaft-elastic-header-->
      <!--:startMove="currentScene"-->
    <!--&gt;-->
      <!--<template slot="header">-->
        <!--&lt;!&ndash;<router-view&ndash;&gt;-->
          <!--&lt;!&ndash;:location="currentSceneName"&ndash;&gt;-->
          <!--&lt;!&ndash;:locations="scenes"&ndash;&gt;-->
          <!--&lt;!&ndash;@selectedLocation="onChangeLocation"&ndash;&gt;-->
          <!--&lt;!&ndash;@onStartTest="onStartTest"&ndash;&gt;-->
          <!--&lt;!&ndash;@onEndTest="onEndTest"&ndash;&gt;-->
          <!--&lt;!&ndash;:resultTest="resultTest"&ndash;&gt;-->
          <!--&lt;!&ndash;:numElements="numElements"&ndash;&gt;-->
          <!--&lt;!&ndash;:testMode="testMode"&ndash;&gt;-->
        <!--&lt;!&ndash;/>&ndash;&gt;-->

        <!--<p v-if="showMsg">{{greeting}}</p>-->
        <!--&lt;!&ndash;<shaft-button @click="onStartTest(true)">Begin test</shaft-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<shaft-button @click="onEndTest(false)">End test</shaft-button>&ndash;&gt;-->
        <!--&lt;!&ndash;<shaft-dropdown :options="locations"&ndash;&gt;-->
        <!--&lt;!&ndash;:selected="location"&ndash;&gt;-->
        <!--&lt;!&ndash;@updateOption="onChange($event)"&ndash;&gt;-->
        <!--&lt;!&ndash;:placeholder="'Select an Item'">&ndash;&gt;-->
        <!--&lt;!&ndash;</shaft-dropdown>&ndash;&gt;-->
        <!--<shaft-navbar :options="scenes"-->
                      <!--:selected="currentSceneName"-->
                      <!--@updateOption="onChangeLocation($event)"-->
                      <!--:placeholder="'Select an Item'">-->
        <!--</shaft-navbar>-->
      <!--</template>-->
      <!--&lt;!&ndash;<template slot="content"></template>&ndash;&gt;-->
    <!--</shaft-elastic-header>-->
    <p v-if="showMsg">{{greeting}}</p>
    <!--<shaft-button @click="onStartTest(true)">Begin test</shaft-button>-->
    <!--<shaft-button @click="onEndTest(false)">End test</shaft-button>-->
    <shaft-navbar :typeMenu="typeMenu"
                  :options="scenes"
                  :selected="currentSceneName"
                  @updateOption="onChangeLocation($event)"
                 >
    </shaft-navbar>
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
      <!--<h3 slot="header">{{nameElement}}</h3>-->
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

      {{ info }}

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
import ShaftModal from './components/ShaftModal'
import { Base64 } from 'js-base64'
import axios from 'axios'

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
        { text: 'гостиная', value: 'living-room' },
        { text: 'кухня', value: 'kitchen' },
        { text: 'детская', value: 'child-room' },
        { text: 'ванная', value: 'bathroom' },
        { text: 'scene6', value: 'scene6' },
        { text: 'scene7', value: 'scene7' }
      ],
      typeMenu: 'horizontal',
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
      },
      info: null
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
    ShaftNavbar,
    ShaftModal
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

      if (Base64.extendString) {
        Base64.extendString();
      //   // once extended, you can do the following
      //   console.log('shaft'.toBase64())       // ZGFua29nYWk=
      //   console.log('小飼弾'.toBase64())         // 5bCP6aO85by+
      //   console.log('小飼弾'.toBase64(true))     // 5bCP6aO85by-
      //   console.log('小飼弾'.toBase64URI())     // 5bCP6aO85by-
      //   console.log('ZGFua29nYWk='.fromBase64()) // dankogai
      //   console.log('5bCP6aO85by+'.fromBase64()) // 小飼弾
      //   console.log('5bCP6aO85by-'.fromBase64()) // 小飼弾
        var userName = 'shaft'
        axios
          .post('https://reqres.in/api/users', { 'name': userName.toBase64(), 'job': 'garden' })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
      }

      if ((this.scenes.length * 160 + 100) > screen.width) {
        this.typeMenu = 'vertical'
      } else {
        this.typeMenu = 'horizontal'
      }
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
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 1,
          cubeMap: '1',
          exits: [
            {
              nameExitRoom: 'kitchen',
              textHint: 'Кухня',
              positionExitRoom: new BABYLON.Vector3(-5, -13, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: 'tv',
              textHint: 'tv',
              positionElement: new BABYLON.Vector3(-940, 0, 24),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'http://81.25.47.128/JewelSlot/'
            },
            {
              nameElement: 'bed',
              textHint: 'bed',
              positionElement: new BABYLON.Vector3(940, -20, 46),
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
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'living_room',
          exits: [
            {
              nameExitRoom: 'kitchen',
              textHint: 'Кухня',
              positionExitRoom: new BABYLON.Vector3(940, -11, -4),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Углы и острая кромка мебели',
              positionElement: new BABYLON.Vector3(-355, -232, 904),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(894, -256, -364),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index2.html'
            },
            {
              nameElement: '3',
              textHint: 'Провода, удлинитель',
              positionElement: new BABYLON.Vector3(33, -392, -917),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index3.html'
            },
            {
              nameElement: '4',
              textHint: 'Мелкие предметы',
              positionElement: new BABYLON.Vector3(507, -556, -657),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index4.html'
            },
            {
              nameElement: '5',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(229, -299, 924),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index5.html'
            },
            {
              nameElement: '6',
              textHint: 'Окна',
              positionElement: new BABYLON.Vector3(-951, 214, -214),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index6.html'
            },
            {
              nameElement: '7',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(867, 13, 495),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index7.html'
            },
            {
              nameElement: '8',
              textHint: 'Телевизор',
              positionElement: new BABYLON.Vector3(796, -60, -601),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index8.html'
            },
            // {
            //   nameElement: '9',
            //   textHint: 'Шторы, портьеры, жалюзи',
            //   positionElement: new BABYLON.Vector3(-363, -777, -512),
            //   rotationElement: new BABYLON.Vector3(0, 0, 0),
            //   url: 'modal/livingroom/index9.html'
            // },
            {
              nameElement: '10',
              textHint: 'Камин',
              positionElement: new BABYLON.Vector3(929, -361, -79),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index10.html'
            },
            {
              nameElement: '11',
              textHint: 'Рабочее место (компьютер)',
              positionElement: new BABYLON.Vector3(-520, -49, 851),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index11.html'
            },
            {
              nameElement: '12',
              textHint: 'Комнатные растения',
              positionElement: new BABYLON.Vector3(171, -319, -931),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index12.html'
            },
            {
              nameElement: '13',
              textHint: 'Шкафчики, шуфляды, ящики',
              positionElement: new BABYLON.Vector3(642, -346, -682),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index13.html'
            }
          ]
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
              textHint: 'scene1',
              positionExitRoom: new BABYLON.Vector3(100, -22, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'living-room',
              textHint: 'Гостиная',
              positionExitRoom: new BABYLON.Vector3(-940, -11, -20),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'child-room',
              textHint: 'Детская',
              positionExitRoom: new BABYLON.Vector3(940, -11, -25),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Столы и рабочие поверхности ',
              positionElement: new BABYLON.Vector3(756, -146, -634),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Кухонные приборы на столе (стерилизатор)',
              positionElement: new BABYLON.Vector3(991, -126, -3),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index2.html'
            },
            {
              nameElement: '3',
              textHint: 'Кухонный стол',
              positionElement: new BABYLON.Vector3(-843, -323, -426),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index3.html'
            },
            {
              nameElement: '4',
              textHint: 'Шкафчики, шуфляды, ящики',
              positionElement: new BABYLON.Vector3(886, -387, -251),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index4.html'
            },
            {
              nameElement: '5',
              textHint: 'Кухонная плита',
              positionElement: new BABYLON.Vector3(885, -157, -436),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index5.html'
            },
            {
              nameElement: '6',
              textHint: 'Холодильник',
              positionElement: new BABYLON.Vector3(-90, -3, 996),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index6.html'
            },
            {
              nameElement: '7',
              textHint: 'Мусорное ведро',
              positionElement: new BABYLON.Vector3(686, -395, -609),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index7.html'
            },
            {
              nameElement: '8',
              textHint: 'Стульчик для кормления',
              positionElement: new BABYLON.Vector3(247, -290, -924),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index8.html'
            },
            {
              nameElement: '9',
              textHint: 'Посуда',
              positionElement: new BABYLON.Vector3(768, -87, 632),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index9.html'
            },
            // {
            //   nameElement: '10',
            //   textHint: '',
            //   positionElement: new BABYLON.Vector3(1000, 1000, 1000),
            //   rotationElement: new BABYLON.Vector3(0, 0, 0),
            //   url: 'modal/kitchen/index10.html'
            // },
            {
              nameElement: '11',
              textHint: 'Окна',
              positionElement: new BABYLON.Vector3(308, 305, -899),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index11.html'
            },
            {
              nameElement: '12',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(-631, 89, 769),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index12.html'
            },
            {
              nameElement: '13',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(842, 14, 538),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index13.html'
            },
            {
              nameElement: '14',
              textHint: 'Духовой шкаф',
              positionElement: new BABYLON.Vector3(355, -99, 929),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/kitchen/index14.html'
            },
          ]
        }
        var scene3 = new CreateCustomScene(parameters3, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene3 ]

        var parameters4 = {
          nameScene: 'child-room',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'child_room',
          exits: [
            {
              nameExitRoom: 'kitchen',
              textHint: 'Кухня',
              positionExitRoom: new BABYLON.Vector3(-940, -11, 0),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'bathroom',
              textHint: 'Ванная',
              positionExitRoom: new BABYLON.Vector3(10, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Пеленальный столик',
              positionElement: new BABYLON.Vector3(850, -147, -503),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Детская кровать (прутья)',
              positionElement: new BABYLON.Vector3(-514, -459, -722),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '3',
              textHint: 'Детская кровать (дно)',
              positionElement: new BABYLON.Vector3(-687, -553, -468),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '4',
              textHint: 'Детская кровать (матрац)',
              positionElement: new BABYLON.Vector3(-644, -455, -613),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '5',
              textHint: 'Детская кровать (подушка)',
              positionElement: new BABYLON.Vector3(-640, -218, -735),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '6',
              textHint: 'Детская кровать (одеяло)',
              positionElement: new BABYLON.Vector3(-709, -347, -612),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '7',
              textHint: 'Детская кровать (бортики)',
              positionElement: new BABYLON.Vector3(-513, -186, -838),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '8',
              textHint: 'Коляска',
              positionElement: new BABYLON.Vector3(-171, -303, 936),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '9',
              textHint: 'Обогреватель',
              positionElement: new BABYLON.Vector3(736, 115, -665),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '10',
              textHint: 'увлажнитель? - не знаю, как показать низкую влажность. Это уже как решение',
              positionElement: new BABYLON.Vector3(748, -89, 657),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '11',
              textHint: 'Угля и острая кромка мебели',
              positionElement: new BABYLON.Vector3(906, -134, 396),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '12',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(-863, -492, -93),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '13',
              textHint: 'Провода, удлинитель',
              positionElement: new BABYLON.Vector3(776, 62, 625),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '14',
              textHint: 'Мелкие предметы',
              positionElement: new BABYLON.Vector3(118, -637, 760),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '15',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(384, -183, 904),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '16',
              textHint: 'Окна',
              positionElement: new BABYLON.Vector3(-45, 126, -989),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '17',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(-968, 14, 243),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '18',
              textHint: 'Шторы, портьеры, жалюзи',
              positionElement: new BABYLON.Vector3(602, -23, -797),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '19',
              textHint: 'Радионяня: это тоже уже как решение контроля за состоянием ребенка',
              positionElement: new BABYLON.Vector3(-141, -467, -871),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '20',
              textHint: 'Ночник: это тоже уже как решение контроля за состоянием ребенка',
              positionElement: new BABYLON.Vector3(814, -63, -574),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '21',
              textHint: 'Шезлонг - укачиватель',
              positionElement: new BABYLON.Vector3(914, -381, 129),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '22',
              textHint: 'Кормление (бутылочка с водой или соком, не со смесью)',
              positionElement: new BABYLON.Vector3(757, -315, 570),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '23',
              textHint: 'Точка на коврике на полу - скользкий, ребенок может поскользнуться',
              positionElement: new BABYLON.Vector3(644, -696, -313),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '24',
              textHint: 'Шуфляды в пеленальном столике',
              positionElement: new BABYLON.Vector3(801, -342, -489),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '25',
              textHint: 'Разбросанные игрушки - может на них поскользнуться и упасть',
              positionElement: new BABYLON.Vector3(-705, -707, -21),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            }
          ]
        }
        var scene4 = new CreateCustomScene(parameters4, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene4 ]

        var parameters5 = {
          nameScene: 'bathroom',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'bathroom',
          exits: [
            {
              nameExitRoom: 'child-room',
              textHint: 'Детская',
              positionExitRoom: new BABYLON.Vector3(15, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene6',
              textHint: 'scene6',
              positionExitRoom: new BABYLON.Vector3(15, -11, 940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Пол/коврик',
              positionElement: new BABYLON.Vector3(451, -630, -630),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Вода в ванне',
              positionElement: new BABYLON.Vector3(-519, -340, -782),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '3',
              textHint: 'Кран в ванной',
              positionElement: new BABYLON.Vector3(-725, -283, -629),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '4',
              textHint: 'Резиновые игрушки',
              positionElement: new BABYLON.Vector3(-652, -406, -638),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '5',
              textHint: 'Душевая кабина',
              positionElement: new BABYLON.Vector3(-491, 102, 863),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '6',
              textHint: 'Стиральная машина',
              positionElement: new BABYLON.Vector3(580, -254, -773),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '7',
              textHint: 'Моющие средства',
              positionElement: new BABYLON.Vector3(-696, -706, -116),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '8',
              textHint: 'Косметические средства, лекарства',
              positionElement: new BABYLON.Vector3(554, -71, -828),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '8-1',
              textHint: 'Косметические средства, лекарства',
              positionElement: new BABYLON.Vector3(-146, -131, 979),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '9',
              textHint: 'Унитаз',
              positionElement: new BABYLON.Vector3(-68, -352, -933),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '10',
              textHint: 'Электроприборы',
              positionElement: new BABYLON.Vector3(968, 42, 237),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '11',
              textHint: 'Зеркало, стеклянные полки',
              positionElement: new BABYLON.Vector3(945, 126, -296),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '12',
              textHint: 'Углы и острая кромка мебели',
              positionElement: new BABYLON.Vector3(358, -168, 918),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '13',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(989, -123, 55),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '14',
              textHint: 'Провода, удлинитель',
              positionElement: new BABYLON.Vector3(919, -242, -304),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '15',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(52, -403, 912),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '16',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(824, -5, 564),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            },
            {
              nameElement: '17',
              textHint: 'Средства для чистки труб',
              positionElement: new BABYLON.Vector3(-832, -552, -10),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/livingroom/index1.html'
            }
          ]
        }
        var bathroom = new CreateCustomScene(parameters5, scope, engine, canvas)
        scenesMap = [ ...scenesMap, bathroom ]

        var parameters6 = {
          nameScene: 'scene6',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: '6',
          exits: [
            {
              nameExitRoom: 'bathroom',
              textHint: 'Ванная',
              positionExitRoom: new BABYLON.Vector3(0, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'scene7',
              textHint: 'scene7',
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
              textHint: 'scene6',
              positionExitRoom: new BABYLON.Vector3(0, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene7 = new CreateCustomScene(parameters7, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene7 ]

        scope.currentScene = scene1
        scope.currentScene.userData.buttons.map(v => {
          v.isEnabled = true
        })
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
                scope.currentScene.userData.buttons.map(v => {
                  v.isEnabled = true
                })
                scope.currentScene.activeCamera.attachControl(canvas, false)
                scope.currentScene.isTransitionSceneOn = true
              }
            })
          }
          scope.currentScene.render()
        })
        window.addEventListener('resize', function () {
          engine.resize()
          if ((scope.scenes.length * 160 + 100) > screen.width) {
            scope.typeMenu = 'vertical'
          } else {
            scope.typeMenu = 'horizontal'
          }
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
  --width: 100%;
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
