import React from 'react';
import { View, Pressable, StyleSheet, Image, Text, Platform } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../themes/styles';

type TabIconsType = {
  [key: string]: {
    default: any;
    highlighted: any;
  };
};

const tabIcons: TabIconsType = {
  'Home': {
    default: require('../../assets/icons/home.png'),
    highlighted: require('../../assets/icons/home_highlighted.png')
  },
  'Learn': {
    default: require('../../assets/icons/learn.png'),
    highlighted: require('../../assets/icons/learn_highlighted.png')
  },
  'Blogs': {
    default: require('../../assets/icons/blogs.png'),
    highlighted: require('../../assets/icons/blogs_highlighted.png')
  },
  'Chats': {
    default: require('../../assets/icons/chats.png'),
    highlighted: require('../../assets/icons/chats_highlighted.png')
  },
};

const TabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={[styles.mainContainer]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconSource = tabIcons[route.name] || require('../../assets/icons/home.png');

        return (
          <View key={index} style={[
            styles.mainItemContainer,
            ]}>
            <Pressable
              onPress={onPress}
              style={[
                styles.pressable,
                { backgroundColor: isFocused ? '#fff' : 'transparent' }
              ]}
            >
              <View style={styles.iconContainer}>
                <Image source={isFocused ? iconSource.highlighted : iconSource.default} style={styles.icon}/>
                <Text style={[styles.label, { color: isFocused ? COLORS.primary : COLORS.grey }]}>
                  {label === 'Blogs' ? `What's New` : label}
                </Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: Platform.select({
      ios: 14,
      android: 10,
    }),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 5
  },
  pressable: {
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.heading,
    textAlign: 'center',
    paddingTop: 5,
  },
  icon: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
});

export default TabBar;