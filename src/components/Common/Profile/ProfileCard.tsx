import React from 'react';
import {
  ReactNode,
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {chevronRightIcon} from '../../../constants/images';

interface ProfileProps {
  title: string;
  onPress: () => void;
  icon?: ImageSourcePropType;
  iconTintColor?: string;
  iconStyle?: StyleProp<ImageStyle>;
  iconElement?: ReactNode;
}

const ProfileCard: React.FC<ProfileProps> = ({
  title,
  onPress,
  icon,
  iconTintColor,
  iconStyle,
  iconElement,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.inline}>
        <View style={styles.iconCover}>
          {iconElement ||
            (icon ? (
              <Image
                source={icon}
                style={[
                  styles.icon,
                  iconStyle,
                  iconTintColor ? {tintColor: iconTintColor} : null,
                ]}
              />
            ) : null)}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image source={chevronRightIcon} style={styles.rightIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 13,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCover: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  rightIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    paddingLeft: 15,
    letterSpacing: 0.4,
  },
});

export default ProfileCard;
