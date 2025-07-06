import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const App = () => {
  const [text, setText] = useState('');

  // Function to alert the current text
  const alertMyText = () => {
    Alert.alert('You typed:', text || 'Nothing yet!');
  };

  return (
    <View style={styles.container}>
      {/* Input field */}
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Type Something Here"
      />

      {/* Display the typed text */}
      <Text style={styles.textDisplay}>You wrote: {text}</Text>

      {/* Button triggers alert */}
      <Button title="Press Me" onPress={alertMyText} />

      {/* Scrollable content example */}
      <ScrollView style={styles.scrollView}>
        <Text style={styles.largeText}>
          This text is so big! And so long! You have to scroll!
          {'\n\n'}(Scroll down to see more content...)
          {'\n\n'}Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          {'\n\n'}Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          {'\n\n'}Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          {'\n\n'}Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    width: '88%',
    borderWidth: 1,
    borderColor: '#888',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  textDisplay: {
    height: 50,
    lineHeight: 50,
    marginBottom: 15,
    fontSize: 16,
  },
  scrollView: {
    marginTop: 20,
    width: '100%',
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  largeText: {
    fontSize: 24,
    padding: 10,
  },
});

export default App;
