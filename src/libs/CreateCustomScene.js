import BABYLON from 'babylonjs'

export default function CreateCustomScene (parameters, scope) {
  var canvas = document.querySelector('#renderCanvas')

  var scene = new BABYLON.Scene(parameters.engine)
  scene.name = parameters.nameScene
  scene.clearColor = new BABYLON.Color4(0.3, 0.3, 0.4, 0.75)

  var skybox = BABYLON.Mesh.CreateBox('skyBox', 100.0, scene)
  var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/skybox/' + parameters.cubeMap + '/', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial

  var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 0, parameters.cameraPosition, scene)
  // scene.showFps()
  camera.setTarget(parameters.cameraTarget)
  // camera.attachControl(canvas, false)
  camera.inertia = 0.5
  camera.lowerRadiusLimit = 40
  camera.upperRadiusLimit = 40
  camera.lowerBetaLimit = 0
  camera.upperBetaLimit = 2.0
  camera.storeState()

  var light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(1, -3, -5), scene)
  light.position = new BABYLON.Vector3(10, 30, 50)
  light.setDirectionToTarget(new BABYLON.Vector3(0, 2, 0))
  light.shadowMinZ = 1
  light.shadowMaxZ = 160
  light.intensity = 1.25
  light.shadowEnabled = true

  var fadeLevel = parameters.fadeLevel
  var postProcess = new BABYLON.PostProcess('Fade', 'fade', ['fadeLevel'], null, 1.0, camera)
  postProcess.onApply = (effect) => {
    effect.setFloat('fadeLevel', fadeLevel)
  }

  scene.isTransitionSceneOff = false
  scene.isTransitionSceneOn = false
  for (var i = 0; i < parameters.exits.length; i++) {
    var exitRoom = BABYLON.MeshBuilder.CreatePlane('exitRoom_' + parameters.exits[i].nameExitRoom, { width: 7, height: 4 })
    exitRoom.position = parameters.exits[i].positionExitRoom
    exitRoom.rotation = parameters.exits[i].rotationExitRoom
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(exitRoom)
    var button = BABYLON.GUI.Button.CreateImageOnlyButton('but_' + parameters.exits[i].nameExitRoom, 'textures/arrowUp.png')
    button.width = 1
    button.height = 1
    button.thickness = 0
    advancedTexture.addControl(button)

    button.onPointerUpObservable.add (function (a, b) {
      scene.isTransitionSceneOff = true
      scope.tempSceneName = b.target.name.split('_')[1]
      scope.onEndTest(false)
    })
  }
  // for (var j = 0; j < parameters.interactiveElements.length; j++) {
  //   var interactiveElement = BABYLON.MeshBuilder.CreatePlane('interactiveElements_' + parameters.interactiveElements[j].nameElement, { width: 7, height: 4 })
  //   interactiveElement.position = parameters.interactiveElements[j].positionElement
  //   interactiveElement.rotation = parameters.interactiveElements[j].rotationElement
  //   // var advancedTextureElement = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(interactiveElement)
  //   var advancedTextureElement = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
  //   var buttonElement = BABYLON.GUI.Button.CreateImageOnlyButton('but_' + parameters.interactiveElements[j].nameElement, 'textures/arrowUp.png')
  //   buttonElement.width = 0.05
  //   buttonElement.height = 0.05
  //   buttonElement.thickness = 0
  //   advancedTextureElement.addControl(buttonElement)
  //
  //   var nodePosition = new BABYLON.AbstractMesh('')
  //   nodePosition.position = parameters.interactiveElements[j].positionElement
  //   buttonElement.linkWithMesh(nodePosition)
  //
  //   buttonElement.onPointerUpObservable.add (function (a, b) {
  //     console.log('!1111111111111')
  //   })
  // }
  BABYLON.Effect.ShadersStore['interactiveElementVertexShader'] = '\r\n' +
    'precision highp float;\r\n' +
    '// Attributes\r\n' +
    'attribute vec3 position;\r\n' +
    'attribute vec2 uv;\r\n' +
    '// Uniforms\r\n' +
    'uniform mat4 worldViewProjection;\r\n' +
    '// Varying\r\n' +
    'varying vec2 vUV;\r\n' +
    'void main(void) {\r\n' +
    '    gl_Position = worldViewProjection * vec4(position, 1.0);\r\n' +
    '    vUV = uv;\r\n' +
    '}\r\n'
  BABYLON.Effect.ShadersStore['interactiveElementFragmentShader'] = '\r\n' +
    'precision highp float;\r\n' +
    'varying vec2 vUV;\r\n' +
    'uniform sampler2D textureSampler;\r\n' +
    'void main(void) {\r\n' +
    '    gl_FragColor = texture2D(textureSampler, vUV);\r\n' +
    // '    if (gl_FragColor.r <= 0.05 ) discard;\r\n' +
    '}\r\n'

  scope.numElements = parameters.interactiveElements.length
  var manager = new BABYLON.GUI.GUI3DManager(scene)
  for (var j = 0; j < parameters.interactiveElements.length; j++) {
    var interactiveElement = BABYLON.MeshBuilder.CreatePlane('interactiveElements_' + parameters.interactiveElements[j].nameElement, { width: 14, height: 14 })
    interactiveElement.setPositionWithLocalVector(parameters.interactiveElements[j].rotationElement)
    interactiveElement.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    interactiveElement.userData = {
      elemnentURL: parameters.interactiveElements[j].url
    }
    var materialButton = new BABYLON.ShaderMaterial('shader', scene, {
      vertex: 'interactiveElement',
      fragment: 'interactiveElement'
    },
    {
      needAlphaBlending: true,
      attributes: ['position', 'normal', 'uv'],
      uniforms: ['world', 'worldView', 'worldViewProjection', 'view', 'projection'],
      samplers: ['textureSampler']
    })
    var elementTexture = new BABYLON.Texture('textures/element.png', scene)
    materialButton.setTexture('textureSampler', elementTexture)

    // var materialButton = new BABYLON.StandardMaterial('materialButton', scene)
    // materialButton.diffuseTexture = new BABYLON.Texture('textures/arrowUp.png', scene)
    // materialButton.specularColor = new BABYLON.Color3(0, 0, 0)
    // materialButton.disableLighting = true
    interactiveElement.material = materialButton
    var nodePosition = new BABYLON.TransformNode('')
    nodePosition.position = parameters.interactiveElements[j].positionElement
    var pushButton = new BABYLON.GUI.MeshButton3D(interactiveElement, 'button3D_' + parameters.interactiveElements[j].nameElement)
    manager.addControl(pushButton)
    pushButton.linkToTransformNode(nodePosition)

    pushButton.onPointerUpObservable.add (function (a, b) {
      if (scope.testStarted) {
        scope.resultTest += 1
        if (!b.target.mesh.visibility) {
          b.target.mesh.visibility = !b.target.mesh.visibility
        }
      } else {
        scope.showModal = true
        scope.nameElement = b.target.mesh.name
        console.log(b.target.mesh.userData.elemnentURL)
        scope.iframe.src = b.target.mesh.userData.elemnentURL
      }
    })
  }

  scene.registerBeforeRender(function () {
    if (scene.isTransitionSceneOff) {
      if (fadeLevel <= 0) {
        scene.isTransitionSceneOff = false
        scope.currentSceneName = scope.tempSceneName
        console.log(scope.currentSceneName)
        camera._restoreStateValues()
        camera.detachControl(canvas)
        fadeLevel = 0
      } else {
        fadeLevel -= 0.1
      }
    } else if (scene.isTransitionSceneOn) {
      if (fadeLevel >= 1) {
        scene.isTransitionSceneOn = false
        fadeLevel = 1
      } else {
        fadeLevel += 0.05
      }
    } else if (scope.testMode && !scope.testStarted) {
      scene.meshes.map(v => {
        if (v.name.search(/interactiveElements\w*/) !== -1) {
          // console.log(v.name)
          v.visibility = false
        }
      })
      scope.testStarted = true
    } else {
      var count = 0
      scene.meshes.map(v => {
        if (v.name.search(/interactiveElements\w*/) !== -1) {
          if (v.visibility) {
            count++
          }
        }
      })
      if (count >= parameters.interactiveElements.length) {
      //  scope.testMode = false
        scope.testStarted = false
        scope.testEnded = !scope.testStarted
      }
    }
  })

  return scene
}
