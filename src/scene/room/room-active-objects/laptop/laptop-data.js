const LAPTOP_PART_TYPE = {
  LaptopKeyboard: 'laptop_keyboard',
  LaptopMonitor: 'laptop_monitor',
  LaptopScreen: 'laptop_screen',
  LaptopStand: 'laptop_stand',
  LaptopArmMountBase: 'laptop_arm_mount_base',
  LaptopArmMountArm01: 'laptop_arm_mount_arm01',
  LaptopArmMountArm02: 'laptop_arm_mount_arm02',
  LaptopMount: 'laptop_mount',
}

const LAPTOP_PART_CONFIG = {
  [LAPTOP_PART_TYPE.LaptopKeyboard]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopMonitor]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopScreen]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopStand]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopArmMountBase]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopArmMountArm01]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopArmMountArm02]: {
    isActive: true,
  },
  [LAPTOP_PART_TYPE.LaptopMount]: {
    isActive: true,
  },
}

const LAPTOP_PARTS = [
  LAPTOP_PART_TYPE.LaptopKeyboard,
  LAPTOP_PART_TYPE.LaptopMonitor,
  LAPTOP_PART_TYPE.LaptopScreen,
]

const LAPTOP_MOUNT_PARTS = [
  LAPTOP_PART_TYPE.LaptopStand,
  LAPTOP_PART_TYPE.LaptopArmMountBase,
  LAPTOP_PART_TYPE.LaptopArmMountArm01,
  LAPTOP_PART_TYPE.LaptopArmMountArm02,
  LAPTOP_PART_TYPE.LaptopMount,
]

const LAPTOP_STATE = {
  Idle: 'IDLE',
  Moving: 'MOVING',
}

const LAPTOP_POSITION_STATE = {
  Opened: 'OPENED',
  Closed: 'CLOSED',
}

export { LAPTOP_PART_TYPE, LAPTOP_PART_CONFIG, LAPTOP_PARTS, LAPTOP_MOUNT_PARTS, LAPTOP_STATE, LAPTOP_POSITION_STATE }