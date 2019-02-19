import BABYLON from 'babylonjs'
import AnimationArrow from './AnimationArrow'

export default function CreateCustomScene (parameters, scope, engine, canvas) {

  var scene = new BABYLON.Scene(engine)
  scene.name = parameters.nameScene
  scene.clearColor = new BABYLON.Color4(0.3, 0.3, 0.4, 0.75)

  var skybox = BABYLON.MeshBuilder.CreateSphere('skyBox', { diameter: 2000 }, scene)
  skybox.isPickable = false
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
  camera.fov = 1.3
  camera.inertia = 0.5
  camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius
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
  scene.userData = {
    buttons: []
  }
  for (var i = 0; i < parameters.exits.length; i++) {
    var exitRoom = BABYLON.MeshBuilder.CreatePlane('exitRoom_' + parameters.exits[i].nameExitRoom, { width: 100, height: 80 })
    exitRoom.position = parameters.exits[i].positionExitRoom
    exitRoom.rotation = parameters.exits[i].rotationExitRoom
    exitRoom.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    exitRoom.renderingGroupId = 1
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(exitRoom)
    var button = BABYLON.GUI.Button.CreateImageOnlyButton('but_' + parameters.exits[i].nameExitRoom, 'textures/arrowUp.png')
    button.width = 1
    button.height = 1
    button.thickness = 0
    advancedTexture.addControl(button)
    // button.hoverCursor = 'pointer'
    // button.isPointerBlocker = true
    button.isEnabled = false
    scene.userData.buttons.push(button)
    var animation = AnimationArrow.call(exitRoom, new BABYLON.Vector3(exitRoom.position.x, exitRoom.position.y + 30, exitRoom.position.z), 30, scene)
    button.userData = {
      meshPlane: exitRoom,
      animation: animation,
      textHint: parameters.exits[i].textHint
    }

    button.onPointerEnterObservable.add(function (a, b) {
      if (b.target.userData) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5)
        scope.showHint = true
        // var stirng = b.target.userData.meshPlane.name
        // scope.textHint = stirng.split('_')[1].replace('-', ' ')
        scope.textHint = b.target.userData.textHint
      }
      // b.target.userData.animation.stop()
    })
    button.onPointerOutObservable.add(function (a, b) {
      if (b.target.userData) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0)
        scope.showHint = false
      }
      // b.target.userData.animation.res()
    })

    button.onPointerClickObservable.add (function (a, b) {
      scope.showHint = false
      scene.isTransitionSceneOff = true
      scope.tempSceneName = b.target.name.split('_')[1]
      scope.onEndTest(false)
    })
  }

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
    var interactiveElement = BABYLON.MeshBuilder.CreatePlane('interactiveElements_' + parameters.interactiveElements[j].nameElement, { width: 150, height: 150 })
    interactiveElement.setPositionWithLocalVector(parameters.interactiveElements[j].rotationElement)
    interactiveElement.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    interactiveElement.renderingGroupId = 1
    interactiveElement.userData = {
      elemnentURL: parameters.interactiveElements[j].url,
      textHint: parameters.interactiveElements[j].textHint
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
    pushButton.isEnabled = false
    scene.userData.buttons.push(pushButton)
    pushButton.onPointerEnterObservable.add(function (a, b) {
      if (b.target.mesh && b.target.isEnabled) {
        b.target.mesh.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1)
        scope.showHint = true
        // var string = b.target.mesh.name
        // scope.textHint = string.split('_')[1].replace('-', ' ')
        scope.textHint = b.target.mesh.userData.textHint
      }
    })
    pushButton.onPointerOutObservable.add(function (a, b) {
      if (b.target.mesh && b.target.isEnabled) {
        b.target.mesh.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0)
        scope.showHint = false
      }
    })

    pushButton.onPointerUpObservable.add (function (a, b) {
      if (b.target.isEnabled) {
        if (scope.testStarted) {
          scope.resultTest += 1
          if (!b.target.mesh.visibility) {
            b.target.mesh.visibility = !b.target.mesh.visibility
          }
        } else {
          scope.showHint = false
          scope.showModal = true
          scope.nameElement = b.target.mesh.name
          console.log(b.target.mesh.userData.elemnentURL)
          scope.iframe.src = b.target.mesh.userData.elemnentURL
        }
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
        scene.userData.buttons.map(v => {
          v.isEnabled = false
        })
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

  // var onPointerDown = function (evt) {
  //   if (evt.button !== 0) {
  //     return
  //   }
  //
  //   // check if we are under a mesh
  //   var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh === skybox })
  //   if (pickInfo.hit && scene.name === scope.currentSceneName) {
  //     console.log(scene.name, pickInfo.pickedPoint)
  //   }
  // }
  // canvas.addEventListener('pointerdown', onPointerDown, false)
  return scene
}
