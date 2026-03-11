import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../themes/styles';
import {
  logoImg,
  userIcon,
  userIconLight,
  bellDark,
  bellLight,
  chevronLeft,
  orangelogo,
} from '../constants/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {normalize} from '../utils/util';
import navigationService from '../navigation/navigationService';

interface HeaderProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  mode?: string;
  onPress?: () => void;
  goBack?: boolean;
  showButtons?: boolean;
  otherTextStyle?: {[key: string]: any};
  icons?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title = '',
  goBack = false,
  style,
  mode = 'light',
  icons = true,
  ...otherTextStyle
}) => {
  function openNotifications() {
    navigationService.navigate('InAppNotifications');
  }

  function openProfile() {
    navigationService.navigate('Profile');
  }

  return (
    <SafeAreaView style={[styles.headerContainer, style, styles.withoutIcons]}>
      {goBack ? (
        <View style={styles.inline}>
          <TouchableOpacity
            style={styles.leftIconContainer}
            onPress={navigationService.goBack}>
            <Image source={chevronLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} {...otherTextStyle}>
            {title}
          </Text>
        </View>
      ) : (
        <View style={[styles.logoContainer, styles.isLogo]}>
          <Image source={logoImg} style={styles.logo} />
          <Image source={orangelogo} style={styles.secondaryLogo} />
        </View>
      )}
      {icons && (
        <View style={styles.icons}>
          {title !== 'Notifications' && (
            <TouchableOpacity
              onPress={openNotifications}
              style={[styles.iconButton, mode === 'dark' && styles.darkBg]}>
              <Image
                source={mode === 'dark' ? bellLight : bellDark}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          {title !== 'My Profile' && (
            <TouchableOpacity
              onPress={openProfile}
              style={[styles.iconButton, mode === 'dark' && styles.darkBg]}>
              <Image
                source={mode === 'dark' ? userIconLight : userIcon}
                style={styles.iconResize}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.select({
      ios: normalize(10),
    }),
    height: normalize(110),
    alignItems: 'center',
    paddingRight: normalize(16),
    backgroundColor: COLORS.white,
  },
  containerSpace: {},
  isLogo: {
    paddingLeft: normalize(16),
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.heading,
    marginTop: Platform.select({
      ios: normalize(-1.5),
      android: normalize(3),
    }),
  },
  darkBg: {
    backgroundColor: COLORS.primaryDark,
  },
  leftIconContainer: {
    padding: normalize(10),
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 69,
    height: 50,
    resizeMode: 'contain',
  },
  secondaryLogo: {
    width: 69,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  icons: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    padding: 10,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 50,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  icon: {
    width: normalize(22),
    height: normalize(20),
    resizeMode: 'contain',
  },
  iconResize: {
    width: normalize(18),
    height: normalize(20),
  },
});

export default Header;
