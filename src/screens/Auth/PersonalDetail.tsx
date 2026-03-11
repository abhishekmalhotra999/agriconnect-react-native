import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {PersonalDetailScreenProps} from '../../navigation/types';
import {normalize, topInsets, bottomInsets} from '../../utils/util';
import {bgImage, emailIcon, addressIcon, keyIcon} from '../../constants/images';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import Button from '../../components/UI/Button';
// import NumberSlider from '../../components/UI/NumberSlider';
import Input from '../../components/UI/Input';
import ConnectDots from '../../components/UI/ConnectDots';
import HeaderBack from '../../components/UI/HeaderBack';
import {useAppDispatch, useAppSelector} from '../../store/storage';
import {signup} from '../../api/auth';
import {signupActions} from '../../store/slices/signup.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userContext} from '../../contexts/UserContext';
import {authActions} from '../../store/slices/auth.slice';
import ErrorText from '../../components/UI/ErrorText';
import {requiresFirmDetailsStep} from './signupFlow';

type FormData = {
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
  // yearsOfExp: number;
};

const schema = yup.object().shape({
  email: yup.string().required('Email is required'),
  address: yup.string().required('Address is required'),
  password: yup
    .string()
    .min(6, 'Password should be minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .min(6, 'Password should be minimum 6 characters length')
    .required('Password is required'),
  // yearsOfExp: yup.number()
  //   .min(0, 'Years of experience must be a positive number')
  //   .integer('Years of experience must be an integer')
  //   .default(3)
});

const PersonalDetail: React.FC<PersonalDetailScreenProps> = ({navigation}) => {
  const {navigate} = navigation;
  const authData = useAppSelector(state => state.signup);
  const dispatch = useAppDispatch();
  const {login} = userContext();
  const [errorText, setErrorText] = useState<string | null>(null);

  // const numbers = Array.from({length: 51}, (_, i) => i);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });

  function locate() {
    //
  }

  const onSubmit = async (data: FormData) => {
    console.log('FORM DATA:', data);

    if (requiresFirmDetailsStep(authData.accountType)) {
      navigate('FirmDetail', {
        accountType: authData.accountType,
        personalDetails: {
          ...data,
          phone: authData.phone,
          name: authData.name,
          professionType: authData.accountType,
        },
      });
      return;
    }

    const signupResponse = await signup({
      ...data,
      professionType: authData.accountType,
      phone: authData.phone,
      name: authData.name,
    });
    if (signupResponse.errors) {
      setErrorText(signupResponse.errors);
      setTimeout(() => {
        setErrorText(null);
      }, 3000);
    }
    if (signupResponse?.user) {
      dispatch(signupActions.saveInitialUserDetail(signupResponse.user));
      if (signupResponse.user.profile.professionType == 'Customer') {
        await AsyncStorage.setItem('authToken', signupResponse.user.jwtToken);
        dispatch(authActions.saveUserDetail(signupResponse.user));
        dispatch(
          authActions.saveAuthToken({authToken: signupResponse.user.jwtToken}),
        );
        login(signupResponse.user);
      } else {
        navigate('FirmDetail', {
          accountType: signupResponse.user.profile.professionType,
        });
      }
    }
    console.log('signup response', signupResponse);
    // navigate('FirmDetail');
  };

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
          <View style={styles.formContainer}>
            <ConnectDots
              highlightDot1={true}
              highlightDot2={false}
              highlightLine={false}
              dotSize={10}
            />
            <View style={styles.heading}>
              <Text style={styles.headingText}>Your Details</Text>
              <Text style={styles.paraText}>Enter your details to proceed</Text>
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={emailIcon}
                placeholder="Mail Id"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={keyIcon}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={keyIcon}
                placeholder="confirm password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirmPassword?.message}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                icon={addressIcon}
                placeholder="Your Address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.address?.message}
              />
            )}
          />
          {/* <View style={styles.expContainer}>
            <Text style={[styles.text, styles.yearsOfExp]}>
              Years of experience
            </Text>
            <Controller
              control={control}
              name="yearsOfExp"
              render={({field: {onChange, onBlur, value}}) => (
                <NumberSlider
                  numbers={numbers}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View> */}
          {errorText && <ErrorText text={errorText} />}
          <View style={styles.footerContainer}>
            <Button
              label="Next →"
              style={styles.goNext}
              labelStyle={styles.goNextlabel}
              onPress={handleSubmit(onSubmit)}
            />
            {/* <View style={styles.footer}>
              <Text style={[styles.text, styles.center]}>
                Turn your location on to autofill your address
              </Text>
              <Button
                label="Enable Location"
                onPress={locate}
                style={styles.signup}
                labelStyle={[styles.text, styles.signupLabel]}
              />
            </View> */}
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
  avoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: normalize(20),
  },
  formContainer: {
    paddingTop: normalize(30),
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
  expContainer: {
    paddingTop: normalize(50),
    paddingBottom: normalize(30),
  },
  yearsOfExp: {
    paddingBottom: normalize(20),
  },
  goNext: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    borderRadius: 60,
  },
  goNextlabel: {
    color: COLORS.white,
  },
  footerContainer: {},
  footer: {
    paddingTop: normalize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.black,
  },
  heading: {
    paddingBottom: normalize(30),
  },
  center: {
    textAlign: 'center',
    marginHorizontal: 20,
  },
  signup: {
    paddingHorizontal: 0,
  },
  signupLabel: {
    color: COLORS.primary,
  },
});

export default PersonalDetail;
