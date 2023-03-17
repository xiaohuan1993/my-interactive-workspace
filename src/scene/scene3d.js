import * as THREE from 'three';
import Loader from '../core/loader';
import Locker from './locker';
import Table from './table';

export default class Scene3D extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;

    this._raycaster = null;
    this._roomGroup = null;

    this._objects = {};
    this._allMeshes = [];

    this._init();
  }

  update(dt) {

  }

  onClick() {
    this._table.changeState();
  }

  onPointerMove(x, y) {
    // if (this._checkIntersectsWithTable(x, y)) {
    //   this._table.startScaleUp();
    // } else {
    //   this._table.stopScaleUp();
    // }
  }

  onPointerDown(x, y) {
    const { objectType, instanceId } = this._checkIntersection(x, y);

    if (objectType === OBJECT_TYPE.Table) {
      this._objects[OBJECT_TYPE.Table].changeState();
    }

    if (objectType === OBJECT_TYPE.Locker) {
      console.log(`Locker ${instanceId}`);
    }

  }

  onPointerUp() {

  }

  _checkIntersection(x, y) {
    const mousePositionX = (x / window.innerWidth) * 2 - 1;
    const mousePositionY = -(y / window.innerHeight) * 2 + 1;
    const mousePosition = new THREE.Vector2(mousePositionX, mousePositionY);

    this._raycaster.setFromCamera(mousePosition, this._camera);
    const intersects = this._raycaster.intersectObjects(this._allMeshes);

    let objectType = null;
    let instanceId = null;

    if (intersects.length > 0) {
      const intersect = intersects[0];
      objectType = intersect.object.userData.objectType;
      instanceId = intersect.instanceId;
    }

    return { objectType, instanceId };
  }

  _init() {
    this._initRaycaster();

    this._roomGroup = Loader.assets['room'].scene;

    this._initTable();
    this._initLocker();

    this._gatherAllMeshes();
  }

  _initRaycaster() {
    this._raycaster = new THREE.Raycaster();
  }

  _initTable() {
    const tableGroup = this._roomGroup.getObjectByName('Table');
    const table = new Table(tableGroup);
    this.add(table);

    this._objects[OBJECT_TYPE.Table] = table;
  }

  _initLocker() {
    const lockerGroup = this._roomGroup.getObjectByName('Locker');
    const locker = new Locker(lockerGroup);
    this.add(locker);

    this._objects[OBJECT_TYPE.Locker] = locker;
  }

  _gatherAllMeshes() {
    for (const key in this._objects) {
      this._allMeshes.push(...this._objects[key].getAllMeshes());
    }
  }
}

export const OBJECT_TYPE = {
  Table: 'TABLE',
  Locker: 'LOCKER',
}
