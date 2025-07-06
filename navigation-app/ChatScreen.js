// ChatScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Firestore imports to interact with your Firestore DB
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

/**
 * ChatScreen component
 * Renders the main chat interface and syncs messages with Firestore in real time.
 * Props:
 * - route: contains navigation parameters (userID, name, bgColor)
 * - db: Firestore database instance passed from App.js
 */
export default function ChatScreen({ route, db }) {
  const { userID, name, bgColor } = route.params;

  // State to hold chat messages
  const [messages, setMessages] = useState([]);

  /**
   * useEffect to set up Firestore real-time listener
   * - Listens to the "messages" collection
   * - Sorts by createdAt in descending order
   * - Converts Firestore Timestamps to JS Dates (required by GiftedChat)
   * - Cleans up listener when component unmounts
   */
  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
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
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  /**
   * onSend handler
   * - Called when user sends a message
   * - Stores the message in Firestore under "messages" collection
   */
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
  };

  /**
   * renderBubble
   * - Customizes message bubble spacing
   * - Aligns messages closer to screen edges
   */
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { marginLeft: 4 },
        right: { marginRight: 4 },
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 63 : 0} // Adjust for iOS header
      >
        <GiftedChat
          messages={messages} // Messages from Firestore
          onSend={onSend}     // Send handler
          user={{ _id: userID, name }} // Authenticated user info
          renderBubble={renderBubble}  // Custom bubble spacing
        />
      </KeyboardAvoidingView>
    </View>
  );
}

// Basic full-screen container style
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});