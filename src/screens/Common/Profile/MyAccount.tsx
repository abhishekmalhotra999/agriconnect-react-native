import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import Header from '../../../containers/header';
import {normalize} from '../../../utils/util';
import ProfileUserCard from '../../../components/Common/Profile/ProfileUserCard';
import Button from '../../../components/UI/Button';
import {COLORS} from '../../../themes/styles';
import BgInput from '../../../components/UI/BgInput';
import NumberSlider from '../../../components/UI/NumberSlider';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {useForm, Controller} from 'react-hook-form';
import {useAppDispatch, useAppSelector} from '../../../store/storage';
import {getCurrentUserDetail, updateUserDetail} from '../../../api/user';
import {authActions} from '../../../store/slices/auth.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getPlacedMarketplaceOrders, PlacedMarketplaceOrder} from '../../../store/cart.storage';
import Loading from '../../../components/UI/Loading';
import ErrorText from '../../../components/UI/ErrorText';
import axios from 'axios';
import {logoImg, orangelogo} from '../../../constants/images';
import {MyAccountScreenNavigationProp} from '../../../navigation/types';

type ProfileFormValues = {
  name: string;
  email: string;
  address: string;
  yearsOfExperience: number;
  farmSize: string;
  professionType: string;
};

const MyAccount: React.FC<{}> = () => {
  const navigation = useNavigation<MyAccountScreenNavigationProp>();
  const [profileImage, setProfileImage] = useState<Asset | null>(null);
  const [submittingProfile, setSubmittingProfile] = useState<boolean>(false);
  const [placedOrders, setPlacedOrders] = useState<PlacedMarketplaceOrder[]>([]);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {userDetail} = useAppSelector(state => state.auth);
  const {
    handleSubmit,
    control,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: '',
      email: '',
      address: '',
      yearsOfExperience: 1,
      farmSize: '',
      professionType: '',
    },
  });
  const dispatch = useAppDispatch();
  console.log('user deta', userDetail);

  useEffect(() => {
    if (userDetail) {
      if (userDetail.profile?.userImage) {
        setProfileImage({uri: userDetail.profile.userImage});
      } else {
        setProfileImage(null);
      }
      setImageChanged(false);
      setValue('name', userDetail.name || '');
      setValue('email', userDetail.email || '');
      setValue('address', userDetail.profile?.address || '');
      setValue('farmSize', userDetail.profile?.farmSize || '');
      setValue('professionType', userDetail.profile?.professionType || '');
      setValue('yearsOfExperience', Number(userDetail.profile?.yearsOfExperience || 1));
    }
  }, [userDetail]);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowSuccessModal(false);
      navigation.goBack();
    }, 1400);

    return () => clearTimeout(timeout);
  }, [navigation, showSuccessModal]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;
      getPlacedMarketplaceOrders()
        .then(result => {
          if (mounted) {
            setPlacedOrders(result);
          }
        })
        .catch(() => {
          if (mounted) {
            setPlacedOrders([]);
          }
        });

      return () => {
        mounted = false;
      };
    }, []),
  );
  const openImagePicker = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!image.didCancel) {
      console.log(image);
      setProfileImage(image.assets?.[0] || null);
      setImageChanged(true);
      setProfileError('');
    } else {
      // user cancel image selection
    }
  };

  const onSubmit = async (data: any) => {
    if (!userDetail?.id) {
      setProfileError('Unable to identify your account. Please log in again.');
      return;
    }

    const formData = new FormData();
    setProfileError('');
    setProfileSuccess('');
    setSubmittingProfile(true);
    for (const key in data) {
      const value = data[key];
      if (value === undefined || value === null) {
        continue;
      }
      formData.append(key, String(value));
    }

    if (imageChanged && profileImage?.uri) {
      formData.append('file', {
        uri: profileImage.uri,
        name: profileImage.fileName || 'profile.jpg',
        type: profileImage.type || 'image/jpeg',
      } as any);
    }

    try {
      const updatedUser = await updateUserDetail(userDetail.id, formData);
      let syncedUser = updatedUser;

      try {
        const freshUser = await getCurrentUserDetail();
        if (freshUser) {
          syncedUser = freshUser;
        }
      } catch (refreshError) {
        const status = axios.isAxiosError(refreshError)
          ? refreshError.response?.status
          : undefined;
        if (status && status !== 404) {
          throw refreshError;
        }
      }

      if (syncedUser) {
        dispatch(authActions.saveUserDetail(syncedUser));
        await AsyncStorage.setItem('user', JSON.stringify({user: syncedUser}));
        setProfileSuccess('Profile updated successfully.');
        setImageChanged(false);
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      const apiError =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        error?.message;
      setProfileError(String(apiError || 'Failed to update profile. Please try again.'));
    } finally {
      setSubmittingProfile(false);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent
        animationType="fade"
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.successModalBackdrop}>
          <View style={styles.successModalCard}>
            <View style={styles.successModalLogoRow}>
              <Image source={logoImg} style={styles.successModalLogoMain} />
              <Image source={orangelogo} style={styles.successModalLogoAccent} />
            </View>
            <Text style={styles.successModalTag}>AgriConnect</Text>
            <Text style={styles.successModalTitle}>Profile Updated</Text>
            <Text style={styles.successModalText}>
              Your account details were saved successfully.
            </Text>
            <Pressable
              style={styles.successModalButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}>
              <Text style={styles.successModalButtonText}>Back to Profile</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Header goBack title="My Account" icons={false} />
      <Loading visible={submittingProfile} inline message="Saving profile" />
      <View style={styles.pageContainer}>
        <ScrollView style={styles.contentContainer}>
          <View style={styles.main}>
            <View style={styles.profileContainer}>
              <ProfileUserCard image={profileImage?.uri} />
              <Button
                label="Upload Image"
                disabled={submittingProfile}
                labelStyle={styles.uploadButtonText}
                style={styles.uploadButton}
                onPress={openImagePicker}
              />
            </View>
            <View style={styles.ordersSection}>
              <Text style={styles.ordersHeading}>My Marketplace Orders</Text>
              {placedOrders.length === 0 ? (
                <Text style={styles.ordersEmptyText}>
                  No marketplace orders yet. Your checkout history will appear here.
                </Text>
              ) : (
                placedOrders.slice(0, 10).map(order => (
                  <View style={styles.orderCard} key={order.id}>
                    <View style={styles.orderRow}>
                      <Text style={styles.orderTitle}>{order.status}</Text>
                      <Text style={styles.orderAmount}>{order.totalAmountLabel}</Text>
                    </View>
                    <Text style={styles.orderMeta}>
                      {new Date(order.createdAt).toISOString().slice(0, 10)} - {order.items.length} item(s)
                    </Text>
                  </View>
                ))
              )}
            </View>
            {!!profileError && <ErrorText text={profileError} />}
            {!!profileSuccess && <Text style={styles.successText}>{profileSuccess}</Text>}
            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="name"
                render={({field: {onChange, value}}) => (
                  <BgInput
                    labelText="Name"
                    placeholder="name"
                    value={value || ''}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({field: {onChange, value}}) => (
                  <BgInput
                    labelText="Email"
                    placeholder="Email"
                    value={value || ''}
                    onChange={onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({field: {onChange, value}}) => (
                  <BgInput
                    labelText="Address"
                    placeholder="Address"
                    value={value || ''}
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
                    render={({field: {onChange, value}}) => (
                      <NumberSlider
                        numbers={[...new Array(59)].map(
                          (_, index) => index + 1,
                        )}
                        onChange={onChange}
                        value={Math.max(0, Number(value || 1) - 1)}
                      />
                    )}
                  />
                </>
              )}

              {userDetail?.accountType === 'Farmer' && (
                <Controller
                  control={control}
                  name="farmSize"
                  render={({field: {onChange, value}}) => (
                    <BgInput
                      labelText="Farm Size"
                      placeholder="Farm Size"
                      value={value || ''}
                      onChange={onChange}
                    />
                  )}
                />
              )}
              {userDetail?.accountType === 'Farmer' && (
                <Controller
                  control={control}
                  name="professionType"
                  render={({field: {onChange, value}}) => (
                    <BgInput
                      labelText="Type of Farming"
                      placeholder="Type of Farming"
                      value={value || ''}
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
  main: {
    flex: 1,
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
  ordersSection: {
    marginTop: normalize(16),
    marginBottom: normalize(10),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    padding: normalize(12),
    backgroundColor: '#FBFCFE',
  },
  ordersHeading: {
    color: COLORS.darkText,
    fontSize: normalize(13),
    fontWeight: '700',
    marginBottom: normalize(8),
  },
  ordersEmptyText: {
    color: COLORS.grey,
    fontSize: normalize(11),
  },
  orderCard: {
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#E7ECF4',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    marginTop: normalize(8),
    backgroundColor: COLORS.white,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTitle: {
    color: COLORS.darkText,
    fontSize: normalize(11),
    fontWeight: '600',
  },
  orderAmount: {
    color: COLORS.primary,
    fontSize: normalize(11),
    fontWeight: '700',
  },
  orderMeta: {
    marginTop: normalize(4),
    color: COLORS.grey,
    fontSize: normalize(10),
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
  successText: {
    marginTop: normalize(8),
    color: COLORS.darkGreen,
    fontSize: normalize(11),
  },
  successModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(9, 16, 24, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(22),
  },
  successModalCard: {
    width: '100%',
    borderRadius: normalize(18),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    paddingHorizontal: normalize(18),
    paddingTop: normalize(18),
    paddingBottom: normalize(16),
    shadowColor: '#0D1A2B',
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 12},
    elevation: 16,
  },
  successModalLogoRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  successModalLogoMain: {
    width: normalize(42),
    height: normalize(42),
    resizeMode: 'contain',
  },
  successModalLogoAccent: {
    width: normalize(58),
    height: normalize(16),
    resizeMode: 'contain',
    marginLeft: normalize(6),
  },
  successModalTag: {
    alignSelf: 'center',
    color: '#68798B',
    fontSize: normalize(10),
    letterSpacing: 0.8,
    marginBottom: normalize(6),
  },
  successModalTitle: {
    color: '#152A3B',
    fontSize: normalize(19),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: normalize(6),
  },
  successModalText: {
    color: '#4A5E72',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    textAlign: 'center',
    marginBottom: normalize(14),
  },
  successModalButton: {
    borderRadius: normalize(12),
    backgroundColor: COLORS.accent,
    paddingVertical: normalize(10),
    alignItems: 'center',
  },
  successModalButtonText: {
    color: COLORS.white,
    fontSize: normalize(13),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default MyAccount;
