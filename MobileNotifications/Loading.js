import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as firebase from 'firebase';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  componentWillMount(){
      // Initialize Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyB7a_mev50kGOX5TWbFgzGHTdP47g214U8",
            authDomain: "email-on-class-update.firebaseapp.com",
            databaseURL: "https://email-on-class-update.firebaseio.com",
            projectId: "email-on-class-update",
            storageBucket: "email-on-class-update.appspot.com",
            messagingSenderId: "219608364418",
            appId: "1:219608364418:web:effa30074abb7920954b9b",
            measurementId: "G-D9ZN1NM92X"
        };
        firebase.initializeApp(firebaseConfig);
  }

  componentDidMount(){
    firebase.auth().onIdTokenChanged(user => {
        this.props.navigation.navigate(user ? 'Main' : 'SignUp')
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