import AirConditioner from "../room-active-objects/air-conditioner/air-conditioner";
import AirConditionerDebugMenu from "../room-active-objects/air-conditioner/air-conditioner-debug-menu";
import Chair from "../room-active-objects/chair/chair";
import ChairDebugMenu from "../room-active-objects/chair/chair-debug-menu";
import FloorLamp from "../room-active-objects/floor-lamp/floor-lamp";
import FloorLampDebugMenu from "../room-active-objects/floor-lamp/floor-lamp-debug-menu";
import Keyboard from "../room-active-objects/keyboard/keyboard";
import KeyboardDebugMenu from "../room-active-objects/keyboard/keyboard-debug-menu";
import Locker from "../room-active-objects/locker/locker";
import LockerDebugMenu from "../room-active-objects/locker/locker-debug-menu";
import Monitor from "../room-active-objects/monitor/monitor";
import MonitorDebugMenu from "../room-active-objects/monitor/monitor-debug-menu";
import Mouse from "../room-active-objects/mouse/mouse";
import MouseDebugMenu from "../room-active-objects/mouse/mouse-debug-menu";
import Laptop from "../room-active-objects/laptop/laptop";
import LaptopDebugMenu from "../room-active-objects/laptop/laptop-debug-menu";
import Speakers from "../room-active-objects/speakers/speakers";
import SpeakersDebugMenu from "../room-active-objects/speakers/speakers-debug-menu";
import Table from "../room-active-objects/table/table";
import TableDebugMenu from "../room-active-objects/table/table-debug-menu";
import Walls from "../room-active-objects/walls/walls";
import WindowDebugMenu from "../room-active-objects/walls/window-debug-menu";
import Bin from "../room-inactive-objects/objects/bin";
import Carpet from "../room-inactive-objects/objects/carpet";
import Coaster from "../room-inactive-objects/objects/coaster";
import Cup from "../room-inactive-objects/objects/cup";
import Map from "../room-inactive-objects/objects/map";
import MousePad from "../room-inactive-objects/objects/mousepad";
import Organizer from "../room-inactive-objects/objects/organizer";
import Pouf from "../room-inactive-objects/objects/pouf";
import Scales from "../room-inactive-objects/objects/scales";
import { ROOM_OBJECT_TYPE } from "./room-config";

const ROOM_OBJECT_CLASS = {
  // Active objects
  [ROOM_OBJECT_TYPE.Walls]: {
    object: Walls,
    debugMenu: WindowDebugMenu,
  },
  [ROOM_OBJECT_TYPE.AirConditioner]: {
    object: AirConditioner,
    debugMenu: AirConditionerDebugMenu,
  },
  [ROOM_OBJECT_TYPE.FloorLamp]: {
    object: FloorLamp,
    debugMenu: FloorLampDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Locker]: {
    object: Locker,
    debugMenu: LockerDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Chair]: {
    object: Chair,
    debugMenu: ChairDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Table]: {
    object: Table,
    debugMenu: TableDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Speakers]: {
    object: Speakers,
    debugMenu: SpeakersDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Monitor]: {
    object: Monitor,
    debugMenu: MonitorDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Laptop]: {
    object: Laptop,
    debugMenu: LaptopDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Keyboard]: {
    object: Keyboard,
    debugMenu: KeyboardDebugMenu,
  },
  [ROOM_OBJECT_TYPE.Mouse]: {
    object: Mouse,
    debugMenu: MouseDebugMenu,
  },

  // Inactive objects
  [ROOM_OBJECT_TYPE.Scales]: {
    object: Scales,
  },
  [ROOM_OBJECT_TYPE.Map]: {
    object: Map,
  },
  [ROOM_OBJECT_TYPE.Carpet]: {
    object: Carpet,
  },
  [ROOM_OBJECT_TYPE.Bin]: {
    object: Bin,
  },
  [ROOM_OBJECT_TYPE.Pouf]: {
    object: Pouf,
  },
  [ROOM_OBJECT_TYPE.MousePad]: {
    object: MousePad,
  },
  [ROOM_OBJECT_TYPE.Coaster]: {
    object: Coaster,
  },
  [ROOM_OBJECT_TYPE.Cup]: {
    object: Cup,
  },
  [ROOM_OBJECT_TYPE.Organizer]: {
    object: Organizer,
  },
}

export { ROOM_OBJECT_CLASS };