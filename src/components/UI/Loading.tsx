import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import {normalize} from '../../utils/util';

interface LoadingProps {
  visible: boolean;
  message?: string;
  inline?: boolean;
}

const logo = require('../../../assets/images/logo.png');

const Loading: React.FC<LoadingProps> = ({visible, message, inline = false}) => {
  const pulse = useRef(new Animated.Value(0.92)).current;
  const glow = useRef(new Animated.Value(0.35)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.92,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.7,
          duration: 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0.35,
          duration: 550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );

    pulseLoop.start();
    glowLoop.start();
    spinLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
      spinLoop.stop();
      pulse.setValue(0.92);
      glow.setValue(0.35);
      spin.setValue(0);
    };
  }, [glow, pulse, spin, visible]);

  if (!visible) {
    return null;
  }

  const spinRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, inline ? styles.inlineContainer : styles.overlayContainer]}>
      <View style={[styles.loaderCard, inline && styles.loaderCardInline]}>
        <Animated.View style={[styles.glow, {opacity: glow, transform: [{scale: pulse}]}]} />
        <Animated.View style={[styles.spinRing, {transform: [{rotate: spinRotate}]}]} />
        <Animated.Image source={logo} style={[styles.logo, {transform: [{scale: pulse}]}]} />
        <Text style={styles.loadingText}>{message || 'Preparing your experience'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  inlineContainer: {
    paddingVertical: normalize(10),
  },
  loaderCard: {
    width: normalize(210),
    borderRadius: normalize(18),
    paddingVertical: normalize(18),
    paddingHorizontal: normalize(14),
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    alignItems: 'center',
    overflow: 'hidden',
  },
  loaderCardInline: {
    width: normalize(190),
    paddingVertical: normalize(14),
  },
  glow: {
    position: 'absolute',
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: COLORS.primaryLight,
    top: normalize(7),
  },
  spinRing: {
    position: 'absolute',
    width: normalize(74),
    height: normalize(74),
    borderRadius: normalize(37),
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderTopColor: COLORS.white,
    top: normalize(20),
  },
  logo: {
    width: normalize(44),
    height: normalize(44),
    resizeMode: 'contain',
    marginTop: normalize(18),
    marginBottom: normalize(24),
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    textAlign: 'center',
  },
});

export default Loading;