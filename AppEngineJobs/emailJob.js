const http = require("http");
let Pusher = require('pusher');
require('dotenv').config();
require('@google-cloud/debug-agent').start();

const {Storage} = require('@google-cloud/storage');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER
});

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

module.exports = {
  EmailJob: function(fileName, hostName, pathName, resObj){
    return new Promise(async(res, rej)=>{
      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(fileName);

      var options = {
        host: hostName,
        port: 80,
        path: pathName
      }

      var contents = await blob.download();
      var data = contents?contents.toString():"";
      var content = await downloadSite(options);
      var blobStream = await getBlobStream(blob, content, data);
      if(!blobStream){
        resObj.send("Nothing to change");
        res(); // The object we are trying to create exists.
      }else{
        blobStream.write(content);
        blobStream.end();
        resObj.send("updating")
        res();
      }
    })
  }
}

async function downloadSite(options) {
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

var compareBytes = function(val1, val2){
  var b1 = Buffer.from(val1);
  var b2 = Buffer.from(val2);
  for(let val =0; val< b1.length;val++){
    if(b1[val]!==b2[val]){
      return true;
    }
  }
  return false;
}

var getBlobStream = async (blob, content, data) =>{
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
        pusher.trigger('notifications', 'site_updated', {
          "message":"Updated website"
        });
      });
      res(blobStream);
    }
  })
}