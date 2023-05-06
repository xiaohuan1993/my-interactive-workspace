import * as THREE from 'three';
import { TWEEN } from '/node_modules/three/examples/jsm/libs/tween.module.min.js';
import { CAMERA_CONFIG, CAMERA_FOCUS_POSITION_CONFIG, FOCUSED_MODE_CAMERA_CONFIG, ORBIT_CONTROLS_MODE_CONFIG, STATIC_MODE_CAMERA_CONFIG } from './data/camera-config';
import { CAMERA_FOCUS_OBJECT_TYPE, CAMERA_MODE, FOCUS_TYPE } from './data/camera-data';
import { MessageDispatcher } from 'black-engine';

export default class CameraController {
  constructor(camera, orbitControls, focusObjects, roomDebug) {

    this.events = new MessageDispatcher();

    this._camera = camera;
    this._orbitControls = orbitControls;
    this._focusObjects = focusObjects;
    this._roomDebug = roomDebug;

    this._lookAtObject = null;
    this._lookAtLerpObject = null;
    this._focusModeZoomObject = null;
    this._focusModeZoomLerpObject = null;
    this._staticModeLookAtObject = null;
    this._staticModeLookAtLerpObject = null;
    this._staticModeZoomObject = null;
    this._staticModeZoomLerpObject = null;
    this._positionTween = null;
    this._rotationTween = null;
    this._focusLookAtVector = new THREE.Vector3();
    this._lastCameraPosition = new THREE.Vector3();
    this._lastCameraLookAt = new THREE.Vector3();
    this._currentZoomDistanceStaticMode = STATIC_MODE_CAMERA_CONFIG.zoom.defaultDistance;
    this._currentZoomDistanceFocusedMode = 0;

    this._isPointerMoveAllowed = true;
    this._cameraMode = CAMERA_MODE.OrbitControls;

    this._staticModeObject = null;

    this._init();
  }

  update(dt) {
    if (this._cameraMode === CAMERA_MODE.Focused) {
      this._lookAtLerpObject.position.lerp(this._lookAtObject.position, dt * 60 * FOCUSED_MODE_CAMERA_CONFIG.rotation.lerpTime);
      this._camera.lookAt(this._lookAtLerpObject.position);

      this._focusModeZoomLerpObject.position.lerp(this._focusModeZoomObject.position, dt * 60 * FOCUSED_MODE_CAMERA_CONFIG.zoom.lerpTime);
      this._camera.position.copy(this._focusModeZoomLerpObject.position);
    }

    if (this._cameraMode === CAMERA_MODE.Static) {
      this._staticModeLookAtLerpObject.position.lerp(this._staticModeLookAtObject.position, dt * 60 * STATIC_MODE_CAMERA_CONFIG.rotation.lerpTime);
      this._staticModeObject.lookAt(this._staticModeLookAtLerpObject.position);

      this._staticModeZoomLerpObject.position.lerp(this._staticModeZoomObject.position, dt * 60 * STATIC_MODE_CAMERA_CONFIG.zoom.lerpTime);
      this._staticModeObject.position.copy(this._staticModeZoomLerpObject.position);
    }
  }

  onPointerMove(x, y) {
    if (this._cameraMode === CAMERA_MODE.Focused && this._isPointerMoveAllowed) {
      const percentX = x / window.innerWidth * 2 - 1;
      const percentY = y / window.innerHeight * 2 - 1;

      this._lookAtObject.position.copy(this._focusLookAtVector);
      this._lookAtObject.translateOnAxis(new THREE.Vector3(1, 0, 0), percentX * FOCUSED_MODE_CAMERA_CONFIG.rotation.coefficient);
      this._lookAtObject.translateOnAxis(new THREE.Vector3(0, 1, 0), -percentY * FOCUSED_MODE_CAMERA_CONFIG.rotation.coefficient);
    }

    if (this._cameraMode === CAMERA_MODE.Static && this._isPointerMoveAllowed) {
      const percentX = x / window.innerWidth * 2 - 1;
      const percentY = y / window.innerHeight * 2 - 1;

      this._staticModeLookAtObject.position.copy(this._staticModeObject.position);
      this._staticModeLookAtObject.translateOnAxis(new THREE.Vector3(0, 0, 1), STATIC_MODE_CAMERA_CONFIG.rotation.lookAtObjectZOffset);
      this._staticModeLookAtObject.translateOnAxis(new THREE.Vector3(1, 0, 0), percentX * STATIC_MODE_CAMERA_CONFIG.rotation.coefficient);
      this._staticModeLookAtObject.translateOnAxis(new THREE.Vector3(0, 1, 0), -percentY * STATIC_MODE_CAMERA_CONFIG.rotation.coefficient);
    }
  }

  onPointerLeave() {
    if (this._cameraMode === CAMERA_MODE.Focused) {
      this._lookAtObject.position.copy(this._focusLookAtVector);

      this._isPointerMoveAllowed = false;
      setTimeout(() => this._isPointerMoveAllowed = true, 100);
    }
  }

  onWheelScroll(delta) {
    if (this._cameraMode === CAMERA_MODE.Static) {
      const zoomDelta = -delta * STATIC_MODE_CAMERA_CONFIG.zoom.coefficient;
      const minDistance = STATIC_MODE_CAMERA_CONFIG.zoom.minDistance;
      const maxDistance = STATIC_MODE_CAMERA_CONFIG.zoom.maxDistance;
      this._currentZoomDistanceStaticMode = THREE.MathUtils.clamp(this._currentZoomDistanceStaticMode + zoomDelta, minDistance, maxDistance);

      if (this._currentZoomDistanceStaticMode !== minDistance && this._currentZoomDistanceStaticMode !== maxDistance) {
        this._staticModeZoomObject.translateOnAxis(new THREE.Vector3(0, 0, 1), zoomDelta);
      }
    }

    if (this._cameraMode === CAMERA_MODE.Focused) {
      const objectType = CAMERA_CONFIG.focusObjectType;
      const zoomDelta = delta * FOCUSED_MODE_CAMERA_CONFIG.zoom.coefficient;
      const minDistance = FOCUSED_MODE_CAMERA_CONFIG.zoom.objects[objectType].minDistance;
      const maxDistance = FOCUSED_MODE_CAMERA_CONFIG.zoom.objects[objectType].maxDistance;
      this._currentZoomDistanceFocusedMode = THREE.MathUtils.clamp(this._currentZoomDistanceFocusedMode + zoomDelta, minDistance, maxDistance);

      if (this._currentZoomDistanceFocusedMode !== minDistance && this._currentZoomDistanceFocusedMode !== maxDistance) {
        this._focusModeZoomObject.translateOnAxis(new THREE.Vector3(0, 0, 1), zoomDelta);
      }
    }
  }

  enableOrbitControls() {
    if (this._orbitControls) {
      this._orbitControls.enabled = true;
      ORBIT_CONTROLS_MODE_CONFIG.enabled = true;
    }
  }

  disableOrbitControls() {
    if (this._orbitControls) {
      this._orbitControls.enabled = false;
      ORBIT_CONTROLS_MODE_CONFIG.enabled = false;
    }
  }

  onObjectDragStart() {
    if (this._cameraMode === CAMERA_MODE.OrbitControls) {
      this.disableOrbitControls();
    }
  }

  onObjectDragEnd() {
    if (this._cameraMode === CAMERA_MODE.OrbitControls) {
      this.enableOrbitControls();
    }
  }

  focusCamera(focusObjectType) {
    if (this._cameraMode === CAMERA_MODE.NoControls) {
      return;
    }

    if (this._cameraMode === CAMERA_MODE.OrbitControls && focusObjectType !== CAMERA_FOCUS_OBJECT_TYPE.Room) {
      this._lastCameraPosition.copy(this._camera.position);
      this._lastCameraLookAt.copy(this._orbitControls.target);
    }

    CAMERA_CONFIG.focusObjectType = focusObjectType;

    const focusConfig = CAMERA_FOCUS_POSITION_CONFIG[focusObjectType];
    this._cameraMode = CAMERA_MODE.NoControls;
    CAMERA_CONFIG.mode = this._cameraMode;
    this._roomDebug.updateCameraStateController();

    this.disableOrbitControls();
    this._orbitControls.stopDamping();

    const { focusPosition, focusLookAt } = this._getFocusData(focusObjectType);
    this._lookAtObject.position.copy(focusLookAt);
    this._lookAtLerpObject.position.copy(focusLookAt);
    this._focusLookAtVector = focusLookAt;

    const distance = this._camera.position.distanceTo(focusPosition);
    const time = THREE.MathUtils.clamp(distance / (CAMERA_CONFIG.movementToFocusObject.speed * 0.01), CAMERA_CONFIG.movementToFocusObject.minTime, CAMERA_CONFIG.movementToFocusObject.maxTime);

    this._lerpCameraPosition(focusPosition, focusLookAt, focusConfig.positionEasing, time);
    this._lerpCameraRotation(focusPosition, focusLookAt, focusConfig.rotationEasing, time)

    this._rotationTween.onComplete(() => {
      if (focusConfig.enableOrbitControlsOnComplete) {
        this._orbitControls.target.set(focusLookAt.x, focusLookAt.y, focusLookAt.z);
        this.enableOrbitControls();
        this._cameraMode = CAMERA_MODE.OrbitControls;
      }

      if (focusObjectType === CAMERA_FOCUS_OBJECT_TYPE.Keyboard || focusObjectType === CAMERA_FOCUS_OBJECT_TYPE.Monitor) {
        this._lookAtObject.quaternion.copy(this._camera.quaternion);
        this._lookAtLerpObject.quaternion.copy(this._camera.quaternion);

        this._focusModeZoomObject.position.copy(this._camera.position);
        this._focusModeZoomObject.quaternion.copy(this._camera.quaternion);
        this._focusModeZoomLerpObject.position.copy(this._focusModeZoomObject.position);
        this._focusModeZoomLerpObject.quaternion.copy(this._focusModeZoomObject.quaternion);
        this._currentZoomDistanceFocusedMode = this._camera.position.distanceTo(this._lookAtObject.position);

        this._cameraMode = CAMERA_MODE.Focused;
        this.events.post('onObjectFocused', focusObjectType);
      }

      CAMERA_CONFIG.mode = this._cameraMode;
      this._roomDebug.updateCameraStateController();
    });
  }

  setStaticState(object) {
    this._staticModeObject = object;

    this._cameraMode = CAMERA_MODE.NoControls;
    CAMERA_CONFIG.mode = this._cameraMode;
    this._roomDebug.updateCameraStateController();

    this._orbitControls.stopDamping();
    this.disableOrbitControls();

    this._moveObjectToCamera();
  }

  setOrbitState() {
    this._cameraMode = CAMERA_MODE.OrbitControls;
    CAMERA_CONFIG.mode = this._cameraMode;
    this._roomDebug.updateCameraStateController();

    this._staticModeObject = null;

    this.enableOrbitControls();
  }

  _lerpCameraPosition(focusPosition, focusLookAt, easing, time) {
    if (this._positionTween) {
      this._positionTween.stop();
    }

    const startPosition = this._camera.position.clone();

    const positionObject = { value: 0 };

    this._positionTween = new TWEEN.Tween(positionObject)
      .to({ value: 1 }, time)
      .easing(easing)
      .start()
      .onUpdate(() => {
        const position = new THREE.Vector3().lerpVectors(startPosition, focusPosition, positionObject.value);
        this._camera.position.copy(position);
      });
  }

  _lerpCameraRotation(focusPosition, focusLookAt, easing, time) {
    if (this._rotationTween) {
      this._rotationTween.stop();
    }

    const startQuaternion = this._camera.quaternion.clone();
    const dummy = new THREE.Object3D();
    dummy.position.copy(focusLookAt);
    dummy.lookAt(focusPosition);
    const endQuaternion = dummy.quaternion.clone();

    const lookAtObject = { value: 0 };

    this._rotationTween = new TWEEN.Tween(lookAtObject)
      .to({ value: 1 }, time)
      .easing(easing)
      .start()
      .onUpdate(() => {
        const quaternion = new THREE.Quaternion().slerpQuaternions(startQuaternion, endQuaternion, lookAtObject.value)
        this._camera.quaternion.copy(quaternion);
      });
  }

  _getFocusData(focusObjectType) {
    const focusConfig = CAMERA_FOCUS_POSITION_CONFIG[focusObjectType];

    let focusPosition = null;
    let focusLookAt = null;

    if (focusObjectType === CAMERA_FOCUS_OBJECT_TYPE.LastPosition) {
      focusPosition = this._lastCameraPosition;
      focusLookAt = this._lastCameraLookAt;
    } else {
      if (focusConfig.focusType === FOCUS_TYPE.Position) {
        focusPosition = focusConfig.focus.position;
        focusLookAt = focusConfig.focus.lookAt;
      }

      if (focusConfig.focusType === FOCUS_TYPE.Object) {
        const focusObject = this._focusObjects[focusConfig.focus.objectType];
        focusLookAt = focusObject.getFocusPosition();
        focusPosition = focusLookAt.clone().add(focusConfig.focus.positionFromObject);
      }
    }

    return { focusPosition, focusLookAt };
  }

  _moveObjectToCamera() {
    const endPositionObject = new THREE.Object3D();

    endPositionObject.position.copy(this._camera.position);
    endPositionObject.quaternion.copy(this._camera.quaternion);

    endPositionObject.rotateX(Math.PI * 0.5);
    endPositionObject.translateY(-STATIC_MODE_CAMERA_CONFIG.zoom.defaultDistance);

    new TWEEN.Tween(this._staticModeObject.position)
      .to({ x: endPositionObject.position.x, y: endPositionObject.position.y, z: endPositionObject.position.z }, STATIC_MODE_CAMERA_CONFIG.objectMoveTime)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onComplete(() => {
        this._onObjectMovedToCamera();
      });

    new TWEEN.Tween(this._staticModeObject.rotation)
      .to({ x: endPositionObject.rotation.x, y: endPositionObject.rotation.y, z: endPositionObject.rotation.z }, STATIC_MODE_CAMERA_CONFIG.objectMoveTime)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();
  }

  _onObjectMovedToCamera() {
    this._staticModeLookAtObject.quaternion.copy(this._staticModeObject.quaternion);
    this._staticModeLookAtObject.position.copy(this._staticModeObject.position);
    this._staticModeLookAtObject.translateOnAxis(new THREE.Vector3(0, 0, 1), STATIC_MODE_CAMERA_CONFIG.rotation.lookAtObjectZOffset);
    this._staticModeLookAtLerpObject.quaternion.copy(this._staticModeLookAtObject.quaternion);
    this._staticModeLookAtLerpObject.position.copy(this._staticModeLookAtObject.position);

    this._staticModeZoomObject.position.copy(this._staticModeObject.position);
    this._staticModeZoomObject.quaternion.copy(this._camera.quaternion);
    this._staticModeZoomLerpObject.position.copy(this._staticModeZoomObject.position);
    this._staticModeZoomLerpObject.quaternion.copy(this._staticModeZoomObject.quaternion);

    this._currentZoomDistanceStaticMode = STATIC_MODE_CAMERA_CONFIG.zoom.defaultDistance;

    this._cameraMode = CAMERA_MODE.Static;
    CAMERA_CONFIG.mode = this._cameraMode;
    this._roomDebug.updateCameraStateController();
  }

  _init() {
    this._initLookAtObjects();
    this._initFocusModeZoomObjects();
    this._initStaticModeLookAtObjects();
    this._initStaticModeZoomObjects();
    this._setCameraStartPosition();
  }

  _initLookAtObjects() {
    this._lookAtObject = new THREE.Object3D();
    this._lookAtLerpObject = new THREE.Object3D();
  }

  _initFocusModeZoomObjects() {
    this._focusModeZoomObject = new THREE.Object3D();
    this._focusModeZoomLerpObject = new THREE.Object3D();
  }

  _initStaticModeLookAtObjects() {
    this._staticModeLookAtObject = new THREE.Object3D();
    this._staticModeLookAtLerpObject = new THREE.Object3D();
  }

  _initStaticModeZoomObjects() {
    this._staticModeZoomObject = new THREE.Object3D();
    this._staticModeZoomLerpObject = new THREE.Object3D();
  }

  _setCameraStartPosition() {
    const cameraFocusType = CAMERA_FOCUS_OBJECT_TYPE.Room;
    const focusConfig = CAMERA_FOCUS_POSITION_CONFIG[cameraFocusType];

    this._camera.position.copy(focusConfig.focus.position)
    this._camera.lookAt(focusConfig.focus.lookAt.x, focusConfig.focus.lookAt.y, focusConfig.focus.lookAt.z);
  }
}