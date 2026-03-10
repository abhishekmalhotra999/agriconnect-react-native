import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';

type ButtonProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  disabled: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  style,
  labelStyle,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style]}
    disabled={disabled}>
    <Text style={[styles.buttonText, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    margin: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.MEDIUM,
  },
});

export default Button;
