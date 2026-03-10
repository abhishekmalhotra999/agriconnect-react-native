import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { ellipsisIcon, chevronLeft, chatUser1 } from '../../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../../utils/util';
import navigationService from '../../../navigation/navigationService';

interface ChatHeaderProps {
  title?: string;
  onPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title='Local Farmers', onPress }) => {
  return (
    <SafeAreaView style={[styles.headerContainer]}>
      <View style={styles.inline}>
        <TouchableOpacity
          style={styles.leftIconContainer}
          onPress={navigationService.goBack}>
          <Image source={chevronLeft} style={styles.backIcon}/>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Image source={chatUser1} style={styles.logo} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.members}>{'7 Online, from 12 People'}</Text>
        </View>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={ellipsisIcon} style={styles.iconResize} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.select({
      ios: normalize(15),
    }),
    height: Platform.select({
      ios: normalize(110),
      android: normalize(100),
    }),
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.heading,
  },
  members: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  darkBg: {
    backgroundColor: COLORS.primaryDark,
  },
  leftIconContainer: {
    padding: 10,
  },
  content: {
    flexDirection: 'row',
  },
  logo: {
    width: 69,
    height: 50,
    resizeMode: 'contain',
  },
  icons: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  iconButton: {
    marginTop: 10,
    padding: 10,
    // backgroundColor: COLORS.lightGrey,
    borderRadius: 50
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  icon: {
    width: 24,
    height: 22,
    resizeMode: 'contain',
  },
  iconResize: {
    width: 50,
    height: 50,
  }
});

export default ChatHeader;