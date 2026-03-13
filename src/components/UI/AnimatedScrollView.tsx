import React, {forwardRef, useCallback, useState} from 'react';
import {RefreshControl, StyleSheet, ScrollView, ScrollViewProps} from 'react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { SCREEN_HEIGHT } from '../../themes/spacing';
import Loading from './Loading';

interface AnimatedHeaderScrollViewProps extends ScrollViewProps {
  headerHeight: number;
  headerContent: React.ReactNode;
  children: React.ReactNode;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void> | void;
  refreshMessage?: string;
}

const AnimatedHeaderScrollView = forwardRef<ScrollView, AnimatedHeaderScrollViewProps>(
  ({headerHeight,
  headerContent,
  children,
  enablePullToRefresh = true,
  onRefresh,
  refreshMessage,
  contentContainerStyle,
  refreshControl,
  ...scrollViewProps
}, ref) => {
  const scrollY = useSharedValue(0);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Keep a short animation for screens with static/demo content.
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

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
        refreshControl={
          refreshControl ||
          (enablePullToRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          ) : undefined)
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={
          [styles.contentContainerStyle, contentContainerStyle]
        }
      >
        <Loading
          visible={refreshing}
          inline
          message={refreshMessage || 'Refreshing content'}
        />
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