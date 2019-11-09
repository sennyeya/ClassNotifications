import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import firebase from './services/firebase';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
        this.props.navigation.pop();
        this.props.navigation.navigate(user ? 'MainScreen' : 'SignupScreen');
      })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})