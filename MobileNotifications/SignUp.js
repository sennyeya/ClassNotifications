import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import firebase from './services/firebase';

import registerForPushNotificationsAsync from './services/addPushToken';
export default class SignUp extends React.Component {
  state = { email: '', password: '', errorMessage: null }
handleSignUp = async () => {
  try{
    firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password).then(user=>
    registerForPushNotificationsAsync(user).then(f=>this.props.navigation.navigate('MainScreen')))
  }catch(err){
    this.setState({errorMessage:err.toString()})
  }

}
render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('LoginScreen')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  }
})