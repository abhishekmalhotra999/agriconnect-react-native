import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../../components/UI/Button';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

type CouponInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onApply: () => void;
  disabled?: boolean;
  feedbackText?: string;
  feedbackType?: 'success' | 'error';
};

const CouponInput: React.FC<CouponInputProps> = ({
  value,
  onChangeText,
  onApply,
  disabled = false,
  feedbackText,
  feedbackType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Apply Coupon</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Enter coupon code"
          placeholderTextColor="#909CB0"
          autoCapitalize="characters"
          editable={!disabled}
          style={styles.input}
        />
        <Button
          onPress={onApply}
          label="Apply"
          disabled={disabled || value.trim().length === 0}
          style={[styles.applyBtn, disabled && styles.applyBtnDisabled]}
          labelStyle={styles.applyBtnLabel}
        />
      </View>
      {!!feedbackText && (
        <Text
          style={[
            styles.feedback,
            feedbackType === 'error' ? styles.feedbackError : styles.feedbackSuccess,
          ]}>
          {feedbackText}
        </Text>
      )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9E1EE',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    marginRight: normalize(8),
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: normalize(10),
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(8),
  },
  applyBtnDisabled: {
    backgroundColor: '#C6D1E0',
  },
  applyBtnLabel: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  feedback: {
    marginTop: normalize(8),
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  feedbackSuccess: {
    color: COLORS.darkGreen,
  },
  feedbackError: {
    color: '#C14B4B',
  },
});

export default CouponInput;