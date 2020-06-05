const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendTemporaryAccessCode = async function (emailAddress, code) {
    const msg = {
        to: emailAddress,
        from: 'no-reply@tlprt.io',
        subject: `You temporary access code`,
        text: `Login
               Your temporary access code is: ${code}`,
        html: `<h3>Login</h3>
               <p>Your temporary access code is: <strong>${code}</strong></p>`,
    };
    try {
        await sgMail.send(msg);
    } catch (err) {
        console.error(err.toString());
    }
};

const client = require('@sendgrid/client');
client.setApiKey(process.env.SENDGRID_API_KEY);
module.exports.addEmailToWaitingList = async function(email) {
    const request = {
        method: 'PUT',
        url: '/v3/marketing/contacts',
        body:{
            list_ids: [process.env.SENDGRID_WAITING_LIST_ID],
            contacts: [{email}]
        }
    };
    const [response] = await client.request(request);
    return response.statusMessage;
};