// ChatScreen.js

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';

export default function ChatScreen({ route, db, isConnected }) {
  const { userID, name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  // Save messages to AsyncStorage
  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  };

  // Load messages from AsyncStorage
  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('chatMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  useEffect(() => {
    let unsubscribe;

    if (isConnected) {
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user
          };
        });

        setMessages(newMessages);
        saveMessages(newMessages); // Save to AsyncStorage
      });
    } else {
      loadMessages(); // Load from AsyncStorage
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isConnected]);

  const onSend = (newMessages = []) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    saveMessages([newMessages[0], ...messages]); // Save sent message offline
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { marginLeft: 4 },
        right: { marginRight: 4 },
      }}
    />
  );

  const renderInputToolbar = (props) => {
  if (isConnected) {
    return <InputToolbar {...props} />;
  } else {
    return null;
  }
};

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 63 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: userID, name }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});