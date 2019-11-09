import firebase from './firebase';
import settings from '../settings';

export class Subscriber{
    user;
    constructor(){
        this.user = firebase.auth();
    }

    async subscribe(channelName){
        const {userInfo} = firebase.auth();
        await firebase.firestore().collection("joinUserChannel").add({
            user: userInfo.email,
            channel: channelName
        });
    }

    async getChannels(){
        var data = {
            user:this.user.currentUser.email
        }
        var mobileUrl = await settings.get("MOBILEENDPOINT")
        return fetch(mobileUrl+"/currentSubscriptions",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(e=>{console.log(e);return e.json()})
    }

    async getNewChannels(){
        var data = {
            user:this.user.currentUser.email
        }
        var mobileUrl = await settings.get("MOBILEENDPOINT")
        return fetch(mobileUrl+"/newSubscriptions",{
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(e=>{console.log(e);return e.json()})
    }
}