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
import {FirmDetailScreenProps} from '../../navigation/types';
import {normalize, topInsets, bottomInsets} from '../../utils/util';
import {
  bgImage,
  emailIcon,
  addressIcon,
  bankIcon,
  linkIcon,
  weightIcon,
  landcoverIcon,
} from '../../constants/images';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {COLORS, FONTS, FONT_SIZES} from '../../themes/styles';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import HeaderBack from '../../components/UI/HeaderBack';
import ConnectDots from '../../components/UI/ConnectDots';
import {userContext} from '../../contexts/UserContext';
import NumberSlider from '../../components/UI/NumberSlider';
import {useAppDispatch, useAppSelector} from '../../store/storage';
import {signup} from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authActions} from '../../store/slices/auth.slice';
import ErrorText from '../../components/UI/ErrorText';

type FormData = {
  technicianType?: string;
  yearsOfExperience: string;
};
type FarmerFormData = {
  farmingType: string;
  yearsOfExperience: string;
  farmSize: string;
};

const TechnicianSchema = yup.object().shape({
  technicianType: yup.string().required('Type of Technician is required'),
  yearsOfExperience: yup.string().required('Years of Experience is required'),
  // shopUrl: yup.string().required('Crop volume is required'),
  // companyName: yup.string().required('Expected turnover is required'),
  // bankName: yup.string().default(''),
  // iban: yup.string().default(''),
});
const FarmingSchema = yup.object().shape({
  farmingType: yup.string().required('type of farming is required'),
  yearsOfExperience: yup.string().required('Years of Experience is required'),
  farmSize: yup.string().required('farm size is required'),
  // shopUrl: yup.string().required('Crop volume is required'),
  // companyName: yup.string().required('Expected turnover is required'),
  // bankName: yup.string().default(''),
  // iban: yup.string().default(''),
});

const FirmDetail: React.FC<FirmDetailScreenProps> = ({navigation, route}) => {
  const {accountType} = route.params;
  const {navigate} = navigation;
  const {login} = userContext();
  const userDetail = useAppSelector(state => state.signup);
  const numbers = Array.from({length: 51}, (_, i) => i);
  const dispatch = useAppDispatch();
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    resolver:
      accountType == 'Farmer'
        ? yupResolver(FarmingSchema)
        : yupResolver(TechnicianSchema),
  });

  function locate() {
    //
  }

  const onSubmit = async (data: FormData) => {
    console.log('FORM DATA:', data);
    const responseData = await signup({
      ...data,
      phone: userDetail.phone,
      email: userDetail.email,
      professionType: userDetail.profile.professionType,
      address: userDetail.profile.address,
    });
    if (responseData.errors) {
      setErrorText(responseData.errors);
      setTimeout(() => {
        setErrorText(null);
      }, 3000);
    }
    if (responseData.user) {
      await AsyncStorage.setItem('authToken', responseData.user.jwtToken);
      login(responseData);
      dispatch(
        authActions.saveAuthToken({authToken: responseData.user.jwtToken}),
      );
      dispatch(authActions.saveUserDetail(responseData.user));
    }
    console.log('response dat', responseData);
    // const dummyUser = {
    //   id: '1122232',
    //   name: 'Test User',
    //   phone: '8130950367',
    //   accountType: 'Vendor',
    // };
    // login(dummyUser);
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
              highlightDot2={true}
              highlightLine={true}
              dotSize={10}
            />
            <View style={styles.heading}>
              <Text style={styles.headingText}>Professional Detail</Text>
              <Text style={styles.paraText}>
                Enter your professional details to proceed
              </Text>
            </View>

            {accountType == 'Farmer' ? (
              <Controller
                control={control}
                name="farmingType"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    icon={weightIcon}
                    placeholder="Type of farming"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.farmingType?.message}
                  />
                )}
              />
            ) : (
              <Controller
                control={control}
                name="technicianType"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    icon={weightIcon}
                    placeholder="Type of technician"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.technicianType?.message}
                  />
                )}
              />
            )}

            {accountType == 'Farmer' && (
              <Controller
                control={control}
                name="farmSize"
                render={({field: {onChange, onBlur, value}}) => (
                  <Input
                    icon={landcoverIcon}
                    placeholder="Size of farm (in acre or hectare)"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.farmSize?.message}
                  />
                )}
              />
            )}

            {/* <View style={styles.expContainer}> */}
            <Text style={[styles.text, styles.yearsOfExp]}>
              Years of experience
            </Text>
            <Controller
              control={control}
              name="yearsOfExperience"
              render={({field: {onChange, onBlur, value}}) => (
                <NumberSlider
                  numbers={numbers}
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            {/* </View> */}
            {/* <Controller
              control={control}
              name="shopUrl"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  icon={linkIcon}
                  placeholder="Shop URL"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.shopUrl?.message}
                />
              )}
            /> */}
            {/* <Controller
              control={control}
              name="companyName"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  icon={addressIcon}
                  placeholder="Company Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.companyName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="bankName"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  icon={bankIcon}
                  placeholder="Bank Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.bankName?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="iban"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  icon={addressIcon}
                  placeholder="Bank IBAN"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.iban?.message}
                />
              )}
            /> */}
          </View>
          {errorText && <ErrorText text={errorText} />}
          <View style={styles.footerContainer}>
            <Button
              label="Submit Now"
              style={styles.goNext}
              labelStyle={styles.goNextlabel}
              onPress={handleSubmit(onSubmit)}
            />
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
  heading: {
    paddingBottom: normalize(30),
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
  footerContainer: {
    paddingTop: normalize(40),
  },
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

export default FirmDetail;
