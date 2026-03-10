import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableHighlightProps } from 'react-native';
import { chevronLeft } from '../../constants/images';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface HeaderBackProps extends TouchableHighlightProps {
  navigation: NavigationProp<any>;
}

const HeaderBack: React.FC<HeaderBackProps> = ({ navigation }) => {
  return (
    <TouchableWithoutFeedback
      onPress={navigation.goBack}
      style={styles.button}
    >
      <Image source={chevronLeft} style={styles.icon} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 80,
    height: 40,
    paddingLeft: 20,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default HeaderBack;