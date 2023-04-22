const KEYS_BACKLIGHT_TYPE = {
  FromLeftToRight: 'FROM_LEFT_TO_RIGHT',
  FromTopToBottom: 'FROM_TOP_TO_BOTTOM',
  SameColor: 'SAME_COLOR',
  FromCenterToSides: 'FROM_CENTER_TO_SIDES',
  RandomColors: 'RANDOM_COLORS',
  FromFirstToLastKey: 'FROM_FIRST_TO_LAST_KEY',
  PressKey: 'PRESS_KEY',
  PressKeyToSides: 'PRESS_KEY_TO_SIDES',
  PressKeyToSidesRow: 'PRESS_KEY_TO_SIDES_ROW',
}

const KEYS_BACKLIGHT_TYPE_ORDER = [
  KEYS_BACKLIGHT_TYPE.FromLeftToRight,
  KEYS_BACKLIGHT_TYPE.FromTopToBottom,
  KEYS_BACKLIGHT_TYPE.SameColor,
  KEYS_BACKLIGHT_TYPE.FromCenterToSides,
  KEYS_BACKLIGHT_TYPE.RandomColors,
  KEYS_BACKLIGHT_TYPE.FromFirstToLastKey,
  KEYS_BACKLIGHT_TYPE.PressKey,
  KEYS_BACKLIGHT_TYPE.PressKeyToSides,
  KEYS_BACKLIGHT_TYPE.PressKeyToSidesRow,
]

export { KEYS_BACKLIGHT_TYPE, KEYS_BACKLIGHT_TYPE_ORDER };
