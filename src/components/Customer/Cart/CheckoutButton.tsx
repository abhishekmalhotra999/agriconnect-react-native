import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Button from '../../../components/UI/Button';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

type CheckoutButtonProps = {
  label: string,
  style?: StyleProp<ViewStyle>,
  onPress: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  label,
  style,
  onPress
}) => {
  return (
    <Button 
      onPress={onPress}
      label={label} 
      style={[styles.btnStyle, style]} 
      labelStyle={styles.labelStyle} 
    />
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.lightGrey,
    marginTop: normalize(10),
    paddingVertical: normalize(12),
    borderRadius: 30,
  },
  labelStyle: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  }
});

export default CheckoutButton;