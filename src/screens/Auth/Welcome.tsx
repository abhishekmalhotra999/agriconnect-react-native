import React from 'react';
import { View, Text, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { WelcomeScreenProps } from '../../navigation/types';
import { normalize } from '../../utils/util';
import { logoImg, bgImage } from '../../constants/images';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/UI/Button';

const Welcome: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const { navigate } = navigation;

  const signup = () => {
    navigate('Signup')
  }

  const signin = () => {
    navigate('Login')
  }

  return (
    <ImageBackground source={bgImage} style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.headingText}>Welcome to</Text>
        <Image
          style={styles.logo}
          source={logoImg}
        />
        <Text style={styles.paraText}>
          Create an account to get started. {`\n`}Sign up now.
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button label="Sign Up" style={styles.signup} labelStyle={styles.signupLabel} onPress={signup}></Button>
        <Button label="Sign In" style={styles.signin} labelStyle={styles.signinLabel} onPress={signin}></Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
  },
  headingText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.black,
  },
  content: {
    justifyContent: 'flex-end',
    marginTop: Platform.select({
      ios: normalize(10),
      android: normalize(40)
    })
  },
  logo: {
    width: 186,
    height: 133,
    resizeMode: 'contain',
    marginVertical: normalize(20),
  },
  paraText: {
    marginTop: normalize(30),
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: normalize(40),
  },
  signup: {
    flex: 0.45,
    backgroundColor: COLORS.lightGrey
  },
  signupLabel: {
    color: COLORS.primary
  },
  signin: {
    flex: 0.45,
    backgroundColor: COLORS.primary    
  },
  signinLabel: {
    color: COLORS.lightGrey
  }
});

export default Welcome;
