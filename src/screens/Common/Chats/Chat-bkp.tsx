import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { ChatRoomScreenProps } from '../../../navigation/types';
import { GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { attachIcon, chatUser1, chatUser2, emojiIcon, sendBtnIcon } from '../../../constants/images';
import { bottomInsets } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';

const ChatRoom: React.FC<ChatRoomScreenProps> = ({ navigation, route }) => {
  const { chatId } = route.params;

  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: 'What an Amazing trip it was! Enjoyed every moment, pleased to have had the time to enjoy self alone.',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'User 1',
        avatar: chatUser1,
      },
    },
    {
      _id: 3,
      text: 'What an Amazing trip it was!!!! Enjoyed every moment, pleased to have had the time to enjoy self alone.',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'User 1',
        avatar: chatUser1,
      },
    },
    {
      _id: 2,
      text: 'The scenic town of Calgary, filled with majestic mountains and outdoor recreation, were wonderfully exhilarating during the relaxing and leisurely vacation',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Mike Mazowski',
        avatar: chatUser2,
      },
    },
  ]);

  const customtInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#fff",
          flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#FFF',
          // borderTopWidth: 1,
          // padding: 8,
        }}
      />
    );
  };

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    setInputText('');
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 2 }, (response) => {
      if (response && response.assets) {
        const imageUri = response.assets[0].uri;
        onSend([
          {
            _id: Math.random().toString(),
            text: '',
            image: imageUri,
            createdAt: new Date(),
            user: { _id: 1 },
          },
        ]);
      }
    });
  };

  const handleEmojiSelected = (emoji: string) => {
    setInputText((prevText) => prevText + emoji);
    setEmojiPickerVisible(false);
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: styles.tabBarStyle
    });
  }, [navigation]);

  console.log("ChatRoom Id:", chatId)
  
  return (
    <View style={styles.container}>
    <KeyboardAvoidingView style={{ flex: 1, paddingBottom: bottomInsets() }} behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        renderInputToolbar={props => customtInputToolbar(props)}
        user={{
          _id: 1,
        }}
        renderActions={() => (
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image source={attachIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
        alwaysShowSend
        renderSend={(props) => (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (props.text && props.onSend) {
                props.onSend({ text: props.text.trim() }, true);
              }
            }}
          >
            <Image source={sendBtnIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
        textInputProps={{
          placeholder: 'Write a message...',
          value: inputText,
          // style: { flex: 1, height: 30 },
          onChangeText: setInputText,
          onSubmitEditing: Keyboard.dismiss,
        }}
      />
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF9800',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: Platform.select({
      ios: 14,
      android: 10,
    }),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
  },
});

export default ChatRoom;