require('dotenv').config();
const {getListRecipients, sendEmailsToRecipients} = require('../utils/sendgrid');

async function _sendEmailToList(listId, templateId) {
    const recipients = await getListRecipients(listId);
    console.log(recipients);
    await sendEmailsToRecipients(templateId, recipients);
}

(async function main() {
    const args = process.argv.slice(2);

    switch (args[0]) {
        case 'sendEmailToContactList':
        {
            const listId = args[1];
            const templateId = args[2];
            await _sendEmailToList(listId, templateId);
           break
        }
        default:
        {

        }
    }
})();