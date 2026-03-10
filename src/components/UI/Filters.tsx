import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StyleProp, ViewStyle, Platform } from 'react-native';
import { normalize } from '../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';

interface FiltersProps {
  title?: string;
  activeFilter: string;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  options: string[],
  scrollEnabled?: boolean,
  onFilterChange: (filter: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  title, 
  activeFilter, 
  options,
  style,
  itemStyle, 
  onFilterChange,
  scrollEnabled=true
}) => {
  return (
    <View style={styles.mainContainer}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={[styles.container, style]} 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
      >
        {options.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilter,
              itemStyle
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: normalize(16),
    paddingBottom: normalize(5),
    paddingRight: normalize(180),
    paddingLeft: normalize(16),
  },
  title: {
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.LARGE,
    paddingLeft: normalize(16),
  },
  filterButton: {
    paddingVertical: normalize(5),
    marginRight: 15,
    width: '26%',
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  filterText: {
    textAlign: 'center',
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    marginTop: Platform.select({
      android: normalize(3),
    }),
  },
  activeText: {
    color: COLORS.white,
  },
});

export default Filters;