const http = require("http")

const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

var options = {
  host: 'www.u.arizona.edu',
  port: 80,
  path: '/~jmisurda/teaching/csc335/fall2019/index.html'
};
var content = "";
var req = http.request(options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        console.log(content);
    });
});

req.end();

// Create a new blob in the bucket and upload the file data.
const blob = bucket.file("Misurda");
const blobStream = blob.createWriteStream();

blobStream.on('error', err => {
next(err);
});

blobStream.on('finish', () => {
// The public URL can be used to directly access the file via HTTP.
const publicUrl = format(
    `https://storage.googleapis.com/${bucket.name}/${blob.name}`
);
});

blobStream.end(content);