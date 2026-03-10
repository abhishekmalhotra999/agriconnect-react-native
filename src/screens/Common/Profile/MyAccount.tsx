import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Header from '../../../containers/header';
import {normalize} from '../../../utils/util';
import ProfileUserCard from '../../../components/Common/Profile/ProfileUserCard';
import Button from '../../../components/UI/Button';
import {COLORS} from '../../../themes/styles';
import BgInput from '../../../components/UI/BgInput';
import NumberSlider from '../../../components/UI/NumberSlider';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from '../../../store/storage';
import {updateUserDetail} from '../../../api/user';
import {authActions} from '../../../store/slices/auth.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = yup.object().shape({});

const MyAccount: React.FC<{}> = () => {
  const [profileImage, setProfileImage] = useState<Asset | null>(null);
  const [submittingProfile, setSubmittingProfile] = useState<boolean>(false);
  const {userDetail} = useAppSelector(state => state.auth);
  const {
    handleSubmit,
    control,
    setValue,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});
  const dispatch = useAppDispatch();
  console.log('user deta', userDetail);

  useEffect(() => {
    if (userDetail) {
      console.log(userDetail);
      setProfileImage({uri: userDetail.profile.userImage});
      setValue('name', userDetail.name);
      setValue('email', userDetail.email);
      setValue('address', userDetail.profile.address);
      setValue('farmSize', userDetail.profile.farmSize);
      setValue('professionType', userDetail.profile.professionType);
      setValue('yearsOfExperience', userDetail.profile.yearsOfExperience);
    }
  }, [userDetail]);
  const openImagePicker = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!image.didCancel) {
      console.log(image);
      setProfileImage(image.assets[0]);
    } else {
      // user cancel image selection
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    setSubmittingProfile(true);
    for (let key in data) {
      formData.append(key, data[key]);
    }
    formData.append('file', {
      uri: profileImage?.uri,
      name: profileImage?.fileName || 'profile.jpg',
      type: profileImage?.type || 'image/jpeg',
    });
    // console.log(formData.getAll('file'));
    //     for (let pair of formData.getAll()) {
    //   console.log(pair[0] + ':', pair[1]);
    // }
    const response = await updateUserDetail(userDetail?.id, formData);
    if (response) {
      dispatch(authActions.saveUserDetail(response));
      await AsyncStorage.setItem('user', JSON.stringify({user: response}));
    }
    setSubmittingProfile(false);
  };

  return (
    <View style={styles.container}>
      <Header goBack title="My Account" icons={false} />
      <View style={styles.pageContainer}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.main}>
            <View style={styles.profileContainer}>
              <ProfileUserCard image={profileImage?.uri} />
              <Button
                label="Upload Image"
                labelStyle={styles.uploadButtonText}
                style={styles.uploadButton}
                onPress={openImagePicker}
              />
            </View>
            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, onBlur, value}}) => (
                  <BgInput
                    labelText="Name"
                    placeholder="name"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({field: {onChange, onBlur, value}}) => (
                  <BgInput
                    labelText="Email"
                    placeholder="Email"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({field: {onChange, onBlur, value}}) => (
                  <BgInput
                    labelText="Address"
                    placeholder="Address"
                    value={value}
                    onChange={onChange}
                    numberOfLines={5}
                    multiline
                  />
                )}
              />
              {userDetail?.accountType === 'Farmer' && (
                <>
                  <Text style={styles.labelStyle}>Years of Experience</Text>
                  <Controller
                    control={control}
                    name="yearsOfExperience"
                    render={({field: {onChange, onBlur, value}}) => (
                      <NumberSlider
                        numbers={[...new Array(59)].map(
                          (_, index) => index + 1,
                        )}
                        onChange={onChange}
                        value={+value - 1}
                      />
                    )}
                  />
                </>
              )}

              {userDetail?.accountType === 'Farmer' && (
                <Controller
                  control={control}
                  name="farmSize"
                  render={({field: {onChange, onBlur, value}}) => (
                    <BgInput
                      labelText="Farm Size"
                      placeholder="Farm Size"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              )}
              {userDetail?.accountType === 'Farmer' && (
                <Controller
                  control={control}
                  name="professionType"
                  render={({field: {onChange, onBlur, value}}) => (
                    <BgInput
                      labelText="Type of Farming"
                      placeholder="Type of Farming"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.submitBtnContainer}>
          <Button
            label={submittingProfile ? 'Saving...' : 'Submit'}
            disabled={submittingProfile}
            style={styles.submitBtn}
            labelStyle={styles.submitBtnLabel}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  pageContainer: {
    justifyContent: 'space-between',

    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    flexGrow: 1,
    // height: 300,
    // flex: 0.5,
    // backgroundColor: 'blue',
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(0),
  },
  profileContainer: {
    // width: '50%',
    alignSelf: 'center',
  },
  uploadButtonText: {
    color: COLORS.accent,
    fontSize: 14,
  },
  uploadButton: {
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: COLORS.accent,
    borderRadius: 50,
  },
  formContainer: {
    // backgroundColor: COLORS.accent,
    flex: 1,
  },
  labelStyle: {marginBottom: 5},
  submitBtnContainer: {
    paddingHorizontal: normalize(16),
    paddingVertical: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
  },
  submitBtnLabel: {
    color: COLORS.white,
  },
});

export default MyAccount;
