import React from 'react';
import { View, Text, Image, StyleSheet, ImageProps, Pressable } from 'react-native';
import { FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

interface ImageCardProps {
  imageSource: ImageProps;
  tag: string;
  themeColor: string;
  textColor: string;
  isActive?: boolean;
  onPress?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageSource, tag, themeColor, textColor, isActive = false, onPress }) => {
  return (
    <Pressable style={[styles.card, { backgroundColor: themeColor }, isActive && styles.cardActive]} onPress={onPress}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.tagContainer}>
        <Text style={[styles.tag, { color: textColor }]}>{tag}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '49%',
    height: normalize(85),
    marginRight: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActive: {
    borderWidth: 2,
    borderColor: '#E69B00',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    position: 'relative',
    left: 0,
    bottom: -10,
  },
  tagContainer: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginTop: normalize(22),
    overflow: 'hidden',
  },
  tag: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    letterSpacing: 0.4,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
});

export default ImageCard;