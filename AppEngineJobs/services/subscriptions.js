const settings = require('../settings');

const {Storage} = require('@google-cloud/storage');
const {Firestore} = require('@google-cloud/firestore');
const {PubSub} = require("@google-cloud/pubsub");

var init= async ()=>{
    // Creates a client
    const datastore = new Firestore({
        projectId: await settings.get("PROJECTID")
    });
    
    return {datastore};
}

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

var newSubscriptions = async (user, data)=>{
    const {datastore} = data;
    var retVal = [];
    var current = await currentSubscriptions(user, data);
    var res = await datastore.collection("channels").get();
    console.log(res);
    var id = 1;
    res.forEach(e=>{
        if(!current.some(el=>e.data().channel==el.channel)){ 
            retVal.push({...e.data(),id:id});
            id+=1;
        }
    })
    return retVal;
}

module.exports = {
    init:init,
    currentSubscriptions: currentSubscriptions,
    newSubscriptions: newSubscriptions,
}