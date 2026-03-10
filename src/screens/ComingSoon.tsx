import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {bgImage, comingSoon} from '../constants/images';
import {COLORS} from '../themes/styles';
import Header from '../containers/header';
import {normalize} from '../utils/util';

interface IComingSoonProp {
  back: boolean;
}

export default function ComingSoon({back = false}: IComingSoonProp) {
  return (
    <View style={styles.wrapper}>
      <Header goBack={back} icons={false} />
      <ImageBackground source={bgImage} style={styles.bgImage}>
        <Image source={comingSoon} style={styles.fgImage} />
      </ImageBackground>
    </View>
  );
}

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'blue',
    backgroundColor: COLORS.white,
    width: screenWidth,
    height: screenHeight,
  },
  fgImage: {
    marginTop: Platform.select({
      ios: normalize(0),
      android: normalize(-100),
    }),
    width: 400,
    height: 400,
    resizeMode: 'contain',
    // width: screenWidth,
    // height: screenHeight / 2,
  },
});
