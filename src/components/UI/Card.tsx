import React from 'react';
import { 
  View,
  Text,
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  StyleProp 
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../themes/styles';
import { normalize } from '../../utils/util';

type CardProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  label,
  style,
  labelStyle
}) => {
  return (
    <View style={styles.wrapper}>
      {!!label && 
        <TouchableOpacity 
          onPress={onPress} 
          disabled={!onPress} 
          style={styles.cardHeader}
        >
          <Text 
            style={
              [styles.cardHeadingText, labelStyle]
            }>{label}
          </Text>
        </TouchableOpacity>
      }
      <View style={[styles.card, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 0.46,
  },
  card: {
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    backgroundColor: COLORS.white,
    padding: normalize(12),
    borderRadius: 12,
  },
  cardHeader: {
  },
  cardHeadingText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: normalize(10),
  }
});

export default Card;