import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {bgImage, logoImg} from '../constants/images';
import {COLORS} from '../themes/styles';

export default function NoConnection() {
  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.text}>
          You're offline. Please check your internet connection.
        </Text>
        {/* <Text style={styles.secondary}>You are offline...</Text> */}
      </ImageBackground>
    </View>
  );
}

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    // backgroundColor: 'blue',
    backgroundColor: COLORS.white,
    width: screenWidth,
    height: screenHeight,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    width: 300,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.accent,
  },
});
