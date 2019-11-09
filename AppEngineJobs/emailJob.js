const http = require("http");
const settings = require('./settings');

const {Storage} = require('@google-cloud/storage');
const {Firestore} = require('@google-cloud/firestore');
const {PubSub} = require("@google-cloud/pubsub");

module.exports =  {
  EmailJob:{
    init: async function(){
      // Instantiate a storage client
      const storage = new Storage({
        projectId: await settings.get("PROJECTID")
      });

      const datastore = new Firestore({
        projectId: await settings.get("PROJECTID")
      });

      // A bucket is a container for objects (files).
      bucket = storage.bucket(await settings.get("GCLOUDSTORAGEBUCKET"));

      
      const pubsub = new PubSub({
        projectId: await settings.get("PROJECTID")
      });

      return {bucket:bucket, pubsub:pubsub, datastore:datastore}
    },

    addJob: async (data, objData)=>{
      const {hostName,pathName,fileName, topicName} = data;
      const {datastore} = objData
      if(!data){
        return;
      }
      var exists = await datastore.collection("jobs").where("fileName","==",fileName).get()
      if(!exists||exists.empty){
        await datastore.collection("jobs").add({
          hostName: hostName,
          pathName: pathName,
          fileName: fileName,
          topicName:topicName
        });
        var topicExists = await datastore.collection("channels").where("channel","==",topicName).get();
        if(!topicExists||topicExists.empty){
          await datastore.collection("channels").add({
            channel:topicName,
            active:true
          });
        }
      }else{
        throw new Error("Please change the filename, one already exists with that name.")
      }
    },

    retrieveJobs: async (data)=>{
      const {datastore} = data;
      
      var vals = await datastore.collection("jobs").get();
      var jobs = [];
      vals.forEach(e=>jobs.push(e.data()));
      return jobs;
    },

    runJob: (options, objData)=>{
      const {fileName, hostName, pathName, topicName} = options;
      return new Promise(async(res, rej)=>{
        const {bucket, pubsub} = objData;

        if(!(await pubsub.topic(topicName).exists())[0]){
          await pubsub.createTopic(topicName);
          await pubsub.topic(topicName).createSubscription("site_update");
          await pubsub.topic(topicName).subscription("site_update").modifyPushConfig({
            pushEndpoint:await settings.get("PUSHENDPOINT")+topicName
          });
        }

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(fileName);
        var options = {
          host: hostName,
          port: 80,
          path: pathName
        }
        if((await blob.exists(fileName))[0]){
          try{
            var contents = await blob.download();
          }catch(err){
            throw new Error(err);
          }
        }
        var data = contents?contents.toString():"";
        var content = await downloadSite(options);
        var blobStream = await getBlobStream(blob, content, data, topicName, pubsub);
        if(!blobStream){
          res(); // The object we are trying to create exists.
        }else{
          blobStream.write(content);
          blobStream.end();
          res();
        }
      })
    },
  }
}

var getBlobStream = async (blob, content, data, topicName, pubsub)=>{
  return new Promise((res, rej)=>{
    if(!compareBytes(content,data)){
      res();
    }else{
      const blobStream = blob.createWriteStream();

      blobStream.on('error', err => {
        console.log(err);
        rej();
      });

      blobStream.on('finish', () => {
        const dataBuffer = Buffer.from(content);

        pubsub.topic(topicName).publish(dataBuffer).then(messageId=>{
          console.log(`Message ${messageId} published.`);
        },err=>{
          console.log('Message failed. '+err)
        });
        
      });
      res(blobStream);
    }
  })
}

var downloadSite = async (options) =>{
  return new Promise((resolve, reject)=>{
    var content = "";
    var req = http.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        content += chunk;
      });
      res.on("end", function () {
        resolve(content);
      });
    });
    req.end();
  })
}

var compareBytes = (val1, val2)=>{
  var b1 = Buffer.from(val1);
  var b2 = Buffer.from(val2);
  for(let val =0; val< b1.length;val++){
    if(b1[val]!==b2[val]){
      return true;
    }
  }
  return false;
}