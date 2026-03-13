import React from 'react';
import {
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type AppImageProps = {
  source?: ImageSourcePropType | null;
  fallbackSource?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  placeholderStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
};

const hasUsableSource = (source?: ImageSourcePropType | null) => {
  if (!source) {
    return false;
  }

  if (typeof source === 'number') {
    return true;
  }

  const candidate = source as {uri?: string};
  if (typeof candidate?.uri === 'string' && candidate.uri.trim().length > 0) {
    return true;
  }

  return false;
};

const AppImage: React.FC<AppImageProps> = ({
  source,
  fallbackSource,
  style,
  placeholderStyle,
  resizeMode = 'cover',
}) => {
  const [sourceFailed, setSourceFailed] = React.useState(false);
  const [fallbackFailed, setFallbackFailed] = React.useState(false);

  React.useEffect(() => {
    setSourceFailed(false);
    setFallbackFailed(false);
  }, [source, fallbackSource]);

  const renderPrimary = hasUsableSource(source) && !sourceFailed;
  const renderFallback = !renderPrimary && hasUsableSource(fallbackSource) && !fallbackFailed;

  if (renderPrimary) {
    return (
      <Image
        source={source as ImageSourcePropType}
        style={style}
        resizeMode={resizeMode}
        onError={() => setSourceFailed(true)}
      />
    );
  }

  if (renderFallback) {
    return (
      <Image
        source={fallbackSource as ImageSourcePropType}
        style={style}
        resizeMode={resizeMode}
        onError={() => setFallbackFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.placeholder, style as StyleProp<ViewStyle>, placeholderStyle]}>
      <Text style={styles.cross}>×</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#DCE1E8',
    borderWidth: 1,
    borderColor: '#C6CED9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    color: '#7A8798',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },
});

export default AppImage;
