import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../../../components/UI/Button';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

type DeliveryInstructionsProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
  savedMessage?: string;
};

const DeliveryInstructions: React.FC<DeliveryInstructionsProps> = ({
  value,
  onChangeText,
  onSave,
  disabled = false,
  savedMessage,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Delivery Instructions</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        placeholder="e.g. Call before arrival, gate code, preferred time"
        placeholderTextColor="#909CB0"
        style={styles.input}
      />
      <Button
        onPress={onSave}
        disabled={disabled}
        label="Save Instructions"
        style={[styles.saveBtn, disabled && styles.saveBtnDisabled]}
        labelStyle={styles.saveBtnLabel}
      />
      {!!savedMessage && <Text style={styles.savedText}>{savedMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E6EBF3',
    backgroundColor: '#FCFDFE',
    borderRadius: normalize(14),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(12),
    marginBottom: normalize(20),
  },
  heading: {
    color: '#444C5E',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
    marginBottom: normalize(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9E1EE',
    borderRadius: normalize(10),
    minHeight: normalize(68),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  saveBtn: {
    marginTop: normalize(8),
    backgroundColor: '#2D74B8',
    borderRadius: normalize(10),
    paddingVertical: normalize(8),
  },
  saveBtnDisabled: {
    backgroundColor: '#BFD2E7',
  },
  saveBtnLabel: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  savedText: {
    marginTop: normalize(6),
    color: COLORS.darkGreen,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default DeliveryInstructions;