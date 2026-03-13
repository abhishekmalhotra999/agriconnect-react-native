import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {ProfileScreenProps} from '../../../navigation/types';
import Header from '../../../containers/header';
import {
  userLiteIcon,
  privacyIcon,
  myFieldsIcon,
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
          icon={myFieldsIcon}
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
