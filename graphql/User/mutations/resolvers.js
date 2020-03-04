const User = require('../../../model/User');
const nameFromEmail = require('../../../utils/nameFromEmail');
const randomAccessCode = require('../../../utils/randomAccessCode');
const { redisHmsetAsync } = require('../../../utils/redis');
const { sendTemporaryAccessCode } = require('../../../utils/sendgrid');

module.exports.signInWithEmailResolver = async function (_, {emailAddress}) {
    try{
        //Check if email exists
        let user = await User.findOne({emailAddress});
        if(!user) {
            const fullName = nameFromEmail(emailAddress);
            user = User({emailAddress, firstName: fullName.firstName, lastName: fullName.lastName});
            user = await user.save();
        }
        if(user.password) {
            //Auth with password
            return "Enter password";
        }else {
            //Password less auth. Send a temporary code
            const randomCode = randomAccessCode();
            await redisHmsetAsync(emailAddress, {code: randomCode, timestamp: Date.now()});
            await sendTemporaryAccessCode(emailAddress, randomCode);
            return "Code Sent";
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};