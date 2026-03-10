import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {LoginScreenProps} from '../../navigation/types';
import {bottomInsets, normalize, topInsets} from '../../utils/util';
import {
  logoImg,
  bgImage,
  apple,
  x,
  facebook,
  phoneIcon,
  privacyIcon,
  keyIcon,
} from '../../constants/images';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import Button from '../../components/UI/Button';
import ButtonIcon from '../../components/UI/ButtonIcon';
import HeaderBack from '../../components/UI/HeaderBack';
import {useForm, Controller} from 'react-hook-form';
import Input from '../../components/UI/Input';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {loginHandler} from '../../api/auth';
import {userContext} from '../../contexts/UserContext';
import {useDispatch} from 'react-redux';
import {authActions} from '../../store/slices/auth.slice';
import ErrorText from '../../components/UI/ErrorText';

const dummyUser = {
  id: Date.now().toString(),
  name: 'John Wick',
  phone: '+231 578 409 170',
  accountType: 'Customer',
};

type FormData = {
  phone: string;
  password: string;
};

const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(9, 'Must be exactly 9 digits')
    .max(9, 'Must be exactly 9 digits')
    .required('Phone Number is required'),
  password: yup
    .string()
    .min(5, 'Must be minimum 5 characters long')
    .required('Password is required'),
});

const Login: React.FC<LoginScreenProps> = ({navigation}) => {
  const {navigate} = navigation;
  const {login} = userContext();
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('FORM DATA:', data);
    const userData = await loginHandler(data);
    if (userData.errors) {
      setErrorText(userData.errors);
      setTimeout(() => {
        setErrorText('');
      }, 3000);
      return;
    }
    login(userData);
    dispatch(authActions.saveAuthToken({authToken: userData.user.jwtToken}));
    dispatch(authActions.saveUserDetail(userData.user));
    // navigate('Otp', {user: dummyUser});
  };

  function goToSignup() {
    navigate('Signup');
  }

  function socialLogin() {
    //
  }

  return (
    <ImageBackground
      source={bgImage}
      style={[styles.container, {paddingBottom: bottomInsets()}]}>
      <KeyboardAvoidingView
        style={[styles.avoidingView, {paddingTop: topInsets(10)}]}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
        <HeaderBack navigation={navigation} />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={logoImg} />
            <Text style={styles.headingText}>Welcome Back!</Text>
            <Text style={styles.paraText}>
              Enter your Phone Number to proceed
            </Text>
          </View>

          <Controller
            control={control}
            name="phone"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={phoneIcon}
                placeholder="Your phone number"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                maxLength={9}
                errorMessage={errors.phone?.message}
                keyboardType="numeric"
                showCountryCode
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={keyIcon}
                placeholder="Enter Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                keyboardType="default"
              />
            )}
          />
          {errorText && <ErrorText text={errorText} />}

          <View style={styles.buttons}>
            <Button
              label="Login"
              style={styles.sendOTP}
              labelStyle={styles.sendOTPLabel}
              onPress={handleSubmit(onSubmit)}></Button>
            <View style={styles.row}>
              <Text style={styles.text}>You don't have an account?</Text>
              <Button
                label="Sign Up"
                onPress={goToSignup}
                style={styles.signup}
                labelStyle={[styles.text, styles.signupLabel]}></Button>
            </View>
          </View>

          {/* <View style={styles.socialLoginContainer}>
            <Text style={[styles.text, styles.socialText]}>
              Use Social Login
            </Text>

            <View style={styles.socialIconsContainer}>
              <ButtonIcon
                style={styles.socialIcon}
                onPress={socialLogin}
                icon={x}
              />
              <ButtonIcon
                style={styles.socialIcon}
                onPress={socialLogin}
                icon={facebook}
              />
              <ButtonIcon
                style={styles.socialIcon}
                onPress={socialLogin}
                icon={apple}
              />
            </View>
          </View> */}
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
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: normalize(20),
  },
  avoidingView: {
    flex: 1,
  },
  logoContainer: {
    paddingVertical: normalize(30),
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
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  buttons: {
    paddingTop: normalize(10),
  },
  sendOTP: {
    backgroundColor: COLORS.primary,
    borderRadius: 60,
  },
  sendOTPLabel: {
    color: COLORS.lightGrey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.black,
  },
  signup: {
    paddingHorizontal: 0,
  },
  signupLabel: {
    color: COLORS.primary,
  },
  socialLoginContainer: {
    alignItems: 'center',
    paddingTop: normalize(60),
  },
  socialText: {
    fontSize: FONT_SIZES.XSMALL,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    paddingTop: 14,
  },
  socialIcon: {
    marginRight: 15,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey,
  },
});

export default Login;
