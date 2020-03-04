const settings = require('../settings');

const {Storage} = require('@google-cloud/storage');
const {Firestore} = require('@google-cloud/firestore');
const {PubSub} = require("@google-cloud/pubsub");

// Initializes the Google API stuff.
var init= async ()=>{
    // Creates a client
    const datastore = new Firestore({
        projectId: await settings.get("PROJECTID")
    });
    
    return {datastore};
}

var addChannel = async (user, arr, data) =>{
    const {datastore} = data;
    console.log(arr)
    for(let e of arr){
        var channel = await datastore.collection("joinUserChannel").where("channel","==",e.channel).where("user","==",user).get();
        console.log(e);
        if(!channel.empty){
            return;
        }
    
        // POST the token to your backend server from where you can retrieve it to send push notifications.
        await datastore.collection("joinUserChannel").add({
            channel: e.channel,
            user: user,
        });
    }
    
}

// Returns the current subscriptions.
var currentSubscriptions = async (user, data)=>{
    const {datastore} = data;
    var retVal = [];
    var res = await datastore.collection("joinUserChannel").where("user","==",user).get();
    var id = 1;
    res.forEach(e=>{
        retVal.push({...e.data(),id:id});
        id+=1;
    })
    return retVal;
}

// Returns the new subscriptions with ids.
var newSubscriptions = async (user, data)=>{
    const {datastore} = data;
    var retVal = [];
    var current = await currentSubscriptions(user, data);
    var res = await datastore.collection("channels").get();
    var id = 1;
    res.forEach(e=>{
        if(!current.some(el=>e.data().channel==el.channel)){ 
            retVal.push({...e.data(),id:id});
            id+=1;
        }
    })
    return retVal;
}

// Updates the subscriptions to match the passed in array.
var updateSubscriptions = async (user, data, channels)=>{
    const {datastore} = data;
    var retVal = [];
    var current = await currentSubscriptions(user, data);
    var filtered = channels.filter(e=>!current.some(f=>f.data().channel==e.channel));
    var forDeletion = current.filter(e=>!channels.contains(e.data().channel));
    for(let val of filtered){
        await datastore.collection("joinUserChannel").add({
            user:user,
            channel:val.channel
        })
    }
    for(let val of forDeletion){
        await datastore.collection("joinUserChannel").delete(datastore.key([val.user, val.channel]))
    }
}

module.exports = {
    init:init,
    currentSubscriptions: currentSubscriptions,
    newSubscriptions: newSubscriptions,
    addChannel:addChannel,
    updateSubscriptions:updateSubscriptions
}