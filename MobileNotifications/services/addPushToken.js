import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import firebase from './firebase';
import 'firebase/firestore';

export default async function registerForPushNotificationsAsync(userInfo) {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  var oldToken = await firebase.firestore().collection("joinUserToken").where("token","==",token).where("user","==",userInfo.user.email).get();
  if(!oldToken.empty){
     return new Promise((res,rej)=>res()) 
  }

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return await firebase.firestore().collection("joinUserToken").add({
    token: token,
    user: userInfo.user.email,
  });
}