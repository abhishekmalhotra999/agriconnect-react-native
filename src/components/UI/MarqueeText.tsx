import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type MarqueeTextProps = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  textStyle,
  containerStyle,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const shouldAnimate = useMemo(
    () => textWidth > 0 && containerWidth > 0 && textWidth > containerWidth,
    [containerWidth, textWidth],
  );

  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);

    if (!shouldAnimate) {
      return;
    }

    const overflowDistance = textWidth - containerWidth + 24;
    const duration = Math.max(3800, overflowDistance * 22);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(translateX, {
          toValue: -overflowDistance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(400),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
      translateX.stopAnimation();
    };
  }, [containerWidth, shouldAnimate, textWidth, translateX]);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const onTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={onContainerLayout}>
      <Animated.Text
        numberOfLines={1}
        onLayout={onTextLayout}
        style={[textStyle, shouldAnimate ? {transform: [{translateX}]} : null]}>
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
});

export default MarqueeText;
