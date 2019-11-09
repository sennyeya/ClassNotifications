const express = require('express');
const Subscription = require('../services/subscriptions')

var router = express.Router();

router.post('/currentSubscriptions', async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    var arr = await sub.currentSubscriptions(req.body.user, data);
    res.send({data:arr});
})

router.post('/newSubscriptions', async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    var arr = await sub.newSubscriptions(req.body.user, data);
    res.send({data:arr});
})

router.post("/updateChannels", async (req,res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    await sub.updateSubscriptions(req.body.user, req.body.channels, data);
    var currentArr = await sub.currentSubscriptions(req.body.user,data);
    var newArr = await sub.newSubscriptions(req.body.user, data);
    res.send({currentSubscriptions:currentArr, newSubscriptions:newArr});
})

module.exports = router;