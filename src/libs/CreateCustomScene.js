import AnimationArrow from './AnimationArrow'

export default function CreateCustomScene (parameters, scope, engine, canvas) {
  var baseUrlTextures = 'textures/skybox/'
  if (scope.isMobile) {
    baseUrlTextures = 'textures/skybox/mobile/'
  }
  var scene = new BABYLON.Scene(engine)
  scene.name = parameters.nameScene
  // scene.database = new BABYLON.Database(scene.name, function (evt) {console.log(evt)})
  scene.clearColor = new BABYLON.Color4(0.3, 0.3, 0.4, 0.75)
  var skybox = BABYLON.MeshBuilder.CreateSphere('skyBox', { diameter: 2000, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene)
  skybox.isPickable = false
  var skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  // skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/skybox/preview/' + parameters.nameScene + '/', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.disableLighting = true
  skybox.material = skyboxMaterial

  var camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 0, parameters.cameraPosition, scene)
  camera.maxZ = 1500
  // scene.showFps()
  camera.setTarget(parameters.cameraTarget)
  // camera.attachControl(canvas, false)
  camera.fov = 1.4
  camera.inertia = 0.75
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
    buttons: [],
    skybox: skybox
  }

  var setHintPosition = function (mesh) {
    let transformationMatrix = camera.getViewMatrix().multiply(camera.getProjectionMatrix())
    let position = mesh.getBoundingInfo().boundingBox.center
    let projectedPosition = BABYLON.Vector3.Project(position, mesh.computeWorldMatrix(true), transformationMatrix, camera.viewport.toGlobal(camera.getEngine()))
    scope.positionHint.x = projectedPosition.x
    scope.positionHint.y = projectedPosition.y
  }

  for (var i = 0; i < parameters.exits.length; i++) {
    var exitRoom = BABYLON.MeshBuilder.CreatePlane('exitRoom_' + parameters.exits[i].nameExitRoom, { width: 200, height: 160 })
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
    var animation = AnimationArrow.call(exitRoom, new BABYLON.Vector3(exitRoom.position.x + parameters.exits[i].animation.x, exitRoom.position.y + parameters.exits[i].animation.y, exitRoom.position.z), 30, scene)
    button.userData = {
      meshPlane: exitRoom,
      animation: animation,
      textHint: parameters.exits[i].textHint
    }

    button.onPointerMoveObservable.add(function (a, b) {
      if (b.target.userData && !scope.testMode && !scope.showHint) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5)
        scope.showHint = true
        scope.textHint = b.target.userData.textHint
        setHintPosition(b.target.userData.meshPlane)
      }
    })
    button.onPointerOutObservable.add(function (a, b) {
      if (b.target.userData && !scope.testMode) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0)
        scope.showHint = false
      }
    })

    button.onPointerClickObservable.add (function (a, b) {
      if (b.target.userData && b.target.userData.meshPlane.visibility) {
        scope.showHint = false
        scene.isTransitionSceneOff = true
        scope.tempSceneName = b.target.name.split('_')[1]
        scope.onEndTest(false)
      }
    })
  }

  scope.numElements = parameters.interactiveElements.length
  for (var j = 0; j < parameters.interactiveElements.length; j++) {
    var interactiveElement = BABYLON.MeshBuilder.CreatePlane('interactiveElements_' + parameters.interactiveElements[j].nameElement, { width: 150, height: 150 })
    interactiveElement.position = parameters.interactiveElements[j].positionElement
    interactiveElement.rotation = parameters.interactiveElements[j].rotationElement
    interactiveElement.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
    interactiveElement.renderingGroupId = 1
    var advancedTextureElement = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(interactiveElement)
    var buttonElement = BABYLON.GUI.Button.CreateImageOnlyButton('butElement_' + parameters.interactiveElements[j].nameElement, 'textures/element.png')
    if (parameters.interactiveElements[j].nameElement.search(/green\w*/) !== -1) {
      buttonElement = BABYLON.GUI.Button.CreateImageOnlyButton('butElement_' + parameters.interactiveElements[j].nameElement, 'textures/elementGreen.png')
    }
    buttonElement.width = 1
    buttonElement.height = 1
    buttonElement.thickness = 0
    advancedTextureElement.addControl(buttonElement)
    // buttonElement.hoverCursor = 'pointer'
    // buttonElement.isPointerBlocker = true
    buttonElement.isEnabled = false
    scene.userData.buttons.push(buttonElement)
    buttonElement.userData = {
      meshPlane: interactiveElement,
      elemnentURL: parameters.interactiveElements[j].url,
      textHint: parameters.interactiveElements[j].textHint
    }

    buttonElement.onPointerMoveObservable.add(function (a, b) {
      if (b.target.userData && !scope.testMode && !scope.showHint) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5)
        scope.showHint = true
        scope.textHint = b.target.userData.textHint
        setHintPosition(b.target.userData.meshPlane)
      }
    })

    buttonElement.onPointerOutObservable.add(function (a, b) {
      if (b.target.userData && !scope.testMode) {
        b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0)
        scope.showHint = false
      }
    })

    buttonElement.onPointerClickObservable.add (function (a, b) {
      if (b.target.isEnabled) {
        if (scope.testStarted) {
          if (b.target.userData && !b.target.userData.meshPlane.visibility) {
            b.target.userData.meshPlane.visibility = !b.target.userData.meshPlane.visibility
            scope.resultTest += 1
            if (scope.resultTest >= parameters.interactiveElements.length && scope.testStarted) {
              finishTest()
            }
          }
        } else {
          scope.showModal = true
          scope.showHint = false
          b.target.userData.meshPlane.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0)
          scope.nameElement = b.target.name
          scope.iframe.src = b.target.userData.elemnentURL
        }
      }
    })
  }

  var finishTest = function () {
    scope.showHint = false
    scope.attempts = parameters.interactiveElements.length * 2
    scope.testStarted = false
    scope.testEnded = !scope.testStarted
    scope.sendResult()
  }

  var flag = false
  var flag1 = false
  window.addEventListener('pointerdown', function () {
    flag = true
    flag1 = true
  }, false)
  window.addEventListener('pointermove', function () {
    if (flag1 && scope.showHint && !scope.isMobile) {
      scope.showHint = false
    }
    flag = false
  }, false)
  window.addEventListener('pointerup', function (e) {
    flag1 = false
    if (flag) {
      if (scope.testStarted && scene.name === scope.currentSceneName) {
        scope.attempts -= 1
        if (scope.attempts <= 0 && scope.testStarted) {
          finishTest()
        }
      }
    }
  }, false)

  scene.registerBeforeRender(function () {
    if (scene.isTransitionSceneOff) {
      if (fadeLevel <= 0) {
        scene.isTransitionSceneOff = false
        scope.showLoader = true
        scope.currentSceneName = scope.tempSceneName
        camera._restoreStateValues()
        camera.detachControl(canvas)
        scene.userData.buttons.map(v => {
          v.isEnabled = false
        })
        fadeLevel = 0
        scope.showHint = false
      } else {
        fadeLevel -= 0.1
      }
    } else if (scene.isTransitionSceneOn) {
      if (fadeLevel >= 1) {
        scene.isTransitionSceneOn = false
        fadeLevel = 1
        var mainTexture = new BABYLON.CubeTexture(baseUrlTextures + scene.name + '/', scene, null, null, null, function () {
          scope.showLoader = false
          scene.userData.skybox.material.reflectionTexture = mainTexture
          scene.userData.skybox.material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
        })
      } else {
        fadeLevel += 0.05
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
