const express = require('express');
const {emailJob} = require('./emailJob');
const app = express();
const port = 3000;

app.get('/', function(req, res){
    res.send("test");
})

app.get('/cron', function(req, res){
    emailJob("Misurda.txt","http://www.u.arizona.edu/~jmisurda/teaching/csc335/fall2019/index.html");
    res.send();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))