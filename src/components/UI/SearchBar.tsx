import React from 'react';
import { View, TextInput, StyleSheet, Image, Platform } from 'react-native';
import { searchIcon, filterIcon } from '../../constants/images';
import { normalize } from '../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';

interface SearchBarProps {
  placeholder: string;
  hasFilter?: boolean;
  value?: string;
  onChangeText?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  hasFilter = false,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Image source={searchIcon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
        />
        {hasFilter &&
          <Image source={filterIcon} style={styles.icon} />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPurple,
    borderRadius: 15,
    paddingHorizontal: normalize(16),
    paddingVertical: Platform.select({
      ios: normalize(6),
      android: normalize(2)
    }),
    marginHorizontal: normalize(16),
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontFamily: FONTS.light,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.grey,
    letterSpacing: 0.8,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    paddingLeft: 10,
  },
});

export default SearchBar;