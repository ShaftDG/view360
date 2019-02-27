<template>
  <div v-if="isVisibleBABYLONScene" id='app'>
    <shaft-navbar :typeMenu="typeMenu"
                  :options="scenes"
                  :selected="currentSceneName"
                  @updateOption="onChangeLocation($event)"
                 >
    </shaft-navbar>
    <div class="button-test-container">
      <shaft-button @click="onDefinitionUser(true)">Начать тест</shaft-button>
      <shaft-button @click="onEndTest(false)">Закончить тест</shaft-button>
    </div>
    <div class="hint" ref="hint" v-if="showHint">
      {{textHint}}
    </div>
    <shaft-modal v-if="showModal"
                 :type="'modal-container'"
                 @close="showModal = false">
      <iframe id="modalIframe" slot="body" :src="iframe.src"
              width="100%" height="100%" frameborder="0" allowfullscreen>
      </iframe>
    </shaft-modal>
    <shaft-modal v-if="testEnded && testMode"
                 :type="'modal-container-congratulations'"
                 @close="onEndTest">
      <div slot="body">
        <h3>{{userName}}, ваш результат:</h3>
        <h3>{{resultTest}} элементов из {{numElements}}</h3>
      </div>
    </shaft-modal>
    <shaft-modal v-if="showUserModal"
                 :type="'modal-container-empty'"
                >
      <div slot="body">
        <form id="form" @submit.prevent="addUser">
          <div class="form-group">
            <input class="" type="text" id="dynamic-label-input" v-model="userName" placeholder="Имя тестируемого" required>
            <label for="dynamic-label-input">Имя тестируемого</label>
          </div>
          <button class="submit" type="submit" @click="addUser">Подтвердить</button>
        </form>
      </div>
    </shaft-modal>
    <div class="test-progress" v-if="showMsg && !testEnded">
      <p>{{greeting}}</p>
      <p>{{numAttempts}}</p>
    </div>
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
import ShaftButton from './components/ShaftButton'
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
      userName: '',
      showUserModal: false,
      numElements: 0,
      resultTest: 0,
      flagClick: false,
      attempts: 0,
      currentSceneName: 'hall',
      scenes: [
        { text: 'коридор', value: 'hall' },
        { text: 'двор', value: 'outside-area' },
        { text: 'кухня', value: 'kitchen' },
        { text: 'гостиная', value: 'living-room' },
        { text: 'детская', value: 'child-room' },
        { text: 'ванная', value: 'bathroom' },
        { text: 'спальня', value: 'bedroom' }
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
      }
    }
  },
  computed: {
    numAttempts: function () {
      return 'Количество попыток: ' + this.attempts
    },
    greeting: function () {
      return 'Найдено ' + this.resultTest + ' элементов из ' + this.numElements
    },
    showMsg: function () {
      return this.testMode
    },
    validation: function () {
      return {
        name: !!this.userName.trim()
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },
  methods: {
    addUser: function () {
      if (this.isValid) {
        this.showUserModal = false
        this.onStartTest(true)
      }
    },
    sendResult: function () {
      if (Base64.extendString) {
        Base64.extendString()
        var data = JSON.stringify({
          username: this.userName.toBase64(),
          location: this.currentSceneName,
          correct_answer: this.resultTest + ' of ' + this.numElements
        })
        console.log(data)
        axios
          .post('http://test5.truetech.by/api/statistic/save', data, {
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
          })
          .then(function (response) {
            console.log(response)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    onClickMouseGlobal: function (e) {

    },
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
    onDefinitionUser (value) {
      this.showUserModal = value
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
        this.attempts = this.numElements * 2
        this.resultTest = 0
      }
    },
    onEndTest (value) {
      if (this.testMode) {
        this.userName = ''
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
    ShaftModal,
    ShaftButton
  },
  created: function () {
    window.addEventListener('mousemove', this.onMoveMouseGlobal)
    window.addEventListener('click', this.onClickMouseGlobal)
  },
  destroyed: function () {
    window.removeEventListener('mousemove', this.onMoveMouseGlobal)
    window.removeEventListener('click',this.onClickMouseGlobal)
  },
  mounted () {
    this.hint = this.$refs.hint
    this.$nextTick(function () {
      // this.changeVisibleVUEView(true)
      if ((this.scenes.length * 160 + 325) > window.innerWidth) {
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
          nameScene: 'outside-area',
          cameraPosition: new BABYLON.Vector3(0, 7, 20),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'outside_area',
          exits: [
            {
              nameExitRoom: 'hall',
              textHint: 'Коридор',
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
              positionExitRoom: new BABYLON.Vector3(808, -431, 399),
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
              nameExitRoom: 'hall',
              textHint: 'Коридор',
              positionExitRoom: new BABYLON.Vector3(-685, -62, 724),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'living-room',
              textHint: 'Гостиная',
              positionExitRoom: new BABYLON.Vector3(-970, -76, 223),
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
            }
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
              nameExitRoom: 'hall',
              textHint: 'Коридор',
              positionExitRoom: new BABYLON.Vector3(-924, -288, 246),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Пеленальный столик',
              positionElement: new BABYLON.Vector3(850, -147, -503),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Детская кровать (прутья)',
              positionElement: new BABYLON.Vector3(-514, -459, -722),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index2.html'
            },
            {
              nameElement: '3',
              textHint: 'Детская кровать (дно)',
              positionElement: new BABYLON.Vector3(-687, -553, -468),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index3.html'
            },
            {
              nameElement: '4',
              textHint: 'Детская кровать (матрац)',
              positionElement: new BABYLON.Vector3(-644, -455, -613),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index4.html'
            },
            {
              nameElement: '5',
              textHint: 'Детская кровать (подушка)',
              positionElement: new BABYLON.Vector3(-640, -218, -735),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index5.html'
            },
            {
              nameElement: '6',
              textHint: 'Детская кровать (одеяло)',
              positionElement: new BABYLON.Vector3(-709, -347, -612),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index6.html'
            },
            {
              nameElement: '7',
              textHint: 'Детская кровать (бортики)',
              positionElement: new BABYLON.Vector3(-513, -186, -838),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index7.html'
            },
            {
              nameElement: '8',
              textHint: 'Коляска',
              positionElement: new BABYLON.Vector3(-171, -303, 936),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index8.html'
            },
            {
              nameElement: '9',
              textHint: 'Обогреватель',
              positionElement: new BABYLON.Vector3(736, 115, -665),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index9.html'
            },
            {
              nameElement: '10',
              textHint: 'увлажнитель? - не знаю, как показать низкую влажность. Это уже как решение',
              positionElement: new BABYLON.Vector3(748, -89, 657),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index10.html'
            },
            {
              nameElement: '11',
              textHint: 'Углы и острая кромка мебели',
              positionElement: new BABYLON.Vector3(906, -134, 396),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index11.html'
            },
            {
              nameElement: '12',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(-863, -492, -93),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index12.html'
            },
            {
              nameElement: '13',
              textHint: 'Провода, удлинитель',
              positionElement: new BABYLON.Vector3(776, 62, 625),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index13.html'
            },
            {
              nameElement: '14',
              textHint: 'Мелкие предметы',
              positionElement: new BABYLON.Vector3(118, -637, 760),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index14.html'
            },
            {
              nameElement: '15',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(384, -183, 904),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index15.html'
            },
            {
              nameElement: '16',
              textHint: 'Окна',
              positionElement: new BABYLON.Vector3(-45, 126, -989),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index16.html'
            },
            {
              nameElement: '17',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(-968, 14, 243),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index17.html'
            },
            {
              nameElement: '18',
              textHint: 'Шторы, портьеры, жалюзи',
              positionElement: new BABYLON.Vector3(602, -23, -797),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index18.html'
            },
            {
              nameElement: '19',
              textHint: 'Радионяня: это тоже уже как решение контроля за состоянием ребенка',
              positionElement: new BABYLON.Vector3(-141, -467, -871),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index19.html'
            },
            {
              nameElement: '20',
              textHint: 'Ночник: это тоже уже как решение контроля за состоянием ребенка',
              positionElement: new BABYLON.Vector3(814, -63, -574),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index20.html'
            },
            {
              nameElement: '21',
              textHint: 'Шезлонг - укачиватель',
              positionElement: new BABYLON.Vector3(914, -381, 129),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index21.html'
            },
            {
              nameElement: '22',
              textHint: 'Кормление (бутылочка с водой или соком, не со смесью)',
              positionElement: new BABYLON.Vector3(757, -315, 570),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index22.html'
            },
            {
              nameElement: '23',
              textHint: 'Точка на коврике на полу - скользкий, ребенок может поскользнуться',
              positionElement: new BABYLON.Vector3(644, -696, -313),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index22.html'
            },
            {
              nameElement: '24',
              textHint: 'Шуфляды в пеленальном столике',
              positionElement: new BABYLON.Vector3(801, -342, -489),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index22.html'
            },
            {
              nameElement: '25',
              textHint: 'Разбросанные игрушки - может на них поскользнуться и упасть',
              positionElement: new BABYLON.Vector3(-705, -707, -21),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/childroom/index22.html'
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
              nameExitRoom: 'hall',
              textHint: 'Коридор',
              positionExitRoom: new BABYLON.Vector3(801, -204, 560),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Пол/коврик',
              positionElement: new BABYLON.Vector3(451, -630, -630),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Вода в ванне',
              positionElement: new BABYLON.Vector3(-519, -340, -782),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index2.html'
            },
            {
              nameElement: '3',
              textHint: 'Кран в ванной',
              positionElement: new BABYLON.Vector3(-725, -283, -629),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index3.html'
            },
            {
              nameElement: '4',
              textHint: 'Резиновые игрушки',
              positionElement: new BABYLON.Vector3(-652, -406, -638),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index4.html'
            },
            {
              nameElement: '5',
              textHint: 'Душевая кабина',
              positionElement: new BABYLON.Vector3(-491, 102, 863),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index5.html'
            },
            {
              nameElement: '6',
              textHint: 'Стиральная машина',
              positionElement: new BABYLON.Vector3(580, -254, -773),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index6.html'
            },
            {
              nameElement: '7',
              textHint: 'Моющие средства',
              positionElement: new BABYLON.Vector3(-696, -706, -116),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index7.html'
            },
            {
              nameElement: '8',
              textHint: 'Косметические средства, лекарства',
              positionElement: new BABYLON.Vector3(554, -71, -828),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index8.html'
            },
            {
              nameElement: '8-1',
              textHint: 'Косметические средства, лекарства',
              positionElement: new BABYLON.Vector3(-146, -131, 979),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index8.html'
            },
            {
              nameElement: '9',
              textHint: 'Унитаз',
              positionElement: new BABYLON.Vector3(-68, -352, -933),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index9.html'
            },
            {
              nameElement: '10',
              textHint: 'Электроприборы',
              positionElement: new BABYLON.Vector3(968, 42, 237),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index10.html'
            },
            {
              nameElement: '11',
              textHint: 'Зеркало, стеклянные полки',
              positionElement: new BABYLON.Vector3(945, 126, -296),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index11.html'
            },
            {
              nameElement: '12',
              textHint: 'Углы и острая кромка мебели',
              positionElement: new BABYLON.Vector3(358, -168, 918),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index12.html'
            },
            {
              nameElement: '13',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(989, -123, 55),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index13.html'
            },
            {
              nameElement: '14',
              textHint: 'Провода, удлинитель',
              positionElement: new BABYLON.Vector3(919, -242, -304),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index14.html'
            },
            {
              nameElement: '15',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(52, -403, 912),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index15.html'
            },
            {
              nameElement: '16',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(824, -5, 564),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index16.html'
            },
            {
              nameElement: '17',
              textHint: 'Средства для чистки труб',
              positionElement: new BABYLON.Vector3(-832, -552, -10),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/bathroom/index7.html'
            }
          ]
        }
        var bathroom = new CreateCustomScene(parameters5, scope, engine, canvas)
        scenesMap = [ ...scenesMap, bathroom ]

        var parameters6 = {
          nameScene: 'hall',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 1,
          cubeMap: 'hall',
          exits: [
            {
              nameExitRoom: 'kitchen',
              textHint: 'Кухня - гостиная',
              positionExitRoom: new BABYLON.Vector3(282, 13, -958),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'bedroom',
              textHint: 'Спальня',
              positionExitRoom: new BABYLON.Vector3(757, 43, -649),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'child-room',
              textHint: 'Детская',
              positionExitRoom: new BABYLON.Vector3(-567, 293, -768),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'bathroom',
              textHint: 'Ванная',
              positionExitRoom: new BABYLON.Vector3(-891, 31, 451),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
            {
              nameExitRoom: 'outside-area',
              textHint: 'Двор',
              positionExitRoom: new BABYLON.Vector3(301, 49, 950),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            },
          ],
          interactiveElements: [
            {
              nameElement: '1',
              textHint: 'Углы и острая кромка мебели',
              positionElement: new BABYLON.Vector3(754, -266, 598),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index1.html'
            },
            {
              nameElement: '2',
              textHint: 'Розетки',
              positionElement: new BABYLON.Vector3(-767, -573, -284),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index2.html'
            },
            {
              nameElement: '3',
              textHint: 'Двери',
              positionElement: new BABYLON.Vector3(-896, -145, 416),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index3.html'
            },
            {
              nameElement: '4',
              textHint: 'Комнатные растения',
              positionElement: new BABYLON.Vector3(-937, -337, 68),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index4.html'
            },
            {
              nameElement: '5',
              textHint: 'Лестница',
              positionElement: new BABYLON.Vector3(-388, -253, -884),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index5.html'
            },
            // {
            //   nameElement: '6',
            //   textHint: 'Провода, удлинитель',
            //   positionElement: new BABYLON.Vector3(, , ),
            //   rotationElement: new BABYLON.Vector3(0, 0, 0),
            //   url: 'modal/hall/index6.html'
            // },
            {
              nameElement: '7',
              textHint: 'Комод, шкаф',
              positionElement: new BABYLON.Vector3(615, -414, 669),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index6.html'
            },
            // {
            //   nameElement: '8',
            //   textHint: 'Шкафчики, шуфляды, ящики',
            //   positionElement: new BABYLON.Vector3(, , ),
            //   rotationElement: new BABYLON.Vector3(0, 0, 0),
            //    url: 'modal/hall/index8.html'
            // },
            {
              nameElement: '9',
              textHint: 'Шкаф-купе с зеркалом',
              positionElement: new BABYLON.Vector3(985, -56, -149),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index7.html'
            },
            {
              nameElement: '10',
              textHint: 'Мамина сумка',
              positionElement: new BABYLON.Vector3(-527, -250, 810),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index8.html'
            },
            {
              nameElement: '11',
              textHint: 'Полка или столик с ключами и всякой мелочью, прибита невысоко',
              positionElement: new BABYLON.Vector3(717, -377, 583),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index9.html'
            },
            {
              nameElement: '12',
              textHint: 'Кошачья миска с кормом',
              positionElement: new BABYLON.Vector3(-323, -556, -763),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index10.html'
            },
            {
              nameElement: '13',
              textHint: 'Кошачий лоток',
              positionElement: new BABYLON.Vector3(-617, -567, -542),
              rotationElement: new BABYLON.Vector3(0, 0, 0),
              url: 'modal/hall/index11.html'
            },
          ]
        }
        var scene6 = new CreateCustomScene(parameters6, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene6 ]

        var parameters7 = {
          nameScene: 'bedroom',
          cameraPosition: new BABYLON.Vector3(-20, 7, 0),
          cameraTarget: new BABYLON.Vector3(0, 0, 0),
          fadeLevel: 0,
          cubeMap: 'bedroom',
          exits: [
            {
              nameExitRoom: 'hall',
              textHint: 'Коридор',
              positionExitRoom: new BABYLON.Vector3(0, -11, -940),
              rotationExitRoom: new BABYLON.Vector3(0, 0, 0)
            }
          ],
          interactiveElements: []
        }
        var scene7 = new CreateCustomScene(parameters7, scope, engine, canvas)
        scenesMap = [ ...scenesMap, scene7 ]

        scope.currentScene = scene6
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
          if ((scope.scenes.length * 160 + 325) >  window.innerWidth) {
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
  font-family: '微软雅黑',arail;
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

p {
  margin: 5px 0 5px 0;
}

.button-test-container {
  position: relative;
  float:left;
  width: 75%;
  max-width: 320px;
  top: 0;
  left: 0;
  text-align: left;
}

.test-progress {
  position: fixed;
  width: 100%;
  bottom: 20px;
  left: 0;
  font-size: 16pt;
  text-shadow: 0 0 10px #530018, 0 0 15px #6a0008;
  text-align: center;
  color: #dfefff;
}

.errors {
  color: #f00;
}

*:focus {outline: none;}

form {
  max-width: 50rem;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-group {
  position: relative;
  padding-top: 0.75rem;
}

::placeholder {
  color: #406f97;
}

button {
  width: 100%;
  margin-top: 10px;
}

label {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  opacity: 1;
  transform: translateY(-7px);
  transition: all 0.2s ease-out;
  color: #d6f7ff;
  text-shadow: 0 0 10px #407496, 0 0 15px #5891cb;
}

input{
  height: 20px;
  padding: 5px 8px;
  color: #102029;
  border:1px solid #6eb6fe;
  box-shadow: 0px 0px 3px #32647f, 0 10px 15px #ffffff inset;
  border-radius:2px;
}

input:placeholder-shown + label {
  opacity: 0;
  transform: translateY(0);
}

input:focus {
  background: #fff;
  border:1px solid #4187a7;
  box-shadow: 0 0 10px #56b9e3;
}

input:focus:invalid { /* when a field is considered invalid by the browser */
  background: #fff;
  box-shadow: 0 0 10px #d45252;
  border-color: #e24545
}

input:focus:invalid::placeholder {
  color: #f05b58;
}

input:required:valid { /* when a field is considered valid by the browser */
  background: #fff;
  border:1px solid #4084a3;
  box-shadow: 0 0 10px #56b9e3;
}

/* Button Style */
button.submit {
  background-color: #4c95b1;
  background: -webkit-gradient(linear, left top, left bottom, from(#549db1), to(#447b91));
  background: -webkit-linear-gradient(top, #549db1, #447b91);
  background: -moz-linear-gradient(top, #549db1, #447b91);
  background: -ms-linear-gradient(top, #549db1, #447b91);
  background: -o-linear-gradient(top, #549db1, #447b91);
  background: linear-gradient(top, #549db1, #447b91);
  border: 1px solid #447b91;
  border-bottom: 1px solid #4c89a1;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  box-shadow: inset 0 1px 0 0 #80c7d5;
  -webkit-box-shadow: 0 1px 0 0 #80c7d5 inset ;
  -moz-box-shadow: 0 1px 0 0 #80c7d5 inset;
  -ms-box-shadow: 0 1px 0 0 #80c7d5 inset;
  -o-box-shadow: 0 1px 0 0 #80c7d5 inset;
  color: white;
  font-weight: bold;
  padding: 6px 20px;
  text-align: center;
  text-shadow: 0 0 10px #3da3c3;
}
button.submit:hover {
  opacity:.85;
  cursor: pointer;
}
button.submit:active {
  border: 1px solid #237491;
  box-shadow: 0 0 10px 5px #13476b inset;
  -webkit-box-shadow:0 0 10px 5px #13476b inset ;
  -moz-box-shadow: 0 0 10px 5px #13476b inset;
  -ms-box-shadow: 0 0 10px 5px #13476b inset;
  -o-box-shadow: 0 0 10px 5px #13476b inset;
}

#nav {
  padding: 30px
}

#nav a {
  font-weight: bold;
  color: #759fcb
}

</style>
