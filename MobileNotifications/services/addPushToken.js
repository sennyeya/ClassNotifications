import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default async function registerForPushNotificationsAsync() {
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

  const {userInfo} = firebase.auth();

  var oldToken = firebase.firestore().collection("joinUserToken").where("token","==",token).get();
  if(!oldToken.empty){
     return new Promise((res,rej)=>res()) 
  }

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return firebase.firestore().collection("joinUserToken").add({
    token: {
      value: token,
    },
    user: {
      username: userInfo.email,
    },
  });
}