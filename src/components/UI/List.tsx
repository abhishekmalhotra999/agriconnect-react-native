import React from 'react';
import { FlatList, View, StyleSheet, ListRenderItem, FlatListProps } from 'react-native';
import { normalize } from '../../utils/util';

interface ListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  separatorStyle?: object;
}

function List<T>({
  data,
  renderItem,
  separatorStyle,
  keyExtractor,
  contentContainerStyle,
  ...flatListProps
}: ListProps<T>) {
  return (
    <FlatList
      {...flatListProps}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={[styles.separator, separatorStyle]} />}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}
      keyExtractor={keyExtractor}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: normalize(16),
  },
  separator: {
    marginBottom: 8
  },
});

export default List;