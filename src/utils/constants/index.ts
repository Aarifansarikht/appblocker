import { Dimensions, NativeModules } from 'react-native';


const { StatusBarManager } = NativeModules;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_SCALE = Dimensions.get('window').scale;
export const SCREEN_FONT_SCALE = Dimensions.get('window').fontScale;
export const CONTAINER_SPACING = 12