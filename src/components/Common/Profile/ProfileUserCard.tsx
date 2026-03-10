import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {userContext} from '../../../contexts/UserContext';
import {profileImage} from '../../../constants/images';

const dummyUser = {
  id: Date.now().toString(),
  name: 'John Wick',
  avatar: profileImage,
  phone: '+231 578 409 170',
  accountType: '',
};

interface IProfileUserCardsProps {
  image: string;
}

const ProfileUserCard = ({image}: IProfileUserCardsProps) => {
  const {user} = userContext();
  const currentUser = user ?? dummyUser;
  console.log('image is ', image);

  return (
    <View style={styles.section}>
      <View style={styles.iconCover}>
        <Image
          source={image ? {uri: image} : profileImage}
          style={styles.avatar}
        />
      </View>
      {currentUser?.name && <Text style={styles.name}>{currentUser.name}</Text>}
      {currentUser?.phone && (
        <Text style={styles.phone}>{currentUser.phone}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.white,
    padding: 13,
    flexDirection: 'column',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: COLORS.black,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCover: {
    borderRadius: 30,
  },
  avatar: {
    width: 105,
    height: 98,
    resizeMode: 'contain',
  },
  rightIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  name: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.8,
  },
  phone: {
    paddingTop: 5,
    fontSize: FONT_SIZES.XSMALL,
    fontFamily: FONTS.regular,
    color: COLORS.grey,
    letterSpacing: 0.8,
  },
});

export default ProfileUserCard;
