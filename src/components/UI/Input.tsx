import React from 'react';
import {
  TextInput,
  View,
  Image,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import {normalize} from '../../utils/util';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
  inputStyle?: TextStyle;
  errorMessage?: string;
  errorStyle?: TextStyle;
  icon?: ImageSourcePropType;
  showCountryCode?: boolean;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({
  icon,
  style,
  placeholder,
  onBlur,
  onChangeText,
  value,
  errorMessage,
  errorStyle,
  inputStyle,
  maxLength,
  keyboardType = 'default',
  secureTextEntry = false,
  showCountryCode = false,
}) => {
  return (
    <View style={style}>
      <View style={styles.inputContainer}>
        {icon && <Image source={icon} style={styles.icon} />}
        <View
          style={{
            flex: 1,
            // backgroundColor: 'blue',
            borderBottomColor: COLORS.light,
            borderBottomWidth: 1,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          {showCountryCode && (
            <View
              style={{
                // paddingLeft: 30,
                // justifyContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 100,
                // marginTop: -15,
              }}>
              <Text
                style={{
                  backgroundColor: COLORS.lightPurple,
                  borderRadius: 5,
                  width: 40,
                  // height: 20,
                  textAlign: 'center',
                  paddingVertical: 5,
                }}>
                +231
              </Text>
            </View>
          )}
          <TextInput
            style={[
              styles.input,
              !!errorMessage && styles.errorInput,
              inputStyle,
              showCountryCode
                ? {paddingLeft: 10, width: '100%'}
                : {paddingLeft: 10, width: '95%', marginLeft: 30},
            ]}
            placeholder={placeholder}
            onBlur={onBlur}
            maxLength={maxLength}
            onChangeText={onChangeText}
            placeholderTextColor={COLORS.grey}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
          />
        </View>
      </View>
      {errorMessage && (
        <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: normalize(12),
    paddingBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'blue',
    flex: 1,
    // borderBottomWidth: 1,
    // borderBottomColor:
  },
  input: {
    height: 50,
    // width: '100%',
    // flex: 1,
    // flexGrow: 1,

    // paddingLeft: 10,
    // marginBottom: 15,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONTS.regular,
    color: COLORS.secondary,
    // backgroundColor: 'blue',
  },
  errorInput: {
    borderColor: 'red',
    // backgroundColor: 'red',
  },
  errorText: {
    color: 'red',
    fontFamily: FONTS.light,
    fontSize: FONT_SIZES.XSMALL,
    // marginTop: -10,
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    top: 12,
    // marginBottom: 10,
    width: 24,
    height: 24,
    // backgroundColor: 'lime',
  },
});

export default Input;
