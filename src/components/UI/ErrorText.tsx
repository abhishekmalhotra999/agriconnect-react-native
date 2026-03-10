import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../themes/styles';

export default function ErrorText({text}: {text: string}) {
  return (
    <View style={style.container}>
      <Text style={style.errorText}>{text}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
  },
});
