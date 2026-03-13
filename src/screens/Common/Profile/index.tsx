import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {ProfileScreenProps} from '../../../navigation/types';
import Header from '../../../containers/header';
import {
  userLiteIcon,
  privacyIcon,
  helpCenterIcon,
  rateUsIcon,
  logoutIcon,
} from '../../../constants/images';
import {normalize} from '../../../utils/util';
import ProfileCard from '../../../components/Common/Profile/ProfileCard';
import ProfileUserCard from '../../../components/Common/Profile/ProfileUserCard';
import {userContext} from '../../../contexts/UserContext';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import {useAppSelector} from '../../../store/storage';
import Loading from '../../../components/UI/Loading';
import {COLORS} from '../../../themes/styles';

const PROFILE_ICON_COLOR = '#F2A42B';

const OrdersBoxIcon = ({color = PROFILE_ICON_COLOR}: {color?: string}) => {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 8.5L12 4L21 8.5L12 13L3 8.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 8.5V16L12 20.5V13"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 8.5V16L12 20.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const WishlistHeartIcon = ({color = PROFILE_ICON_COLOR}: {color?: string}) => {
  return (
    <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 5.61C20.33 5.09 19.72 4.67 19.04 4.38C18.35 4.09 17.61 3.95 16.86 3.95C16.1 3.95 15.36 4.09 14.67 4.38C13.99 4.67 13.38 5.09 12.87 5.61L12 6.49L11.13 5.61C10.1 4.56 8.7 3.97 7.24 3.97C5.78 3.97 4.38 4.56 3.35 5.61C2.32 6.66 1.75 8.09 1.75 9.57C1.75 11.05 2.32 12.48 3.35 13.53L4.22 14.41L12 22.34L19.78 14.41L20.65 13.53C21.16 13.01 21.56 12.39 21.84 11.7C22.12 11.02 22.27 10.28 22.27 9.53C22.27 8.79 22.12 8.05 21.84 7.36C21.56 6.68 21.16 6.06 20.65 5.53L20.84 5.61Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const Profile: React.FC<ProfileScreenProps> = ({navigation}) => {
  useStatusBarStyle('light-content', 'dark-content');
  const {userDetail} = useAppSelector(state => state.auth);
  const {logout} = userContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
    } finally {
      setRefreshing(false);
    }
  }, []);

  function handleLogout() {
    logout();
  }

  function onPress(toScreen: string) {
    console.log('Pressed', toScreen);
    navigation.navigate(toScreen || 'MyAccount');
  }

  return (
    <View style={styles.container}>
      <Header goBack={true} title="My Profile" />
      <ProfileUserCard image={userDetail?.profile.userImage} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Loading visible={refreshing} inline message="Refreshing profile" />
        <ProfileCard
          title="My Account"
          onPress={onPress.bind(this, 'MyAccount')}
          icon={userLiteIcon}
        />
        <ProfileCard
          title="My Orders"
          onPress={onPress.bind(this, 'MyOrders')}
          iconElement={<OrdersBoxIcon />}
        />
        <ProfileCard
          title="My Wishlist"
          onPress={onPress.bind(this, 'MyWishlist')}
          iconElement={<WishlistHeartIcon />}
        />
        <ProfileCard
          title="Privacy Policy"
          onPress={onPress.bind(this, 'PrivacyPolicy')}
          icon={privacyIcon}
        />
        {/* <ProfileCard title="My Fields" onPress={onPress} icon={myFieldsIcon} /> */}
        <ProfileCard
          title="Help Center"
          onPress={onPress.bind(this, 'HelpCenter')}
          icon={helpCenterIcon}
        />
        <ProfileCard
          title="Rate Us"
          onPress={onPress.bind(this, 'MyAccount')}
          icon={rateUsIcon}
        />
        <ProfileCard title="Log Out" onPress={handleLogout} icon={logoutIcon} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(120),
  },
});

export default Profile;
