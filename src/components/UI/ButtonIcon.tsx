import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ViewStyle, StyleProp, ImageSourcePropType, ImageStyle } from 'react-native';
import { COLORS } from '../../themes/styles';

type ButtonIconProps = {
  icon: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  onPress: () => void;
};

const ButtonIcon: React.FC<ButtonIconProps> = ({ 
  icon,
  style,
  iconStyle,
  onPress
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Image source={icon} style={[styles.icon, iconStyle]}/>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    margin: 2,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default ButtonIcon;