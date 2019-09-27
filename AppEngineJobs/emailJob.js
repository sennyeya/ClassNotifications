const http = require("http");
require('dotenv').config();
require('@google-cloud/debug-agent').start();

const {Storage} = require('@google-cloud/storage');

module.exports = {
  emailJob: function(fileName, webPath){
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(fileName);
    var url = new URL(webPath);

    var data = "";
    blob.download(function(err, contents) {
      if(!contents){
        downloadSite();
      }else{
        data = contents.toString();
        downloadSite();
      }
    });

    var isNew = function(content, data){
      if(compareBytes(content,data)){
        const blobStream = blob.createWriteStream();

        blobStream.on('error', err => {
          console.log(err)
        });

        blobStream.on('finish', () => {
          // The public URL can be used to directly access the file via HTTP.
          const publicUrl = 'https://storage.googleapis.com/'+bucket.name+'/'+blob.name;
          console.log(publicUrl)
        });

        blobStream.write(content);
        blobStream.end();

        let Pusher = require('pusher');
        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER
        });

        pusher.trigger('notifications', 'post_updated', {
          "message":"Updated website"
        });
      }
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

    function downloadSite() {
      var options = {
        host: url.host,
        port: 80,
        path: url.path
      };

      var content = "";
      var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
          content += chunk;
        });
        res.on("end", function () {
          isNew(content, data);
        });
      });
      req.end();
    }
  }
}

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


