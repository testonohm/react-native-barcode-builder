/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { useState } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';

import Barcode from 'react-native-barcode-expo';

const Example = () => {
  const [code, setCode] = useState('Hello');


  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>React Native Barcode Builder</Text>
      <Barcode value={code} text={code} />
      <Button title="Press me" onPress={() => setCode('dondon')} />
    </View>
  );
};

export default Example;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Example', () => Example);
