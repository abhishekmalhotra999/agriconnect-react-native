import React, { forwardRef, useState } from 'react';
import { StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { SCREEN_HEIGHT } from '../../themes/spacing';

interface AnimatedHeaderScrollViewProps extends ScrollViewProps {
  headerHeight: number;
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

const AnimatedHeaderScrollView = forwardRef<ScrollView, AnimatedHeaderScrollViewProps>(
  ({headerHeight,
  headerContent,
  children,
  ...scrollViewProps
}, ref) => {
  const scrollY = useSharedValue(0);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const now = Date.now();
      
      if (now - lastScrollTime > 16) {
        scrollY.value = event.contentOffset.y;
        runOnJS(setLastScrollTime)(now);
      }
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(interpolate(scrollY.value, [0, 100], [headerHeight, 0], 'clamp')),
    };
  });

  const fadeHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(interpolate(scrollY.value, [0, 100], [1, 0], 'clamp')),
    };
  });

  return (
    <>
      <Animated.View style={[styles.headerContainer, headerStyle, fadeHeaderStyle]}>
        {headerContent}
      </Animated.View>

      
      <Animated.ScrollView
        // @ts-ignore
        ref={ref}
        {...scrollViewProps}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={
          styles.contentContainerStyle
        }
      >
        {children}
      </Animated.ScrollView>
    </>
  );
  }
);

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  contentContainerStyle: {
    minHeight: SCREEN_HEIGHT,
  },
});

export default AnimatedHeaderScrollView;