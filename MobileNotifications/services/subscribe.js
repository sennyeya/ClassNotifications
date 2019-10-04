import firebase from './firebase';

export default class Subscriber{
    constructor(){
        
    }

    async subscribe(channelName){
        const {userInfo} = firebase.auth();
        console.log(userInfo);
        await firebase.firestore().collection("joinUserChannel").add({
            user: userInfo.email,
            channel: channelName
        });
    }

    getChannels(){
        return firebase.firestore().collection("channels").where("active","==", true).get()
    }
}