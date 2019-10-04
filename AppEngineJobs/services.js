const {Expo} = require('expo-server-sdk');
// Imports the Google Cloud client library
const {Firestore} = require('@google-cloud/firestore');
var settings = require("./settings");



// Create a new Expo SDK client
let expo = new Expo();

module.exports = {
    NotifyInit:async ()=>{
        // Creates a client
        const datastore = new Firestore({
            projectId: await settings.get("PROJECTID")
        });
        
        return datastore;
    },
    Notify: function(channelName, db){
        return new Promise(async (res, rej)=>{
            var tokens = [];

            var data = await db.collection("joinUserChannel").where("channel","=",channelName).get().catch(err=>rej(err));

            if(!data||data.empty){
                console.log("No results")
                res();
            }

            var snapshots = [];

            data.forEach(async (datum)=>{
                snapshots.push(datum.data());
            });

            for(let data of snapshots){
                var dataToken = await db.collection("joinUserToken").where("user","==",data.user).get().catch(err=>rej(err));
                dataToken.forEach((val)=>{
                    console.log(val.data())
                    tokens.push(val.data().token);
                })
            }
            console.log(tokens);

            // Create the messages that you want to send to clents
            let messages = [];
            for (let pushToken of tokens) {
                // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

                // Check that all your push tokens appear to be valid Expo push tokens
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    continue;
                }

                // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    body: channelName+' was updated.',
                    data: { withSome: 'data' },
                })
            }

            // The Expo push notification service accepts batches of notifications so
            // that you don't need to send 1000 requests to send 1000 notifications. We
            // recommend you batch your notifications to reduce the number of requests
            // and to compress them (notifications with similar content will get
            // compressed).
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];
            (async () => {
                // Send the chunks to the Expo push notification service. There are
                // different strategies you could use. A simple one is to send one chunk at a
                // time, which nicely spreads the load out over time:
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                        // NOTE: If a ticket contains an error code in ticket.details.error, you
                        // must handle it appropriately. The error codes are listed in the Expo
                        // documentation:
                        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();

            // Later, after the Expo push notification service has delivered the
            // notifications to Apple or Google (usually quickly, but allow the the service
            // up to 30 minutes when under load), a "receipt" for each notification is
            // created. The receipts will be available for at least a day; stale receipts
            // are deleted.
            //
            // The ID of each receipt is sent back in the response "ticket" for each
            // notification. In summary, sending a notification produces a ticket, which
            // contains a receipt ID you later use to get the receipt.
            //
            // The receipts may contain error codes to which you must respond. In
            // particular, Apple or Google may block apps that continue to send
            // notifications to devices that have blocked notifications or have uninstalled
            // your app. Expo does not control this policy and sends back the feedback from
            // Apple and Google so you can handle it appropriately.
            let receiptIds = [];
            for (let ticket of tickets) {
                // NOTE: Not all tickets have IDs; for example, tickets for notifications
                // that could not be enqueued will have error information and no receipt ID.
                if (ticket.id) {
                    receiptIds.push(ticket.id);
                }
            }

            let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
            (async () => {
                // Like sending notifications, there are different strategies you could use
                // to retrieve batches of receipts from the Expo service.
                for (let chunk of receiptIdChunks) {
                    try {
                    let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                    console.log(receipts);

                    // The receipts specify whether Apple or Google successfully received the
                    // notification and information about an error, if one occurred.
                    for (let receipt of receipts) {
                        if (receipt.status === 'ok') {
                        continue;
                        } else if (receipt.status === 'error') {
                        console.error(`There was an error sending a notification: ${receipt.message}`);
                        if (receipt.details && receipt.details.error) {
                            // The error codes are listed in the Expo documentation:
                            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                            // You must handle the errors appropriately.
                            console.error(`The error code is ${receipt.details.error}`);
                        }
                        }
                    }
                    } catch (error) {
                    console.error(error);
                    }
                }
            })();
            res();
        })
    }
}



