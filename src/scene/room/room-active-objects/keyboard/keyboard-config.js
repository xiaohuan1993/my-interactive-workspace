import * as THREE from 'three';

const KEYBOARD_CONFIG = {
  size: new THREE.Vector3(1.8, 0.205, 0.59),
  keys: {
    offsetX: 0.055,
    offsetZ: 0.056,
    angle: 6.5,
    offsetYFromKeyboard: 0.03,
    movingDistance: 0.016,
    highlightColor: new THREE.Color(0x00ff00),
  },
}

export { KEYBOARD_CONFIG };
