import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {OtpScreenProps} from '../../navigation/types';
import {normalize, topInsets} from '../../utils/util';
import {bgImage} from '../../constants/images';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import Button from '../../components/UI/Button';
import OTPInput from '../../components/UI/OTPInput';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderBack from '../../components/UI/HeaderBack';
import {userContext} from '../../contexts/UserContext';
import {useAppDispatch, useAppSelector} from '../../store/storage';
import {verifyOtp} from '../../api/auth';
import {signupActions} from '../../store/slices/signup.slice';
import ErrorText from '../../components/UI/ErrorText';

const Otp: React.FC<OtpScreenProps> = ({navigation, route}) => {
  // const { user } = route.params;
  const insets = useSafeAreaInsets();
  const {navigate} = navigation;
  const {login} = userContext();
  const user = useAppSelector(state => state.signup);
  const dispatch = useAppDispatch();
  const [errorText, setErrorText] = useState<string | null>(null);

  console.log(user);

  const [otp, setOtp] = useState<[]>([]);

  const handleOTP = async (otp: string[]) => {
    const otpCode = otp.filter(item => item !== '');
    if (otpCode.length === 4) {
      const userData = await verifyOtp({
        phone: user.phone,
        verificationCode: otp.join(''),
      });
      if (userData?.user) {
        dispatch(signupActions.saveInitialUserDetail(userData.user));
        navigate('PersonalDetail');
      }
      if (userData?.errors) {
        setErrorText(userData.errors);
        setTimeout(() => {
          setErrorText(null);
        }, 3000);
      }

      // if (user?.accountType === 'Vendor') {
      // } else {
      //   login(user);
      // }
    }
  };

  function goToSignUp() {
    // navigate('SignUp')
  }

  return (
    <ImageBackground
      source={bgImage}
      style={[styles.container, {paddingBottom: insets.bottom}]}>
      <KeyboardAvoidingView
        style={[styles.avoidingView, {paddingTop: topInsets(10)}]}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        <HeaderBack navigation={navigation} />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <View style={styles.logoContainer}>
            <Text style={styles.headingText}>Phone Verification</Text>
            <Text style={styles.paraText}>
              Please enter the 4-digit code send to you at
            </Text>
            <Text style={styles.phoneNumber}>+231 {user.phone}</Text>
            <Button
              label="Resend Code"
              onPress={goToSignUp}
              style={styles.resendBtn}
              labelStyle={styles.resendBtnText}></Button>
            {errorText && <ErrorText text={errorText} />}
            <OTPInput handleOTP={handleOTP} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    paddingBottom: normalize(30),
  },
  avoidingView: {
    flex: 1,
  },
  scrollView: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    paddingHorizontal: normalize(20),
    // paddingBottom: normalize(70),
  },
  logo: {
    width: 186,
    height: 133,
    resizeMode: 'contain',
    marginBottom: normalize(50),
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headingText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.XLARGE,
    color: COLORS.black,
  },
  paraText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.black,
  },
  resendBtnText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
  },
  phoneNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.primary,
    paddingTop: 2,
  },
  resendBtn: {
    backgroundColor: COLORS.transparent,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
  },
  backButton: {
    flex: 1,
  },
});

export default Otp;
