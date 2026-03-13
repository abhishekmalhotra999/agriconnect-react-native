import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { SCREEN_WIDTH } from '../../../themes/spacing';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { normalize } from '../../../utils/util';
import Button from '../../UI/Button';

interface OnBoardingSwiperProps {
  navigation: NavigationProp<any>;
}

const images = [
  require('../../../../assets/images/onboarding.png'),
]

const OnBoardingSwiper: React.FC<OnBoardingSwiperProps> = ({ navigation }) => {
  const { completeOnBoarding } = useOnboarding();

  const finished = async () => {
    completeOnBoarding()
  }

  return (
    <>
    <Swiper
      style={styles.wrapper}
      dotStyle={[styles.dotStyle, { backgroundColor: COLORS.lightGrey }]}
      activeDotStyle={[styles.dotStyle, { backgroundColor: COLORS.primary }]}
      paginationStyle={styles.paginationStyle}
      loop={false}
      index={0}
    >
      {images.map((item, index) => (
      <View key={index} style={styles.content}>        
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={item}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={4}>Agriconnect is a platform that bridges the gap between producers and consumers for convenient trade.</Text>
        </View>
      </View>
      ))}
    </Swiper>
    <Button 
      label="Done" 
      onPress={finished} 
      style={styles.btn}
      labelStyle={styles.labelStyle}
    />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
  },
  content: {
    alignItems: 'center'
  },
  imageContainer: {
    paddingVertical: normalize(50),
  },
  image: {
    width: 329,
    height: 223,
    resizeMode: 'contain',
  },
  textContainer: {
    width: Platform.select({
      ios: SCREEN_WIDTH - normalize(122),
      android: SCREEN_WIDTH - normalize(152)
    })
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.mediumGrey,
    textAlign: 'center'
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  paginationStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: Platform.select({
      ios: 30,
      android: normalize(30)
    })
  },
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    paddingVertical: normalize(8),
    backgroundColor: COLORS.lightGrey,
  },
  labelStyle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.primaryDark,
  },
});

export default OnBoardingSwiper;
