import BABYLON from 'babylonjs'
export default function AnimationArrow (target, duration, scene) {
  var object = this
  var animationPosition = new BABYLON.Animation('animationPosition', 'position', 1, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)

  // the object destination position
  var nextPos = target

  // Animation keys
  var keysTorus = []
  keysTorus.push({ frame: 0, value: object.position })
  keysTorus.push({ frame: 60, value: nextPos })
  animationPosition.setKeys(keysTorus)

  // Adding an easing function
  // You can use :
  // 1.	CircleEase()
  // 2.	BackEase(amplitude)
  // 3.	BounceEase(bounces, bounciness)
  // 4.	CubicEase()
  // 5.	ElasticEase(oscillations, springiness)
  // 6.	ExponentialEase(exponent)
  // 7.	PowerEase(power)
  // 8.	QuadraticEase()
  // 9.	QuarticEase()
  // 10.	QuinticEase()
  // 11.	SineEase()
  // And if you want a total control, you can use a Bezier Curve animationPosition
  // 12.   BezierCurveEase(x1, y1, x2, y2)
  var easingFunction = new BABYLON.CubicEase()

  // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)

  // Adding easing function to my animationPosition
  animationPosition.setEasingFunction(easingFunction)

  var animationOpacity = new BABYLON.Animation('animationOpacity', 'material.alpha', 1, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)

  // the object destination position
  var nextOpacity = 0.0

  // Animation keys
  var keysOpacity = []
  keysOpacity.push({ frame: 40, value: object.material.alpha })
  keysOpacity.push({ frame: 60, value: nextOpacity })
  animationOpacity.setKeys(keysOpacity)

  var easingFunctionOpacity = new BABYLON.QuinticEase()

  // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
  easingFunctionOpacity.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT)

  // Adding easing function to my animationPosition
  animationOpacity.setEasingFunction(easingFunctionOpacity)

  // Adding animationPosition to my object animations collection
  object.animations = []
  object.animations.push(animationPosition)
  object.animations.push(animationOpacity)

  // Finally, launch animations on object, from key 0 to key 120 with loop activated
  var anim = scene.beginAnimation(object, 0, 60, true, duration)
  return anim
}
