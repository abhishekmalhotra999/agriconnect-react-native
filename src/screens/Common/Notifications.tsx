import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {InAppNotificationsScreenProps} from '../../navigation/types';
import NotificationList from '../../components/Common/Notification/NotificationList';
import {
  chatUser1,
  chatUser2,
  chatUser3,
  chatUser4,
  chatUser5,
} from '../../constants/images';
import Header from '../../containers/header';
import {COLORS} from '../../themes/styles';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';
import ComingSoon from '../ComingSoon';

const notifications = [
  {
    id: '1',
    avatar: chatUser1,
    name: 'Emily',
    message: 'needs to discuss a project with you to enter the meeting room',
    time: 'Last Wednesday at 9:42 AM',
    isNew: true,
    actions: [
      {text: 'Approve', onPress: () => Alert.alert('Approved')},
      {text: 'Decline', onPress: () => Alert.alert('Declined')},
    ],
  },
  {
    id: '2',
    avatar: chatUser2,
    name: 'Malik',
    message:
      'posted something, hoping to get more engagement and extend the conversation',
    time: 'Last Wednesday at 9:42 AM',
    isNew: false,
  },
  {
    id: '3',
    avatar: chatUser3,
    name: 'Susan',
    message: 'replied to your post',
    time: 'Last Wednesday at 9:42 AM',
    isNew: true,
    // message: 'Great effort, needs more details, main points summary would be helpful',
  },
  {
    id: '4',
    avatar: chatUser4,
    name: 'Billy',
    message: 'replied to your post',
    time: 'Last Wednesday at 9:42 AM',
    // message: 'Looks absolutely exquisite and stunningly beautiful.',
  },
  {
    id: '5',
    avatar: chatUser5,
    name: 'Erin',
    message: 'replied to your post',
    time: 'Last Wednesday at 9:42 AM',
    // message: 'Research innovate explore continuously improve sustainable development',
    actions: [
      {
        text: 'Add to favorites',
        onPress: () => Alert.alert('Added to favorites'),
      },
    ],
  },
];

const Notifications: React.FC<InAppNotificationsScreenProps> = () => {
  useStatusBarStyle('light-content', 'dark-content');
  return <ComingSoon back />;
  // return (
  //   <View style={styles.container}>
  //     <Header goBack={true} title='Notifications' />
  //     <NotificationList notifications={notifications} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default Notifications;
