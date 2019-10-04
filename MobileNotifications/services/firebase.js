import * as firebase from 'firebase';
import { APIKEY, MEASUREMENTID,APPID,MESSAGINGSENDERID,STORAGEBUCKET,PROJECTID,DATABASEURL,AUTHDOMAIN } from 'react-native-dotenv'

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    databaseURL: DATABASEURL,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID
};
export default firebase.initializeApp(firebaseConfig);