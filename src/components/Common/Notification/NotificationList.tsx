import React from 'react';
import { StyleSheet } from 'react-native';
import NotificationItem from './NotificationItem';
import List from '../../UI/List';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { ImageSourcePropType } from 'react-native';

interface Notification {
  id: string;
  avatar: ImageSourcePropType;
  name: string;
  message: string;
  time: string;
  isNew?: boolean;
  actions?: { text: string; onPress: () => void }[];
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => {
  return (
    <List
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={notifications}
      renderItem={({ item }) => (
        <NotificationItem
          avatar={item.avatar}
          name={item.name}
          message={item.message}
          time={item.time}
          isNew={item.isNew}
          actions={item.actions}
        />
      )}
      separatorStyle={styles.separator}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: normalize(120),
  },
  separator: {
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.mediumGrey
  }
});

export default NotificationList;