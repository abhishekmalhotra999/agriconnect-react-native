import React from 'react';
import { View, StyleSheet, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { normalize } from '../../utils/util';
import { COLORS } from '../../themes/styles';

interface SeparatorProps {
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}

const Separator: React.FC<SeparatorProps> = ({
  style,
  spacing=10
}) => {
  return (
    <View 
      style={
        [styles.separator, { paddingVertical: normalize(spacing) }, style]
      } 
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    paddingHorizontal: normalize(10),
    borderBottomColor: COLORS.lightGrey,
  },
});

export default Separator;