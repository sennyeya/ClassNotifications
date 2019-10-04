// Imports the Google Cloud client library
const {Firestore} = require('@google-cloud/firestore');

// Creates a client
const datastore = new Firestore({
  projectId:"email-on-class-update"
});

const db = datastore.collection("EnvVar");

module.exports = {
  get: async function(id){
    var query = await db.where("Key", "=",id).get();

    if(query.empty){
      throw new Error("No settings with that key.");
    }

    console.log(query.docs[0].data().Value)

    return query.docs[0].data().Value;
  }
}