const express = require('express');
const {EmailJob} = require('./emailJob');
const {Notify, NotifyInit} = require('./services')
const app = express();
var settings = require('./settings');

const port = process.env.PORT||3000;

app.get('/', function(req, res){
    res.send("test");
})

app.get('/cron', async function(req, res){
    var job = EmailJob;
    var data = await job.init();
    var jobs = await job.retrieveJobs(data);
    for(let val of jobs){
        var options = {
            fileName:val.fileName,
            hostName: val.hostName,
            pathName: val.pathName,
            topicName: val.topicName
        }
        await job.runJob(options, data);
    }
    res.send();
});

app.post('/notification', async function(req, res){
    try{
        const db = await NotifyInit();
        await Notify("site_updated", db);
    }catch(err){
        console.log(err);
    }
    res.sendStatus(200)
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))