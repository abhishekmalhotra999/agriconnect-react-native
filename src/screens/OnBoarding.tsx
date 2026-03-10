import React from 'react';
import { View, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { OnBoardingScreenProps } from '../navigation/types';
import OnBoardingSwiper from '../components/Common/OnBoarding/Swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoImg, bgImage } from '../constants/images';
import { normalize } from '../utils/util';

const OnBoarding: React.FC<OnBoardingScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={bgImage} resizeMode='contain' style={styles.bgContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={logoImg}
          />
        </View>
        <OnBoardingSwiper navigation={navigation}/>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  bgContainer: {
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  logoContainer: {
    marginTop: Platform.select({
      ios: normalize(10),
      android: normalize(40)
    })
  },
  logo: {
    width: 186,
    height: 133,
    resizeMode: 'contain',
  },
});

export default OnBoarding;
