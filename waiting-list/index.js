const express = require('express');
const {addEmailToWaitingList} = require('../utils/sendgrid');

const router = express.Router();

router.post('/', async function (req, res) {
    try {
        const {email} = req.body;
        if(!email) throw(new Error('No email found'));
        const result = await addEmailToWaitingList(email);
        if(result === 202){
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