const express = require('express');
const {addEmailToWaitingList, sendPostWaitingListEmail} = require('../utils/sendgrid');
const { IncomingWebhook } = require('@slack/webhook');

const router = express.Router();

router.post('/', async function (req, res) {
    try {
        const {email} = req.body;
        if(!email) throw(new Error('No email found'));
        const result = await addEmailToWaitingList(email);
        if(result === 202){
            await sendPostWaitingListEmail(email);
            const webhook = new IncomingWebhook(process.env.SLACK_WAITING_LIST_WEBHOOK_URL);
            await webhook.send(`\`${email}\` just subscribed!`);
            res.send('ok');
        }else{
            res.status(400).send('Something went wrong!');
        }
    }catch(e){
        console.log(e);
        res.status(400).send('Something went wrong!');
    }
});

module.exports = router;