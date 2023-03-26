import * as THREE from 'three';
import DEBUG_CONFIG from '../../core/configs/debug-config';
import Loader from '../../core/loader';
import { ROOM_CONFIG, ROOM_OBJECT_ACTIVITY_TYPE, ROOM_OBJECT_CONFIG, ROOM_OBJECT_TYPE, START_ANIMATION_ALL_OBJECTS } from './room-config';
import RoomDebug from './room-debug';
import RoomInactiveObjects from './room-inactive-objects/room-inactive-objects';

export default class Room extends THREE.Group {
  constructor(raycaster, outlinePass) {
    super();

    this._raycaster = raycaster;
    this._outlinePass = outlinePass;

    this._roomScene = null;
    this._roomDebug = null;
    this._roomInactiveObjects = null;

    this._roomActiveObject = {};
    this._roomInactiveMesh = {};

    this._pointerPosition = new THREE.Vector2();

    this._init();
  }

  update(dt) {
    if (ROOM_CONFIG.outlineEnabled) {
      const intersectedMesh = this._raycaster.checkIntersection(this._pointerPosition.x, this._pointerPosition.y);
      this._checkToGlow(intersectedMesh);
    }
  }

  onPointerMove(x, y) {
    this._pointerPosition.set(x, y);
  }

  onPointerDown(x, y) {
    const intersectedObject = this._raycaster.checkIntersection(x, y);

    if (intersectedObject && intersectedObject.userData.isActive) {
      this._roomActiveObject[intersectedObject.userData.objectType].onClick(intersectedObject);
    }
  }

  show(startDelay = 0) {
    this._roomDebug.disableShowAnimationControllers();

    this._showRoomObject(ROOM_OBJECT_TYPE.FloorLamp, startDelay);
    this._showRoomObject(ROOM_OBJECT_TYPE.Locker, startDelay + 200);
    this._showRoomObject(ROOM_OBJECT_TYPE.Table, startDelay + 400);
    this._showRoomObject(ROOM_OBJECT_TYPE.Scales, startDelay + 600);
  }

  _showRoomObject(objectType, startDelay = 0) {
    if (this._roomActiveObject[objectType]) {
      this._roomActiveObject[objectType].show(startDelay);
    }

    if (this._roomInactiveMesh[objectType]) {
      this._roomInactiveObjects.show(objectType, startDelay);
    }
  }

  _checkToGlow(mesh) {
    if (mesh === null || !mesh.userData.isActive || !this._roomActiveObject[mesh.userData.objectType].isInputEnabled()) {
      this._resetGlow();

      return;
    }

    const roomObject = this._roomActiveObject[mesh.userData.objectType];
    const meshes = roomObject.getMeshesForOutline(mesh);
    this._setGlow(meshes);
  }

  _setGlow(items) {
    if (!DEBUG_CONFIG.wireframe) {
      this._outlinePass.selectedObjects = items;
    }
  }

  _resetGlow() {
    if (this._outlinePass.selectedObjects.length > 0) {
      this._outlinePass.selectedObjects = [];
    }
  }

  _init() {
    this._initRoomDebug();
    this._initRoomObjects();
    this._initSignals();
    this._configureRaycaster();

    if (ROOM_CONFIG.showStartAnimations) {
      this.show(600);
    }
  }

  _initRoomDebug() {
    const roomDebug = this._roomDebug = new RoomDebug();

    roomDebug.events.on('startShowAnimation', (msg, selectedObjectType) => {
      if (selectedObjectType === START_ANIMATION_ALL_OBJECTS) {
        this.show();
      } else {
        this._roomActiveObject[selectedObjectType].show();
      }
    });
  }

  _initRoomObjects() {
    this._roomScene = Loader.assets['room'].scene;

    this._initActiveObjects();
    this._initInactiveObjects();
  }

  _initActiveObjects() {
    for (const key in ROOM_OBJECT_TYPE) {
      const type = ROOM_OBJECT_TYPE[key];
      const config = ROOM_OBJECT_CONFIG[type];

      if (config.enabled && config.activityType === ROOM_OBJECT_ACTIVITY_TYPE.Active) {
        const group = this._roomScene.getObjectByName(config.groupName);
        const roomObject = new config.class(group, type);
        this.add(roomObject);

        this._roomActiveObject[type] = roomObject;
      }
    }
  }

  _initInactiveObjects() {
    const roomInactiveObjects = this._roomInactiveObjects = new RoomInactiveObjects(this._roomScene);
    const inactiveObjects = this._roomInactiveMesh = roomInactiveObjects.getInactiveMeshes();

    const inactiveObjectsArray = [];

    for (const key in inactiveObjects) {
      const roomInactiveObject = inactiveObjects[key];
      this.add(roomInactiveObject);

      inactiveObjectsArray.push(roomInactiveObject);
    }

    this._raycaster.addMeshes(inactiveObjectsArray);
  }

  _initSignals() {
    for (const key in this._roomActiveObject) {
      const roomObject = this._roomActiveObject[key];

      roomObject.events.on('showAnimationComplete', () => {
        if (this._checkIsShowAnimationComplete()) {
          this._roomDebug.enableShowAnimationControllers();
        }
      });
    }
  }

  _configureRaycaster() {
    const allMeshes = [];

    for (const key in this._roomActiveObject) {
      allMeshes.push(...this._roomActiveObject[key].getActiveMeshes());
    }

    this._raycaster.addMeshes(allMeshes);
  }

  _checkIsShowAnimationComplete() {
    for (const key in this._roomActiveObject) {
      if (this._roomActiveObject[key].isShowAnimationActive()) {
        return false;
      }
    }

    return true;
  }
}
