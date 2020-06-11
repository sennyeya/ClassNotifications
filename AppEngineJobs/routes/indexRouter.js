const express = require('express');
const gitDiff = require('git-diff');
const fs = require('fs')
const {EmailJob} = require('../emailJob');
const {Notify, NotifyInit} = require('../services/notify');
var router = express.Router();

router.get('/cron', async function(req, res){
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

router.post('/add',async function(req, res){
    if(!req.body){//verifyBody({fileName, hostName, pathName, topicName}, res)){
        res.sendStatus(500);
        return;
    }
    //Check headers to make sure we know what we are getting.
    try{
        var job = EmailJob;
        var data = await job.init();
        var options = {
            fileName:req.body.fileName,
            hostName: req.body.hostName,
            pathName: req.body.pathName,
            topicName: req.body.topicName
        }
        await job.addJob(options,data);
        res.sendStatus(200);
    }catch(err){
        console.log(err)
        res.send({error:err});
    }
})

router.post('/notification', async function(req, res){
    if(!req.query){
        res.sendStatus(500);
    }
    try{
        const db = await NotifyInit();
        let buff = new Buffer(req.body.message.data, 'base64');
        await Notify(req.query.topic, db, buff.toString('ascii'));
    }catch(err){
        console.log(err);
    }
    res.sendStatus(200)
})

module.exports=router;