import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Swiper from 'react-native-swiper';
import { SCREEN_WIDTH } from '../../themes/spacing';
import FastImage from '@d11/react-native-fast-image';
import { normalize } from '../../utils/util';
import AppImage from './AppImage';

interface ImageSliderProps {
  images: string[];
  dotColor?: string;
  inactiveDotColor?: string;
  autoplay?: boolean;
  autoplayTimeout?: number;
  ImageComponentStyle?: object;
  sliderBoxStyle?: object;
  wrapper?: StyleProp<ViewStyle>
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  dotColor = '#ffffff',
  inactiveDotColor = '#90A4AE',
  autoplay = true,
  autoplayTimeout = 10,
  ImageComponentStyle = {},
  sliderBoxStyle = {},
  wrapper
}) => {
  return (
    <View style={sliderBoxStyle}>
      <Swiper
        style={[styles.wrapper, wrapper]}
        autoplay={autoplay}
        autoplayTimeout={autoplayTimeout}
        dotStyle={[styles.dotStyle, { backgroundColor: inactiveDotColor }]}
        activeDotStyle={[styles.dotStyle, { backgroundColor: dotColor }]}
        paginationStyle={styles.paginationStyle}
      >
        {images.map((image, index) => (
          <View key={index} style={{ borderRadius: normalize(12) }}>
            <AppImage
              style={[styles.image, ImageComponentStyle]}
              // @ts-ignore
              source={image}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: normalize(16),
  },
  image: {
    width: SCREEN_WIDTH - normalize(32),
    height: 160,
    borderRadius: normalize(12),
  },
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  paginationStyle: {
    bottom: Platform.select({
      ios: normalize(-18),
      android: normalize(-20),
    })
  },
});

export default ImageSlider;
