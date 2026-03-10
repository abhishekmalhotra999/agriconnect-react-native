import React from 'react';
import { StyleSheet } from 'react-native';
import Button from '../../../components/UI/Button';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

const DeliveryInstructions: React.FC = () => {
  return (
    <Button 
      onPress={()=>{}} 
      label="Add Delivery Instructions" 
      style={styles.btnStyle} 
      labelStyle={styles.labelStyle} 
    />
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderWidth: 1, 
    borderColor: COLORS.lightGrey,
    marginBottom: normalize(20),
  },
  labelStyle: {
    alignSelf: 'flex-start', 
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  }
});

export default DeliveryInstructions;