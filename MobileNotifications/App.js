import { createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import React from 'react';
import {Notifications} from 'expo';
import firebase from './services/firebase'

import Loading from './Loading';
import SignUp from './SignUp';
import Login from './Login';
import Main from './Main';

const AppStack = createStackNavigator({
  LoadingScreen:{screen:Loading},
  SignupScreen:{screen:SignUp},
  LoginScreen:{screen:Login},
  MainScreen:{screen:Main}
},{
  initalRouteName:"LoadingScreen"
})

const AppContainer = createAppContainer(AppStack);

export default class App extends React.Component{
  state = {
      notification: {},
    };
  render(){
    return <AppContainer/>
  }

  componentDidMount(){
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };
}