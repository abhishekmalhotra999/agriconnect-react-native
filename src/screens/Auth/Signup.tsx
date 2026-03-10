import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SignupScreenProps} from '../../navigation/types';
import {normalize, topInsets, bottomInsets} from '../../utils/util';
import {
  logoImg,
  bgImage,
  apple,
  x,
  facebook,
  userIcon,
  phoneIcon,
} from '../../constants/images';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import Button from '../../components/UI/Button';
import ButtonIcon from '../../components/UI/ButtonIcon';
import Input from '../../components/UI/Input';
import HeaderBack from '../../components/UI/HeaderBack';
import Filters from '../../components/UI/Filters';
import ConnectDots from '../../components/UI/ConnectDots';
import Separator from '../../components/UI/Separator';
import {useAppDispatch} from '../../store/storage';
import {signupActions} from '../../store/slices/signup.slice';
import {sendOtp} from '../../api/auth';
import ErrorText from '../../components/UI/ErrorText';

const options = ['Customer', 'Farmer', 'Technician'];

type FormData = {
  id: string;
  name: string;
  phone: string;
  accountType: string;
  avatar: object;
};

const schema = yup.object().shape({
  id: yup.string().default(() => Date.now().toString()),
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(9, 'Phone number can be minimum 9 numbers long')
    .max(9, 'Phone number can be maximum 9 numbers long')
    .required('Phone Number is required'),
  accountType: yup.string().default('Customer'),
  avatar: yup.object().default({}),
});

const Signup: React.FC<SignupScreenProps> = ({navigation}) => {
  const {navigate} = navigation;
  const dispatch = useAppDispatch();
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  function goToLogin() {
    navigate('Login');
  }

  function socialLogin() {
    //
  }

  const onSubmit = async (data: FormData) => {
    console.log('FORM DATA:', data);
    const responseData = await sendOtp(data);
    console.log('data', data);
    if (responseData.errors) {
      // setError('phone', {
      //   type: 'mannual',
      //   message: responseData.errors,
      // });
      setErrorText(responseData.errors);
      setTimeout(() => {
        setErrorText(null);
      }, 1500);
    } else {
      dispatch(signupActions.saveSignDetail(data));
      navigate('Otp');
    }
  };

  useEffect(() => {
    setValue('accountType', 'Customer');
  }, [setValue]);

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
            <ConnectDots
              highlightDot1={true}
              highlightDot2={false}
              highlightLine={false}
              dotSize={10}
            />
            <Separator spacing={5} />
            <Text style={styles.headingText}>Welcome</Text>
            <Text style={styles.paraText}>
              Enter your Name & Phone Number to proceed
            </Text>
          </View>

          <Controller
            control={control}
            name="accountType"
            render={({field: {onChange, onBlur, value}}) => (
              <Filters
                options={options}
                scrollEnabled={false}
                style={styles.filterContainer}
                itemStyle={styles.filterStyle}
                activeFilter={value}
                onFilterChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="name"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={userIcon}
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
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
          {errorText && <ErrorText text={errorText} />}
          <View>
            <Button
              label="Send OTP"
              style={styles.sendOTP}
              labelStyle={styles.sendOTPLabel}
              onPress={handleSubmit(onSubmit)}></Button>
            <View style={styles.row}>
              <Text style={styles.text}>Already have an account?</Text>
              <Button
                label="Sign In"
                onPress={goToLogin}
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
    paddingTop: normalize(10),
    paddingBottom: normalize(30),
  },
  logo: {
    width: 140,
    height: 110,
    resizeMode: 'contain',
    marginBottom: normalize(30),
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
  sendOTP: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 60,
  },
  sendOTPLabel: {
    color: COLORS.primary,
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
    paddingTop: normalize(20),
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
  filterContainer: {
    paddingTop: 0,
    paddingLeft: 0,
  },
  filterStyle: {
    flex: 1,
    borderRadius: 5,
    marginBottom: normalize(5),
    paddingHorizontal: normalize(10),
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
});

export default Signup;
