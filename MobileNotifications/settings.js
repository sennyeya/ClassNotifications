import firebase from './services/firebase';

// Creates a client
const datastore = firebase.firestore();

const db = datastore.collection("EnvVar");

module.exports = {
  get: async function(id){
    var query = await db.where("Key", "==",id).get();

    if(query.empty){
      throw new Error("No settings with that key.");
    }

    return query.docs[0].data().Value;
  }
}