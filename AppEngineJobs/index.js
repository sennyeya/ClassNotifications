const express = require('express');
const {EmailJob} = require('./emailJob');
const {Notify} = require('./services')
const app = express();
const port = process.env.PORT||3000;

app.get('/', function(req, res){
    res.send("test");
})

app.get('/cron', async function(req, res){
    await EmailJob("Misurda.txt","www.u.arizona.edu","/~jmisurda/teaching/csc335/fall2019/index.html", res);
});

app.post('/notification', async function(req, res){
    try{
        await Notify("notifications");
    }catch(err){
        console.log(err);
    }
    res.send()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))