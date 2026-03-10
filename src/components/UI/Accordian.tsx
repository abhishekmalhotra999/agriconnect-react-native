import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function AccordianItem({item}: any) {
  const [activeSection, setActiveSection] = useState<null | number>(null);
  const toggleSection = (id: number) => {
    setActiveSection(prev => (prev === id ? null : id));
  };
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        onPress={() => toggleSection(item.id)}
        style={styles.header}>
        <Text style={styles.headerText}>{item.title}</Text>
      </TouchableOpacity>
      <Collapsible collapsed={activeSection !== item.id}>
        <View style={styles.content}>
          <Text>{item.content}</Text>
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#eee',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
});
