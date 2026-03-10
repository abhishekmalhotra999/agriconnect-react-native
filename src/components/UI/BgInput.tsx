import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import {COLORS} from '../../themes/styles';

interface IBgInput {
  labelText: string;
  placeholder: string;
  value: string;
  numberOfLines?: number;
  multiline?: boolean;
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
}

export default function BgInput({
  labelText,
  placeholder,
  value,
  onChange,
  ...formProps
}: IBgInput) {
  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{labelText}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={COLORS.grey}
        {...formProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: COLORS.lightGrey,
    color: COLORS.black,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  labelText: {
    color: COLORS.darkText,
  },
});
