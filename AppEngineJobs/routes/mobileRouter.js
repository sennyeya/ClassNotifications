const express = require('express');
const Subscription = require('../services/subscriptions')

var router = express.Router();

router.post('/addChannel', async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    try{
        var data = await sub.init();
        var arr = await sub.addChannel(req.body.user, req.body.channels, data);
        res.send({success:true})
    }catch(e){
        res.send({success:false, error:e})
    }
})

// Get the current subscriptions for this user.
router.post('/currentSubscriptions', async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    var arr = await sub.currentSubscriptions(req.body.user, data);
    res.send({data:arr});
})

// Get the possible unsubscribed subscriptions for this user.
router.post('/newSubscriptions', async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    var arr = await sub.newSubscriptions(req.body.user, data);
    res.send({data:arr});
})

// Updates the channels.
router.post("/updateChannels", async (req,res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    await sub.updateSubscriptions(req.body.user, req.body.channels, data);
    var currentArr = await sub.currentSubscriptions(req.body.user,data);
    var newArr = await sub.newSubscriptions(req.body.user, data);
    res.send({currentSubscriptions:currentArr, newSubscriptions:newArr});
})

// Adds a specific channel.
router.post('/addChannel',async (req, res)=>{
    console.log(req.body);
    var sub = Subscription;
    var data = await sub.init();
    await sub.updateSubscriptions(req.body.user, data, req.body.channels);
    res.send({success:true});
})

module.exports = router;