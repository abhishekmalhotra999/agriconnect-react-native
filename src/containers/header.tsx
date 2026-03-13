import React, {useCallback, useEffect, useState} from 'react';
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
import {useIsFocused} from '@react-navigation/native';
import {getCartItems} from '../store/cart.storage';
import Svg, {Path} from 'react-native-svg';

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
  const isFocused = useIsFocused();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = useCallback(async () => {
    try {
      const cartItems = await getCartItems();
      const nextCount = cartItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
      );
      setCartCount(nextCount);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    loadCartCount();
  }, [isFocused, loadCartCount]);

  function openNotifications() {
    navigationService.navigate('InAppNotifications');
  }

  function openCart() {
    navigationService.navigate('Cart' as never);
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
          {title !== 'My Cart' && (
            <TouchableOpacity
              onPress={openCart}
              style={[styles.cartButton, mode === 'dark' && styles.darkBg]}>
              <Svg
                width={normalize(20)}
                height={normalize(20)}
                viewBox="0 0 24 24"
                fill="none">
                <Path
                  d="M3 4H5L7.4 14.2C7.5 14.7 7.9 15 8.4 15H17.5C18 15 18.5 14.6 18.6 14.1L20 8H6.2"
                  stroke={COLORS.darkText}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M9 20C9.55 20 10 19.55 10 19C10 18.45 9.55 18 9 18C8.45 18 8 18.45 8 19C8 19.55 8.45 20 9 20Z"
                  fill={COLORS.darkText}
                />
                <Path
                  d="M17 20C17.55 20 18 19.55 18 19C18 18.45 17.55 18 17 18C16.45 18 16 18.45 16 19C16 19.55 16.45 20 17 20Z"
                  fill={COLORS.darkText}
                />
              </Svg>
              {cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? '99+' : String(cartCount)}
                  </Text>
                </View>
              ) : null}
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
    width: normalize(42),
    height: normalize(42),
    padding: 0,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    marginLeft: 16,
    width: normalize(42),
    height: normalize(42),
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: normalize(1),
    right: normalize(1),
    minWidth: normalize(15),
    height: normalize(15),
    borderRadius: normalize(7.5),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(3),
  },
  badgeText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: normalize(8),
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  icon: {
    width: normalize(20),
    height: normalize(18),
    resizeMode: 'contain',
  },
  iconResize: {
    width: normalize(16),
    height: normalize(18),
  },
});

export default Header;
