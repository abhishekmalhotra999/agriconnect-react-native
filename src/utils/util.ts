import { PixelRatio, Platform, ImageSourcePropType, ImageURISource } from 'react-native';
import moment from 'moment';
import FastImage, { Source } from '@d11/react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_WIDTH } from '../themes/spacing';

function normalize(size: number): number {
  const REFERENCE_WIDTH = 375;
  const scale = SCREEN_WIDTH / REFERENCE_WIDTH;

  const newSize = size * scale;
  const fontScale = Platform.OS === 'ios' ? 1.12 : 1;
  return Math.round(PixelRatio.roundToNearestPixel(newSize) * fontScale);
}

function capitalize(string: string): string {
  if (string.length === 0) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function topInsets(number: number = 0): number {
  const insets = useSafeAreaInsets();
  return insets.top + number;
}

function bottomInsets(number: number = 0): number {
  const insets = useSafeAreaInsets();
  return insets.bottom + number;
}

// function bottomInsets(insets: number, number: number = 0): number {
//   return insets + number;
// }
// usage
// const insets = useSafeAreaInsets();  // Hook should be used in the component
// bottomInsets(insets.bottom)

function getImageSource(image: ImageSourcePropType): number | Source | undefined {
  if (typeof image === 'number') {
    return image;
  }

  if (typeof image === 'object' && 'uri' in image && image.uri) {
    const imageUri = image as ImageURISource;
    return {
      uri: imageUri.uri,
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
    };
  }

  return undefined;
}

function headerHeight(ios=45, android=50){
  let height = normalize(ios);

  if (Platform.OS === 'android') {
    height = normalize(android);
  }
  return height;
}

export { normalize, capitalize, topInsets, bottomInsets, getImageSource, headerHeight };