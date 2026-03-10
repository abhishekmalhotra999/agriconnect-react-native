import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../themes/styles';
import { normalize } from '../../utils/util';

interface ConnectDotsProps {
  highlightDot1?: boolean;
  highlightDot2?: boolean;
  highlightLine?: boolean;
  dotSize?: number;
}

const ConnectDots: React.FC<ConnectDotsProps> = ({
  highlightDot1 = true,
  highlightDot2 = false,
  highlightLine = false,
  dotSize = 20,
}) => {

  return (
    <View style={styles.container}>
      <View style={[
        styles.dot, highlightDot1 && styles.highlighted, 
        { width: dotSize, height: dotSize }
      ]}></View>
      <View style={[styles.line, highlightLine && styles.highlighted]} />
      <View style={[
        styles.dot, highlightDot2 && styles.highlighted, 
        { width: dotSize, height: dotSize }
      ]}>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: normalize(8),
  },
  dot: {
    borderRadius: 50,
    backgroundColor: COLORS.mediumGrey,
  },
  line: {
    backgroundColor: COLORS.mediumGrey,
    width: 20,
    height: 0.8,
  },
  highlighted: {
    backgroundColor: COLORS.primary
  },
});

export default ConnectDots;