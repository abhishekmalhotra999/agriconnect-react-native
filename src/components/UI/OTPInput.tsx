import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, TextInput, Alert, StyleSheet} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import {normalize} from '../../utils/util';

interface OTPInputProps {
  handleOTP: (otp: any) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({handleOTP}) => {
  const inputRef = useRef<TextInput>(null);
  const [otpDigits, setOTP] = useState<string[]>(['', '', '', '']);
  const otpInputRefs = Array(4)
    .fill(0)
    .map((_, i) => React.createRef<TextInput>());

  const handleChangeText = (text: string, index: number) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = text;

    setOTP(newOtpDigits);
    handleOTP(newOtpDigits);

    if (text !== '' && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpCode = otpDigits.join('');
    Alert.alert('OTP Verified:', otpCode);
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        if (otpInputRefs[0].current) {
          otpInputRefs[0].current.focus();
        }
      }, 100);
    }, []),
  );

  return (
    <View style={styles.inputContainer}>
      {otpDigits.map((digit, index) => (
        <TextInput
          key={index}
          ref={otpInputRefs[index]}
          style={[styles.input, digit && styles.inputFilled]}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={text => handleChangeText(text, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: normalize(30),
    marginBottom: normalize(80),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 50,
    backgroundColor: COLORS.lightGrey,
    width: 56,
    height: 56,
    marginRight: 15,
    textAlign: 'center',
    fontSize: FONT_SIZES.LARGE,
    fontFamily: FONTS.regular,
  },
  inputFilled: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
  },
});

export default OTPInput;
