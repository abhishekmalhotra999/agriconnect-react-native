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
    borderColor: '#E6EBF3',
    backgroundColor: '#FCFDFE',
    borderRadius: normalize(14),
    paddingVertical: normalize(12),
    marginBottom: normalize(20),
  },
  labelStyle: {
    alignSelf: 'flex-start',
    color: '#444C5E',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  }
});

export default DeliveryInstructions;