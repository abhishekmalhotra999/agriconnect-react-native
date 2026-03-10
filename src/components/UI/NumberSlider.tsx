import React, {useState, useRef, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {SCREEN_WIDTH} from '../../themes/spacing';
import {COLORS, FONT_SIZES, FONTS} from '../../themes/styles';

const ITEM_WIDTH = 60;
const SPACING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

interface NumberSliderProps {
  numbers: number[];
  value: number;
  onChange: (value: number) => void;
}

const NumberSlider: React.FC<NumberSliderProps> = ({
  numbers,
  value,
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(value);
  const flatListRef = useRef<FlatList<number>>(null);

  useEffect(() => {
    if (value) {
      setActiveIndex(value);
    }
  }, [value]);

  const handleItemPress = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      viewPosition: 0.5,
      animated: true,
    });
    onChange(numbers[index]);
  };

  const renderItem = ({item, index}: {item: number; index: number}) => {
    const isActive = index === activeIndex;
    return (
      <TouchableOpacity onPress={() => handleItemPress(index)}>
        <View style={[styles.itemContainer]}>
          <Text
            style={[
              styles.itemText,
              isActive ? styles.activeItemText : styles.inactiveItemText,
            ]}>
            {item}
          </Text>
          {isActive && <View style={styles.activeCircle} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={numbers}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    // paddingHorizontal: SPACING,
  },
  itemContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: FONT_SIZES.REGULAR,
  },
  activeItemText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.primary,
  },
  inactiveItemText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  activeCircle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 30,
  },
});

export default NumberSlider;
