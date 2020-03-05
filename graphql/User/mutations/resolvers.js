const User = require('../../../model/User');
const nameFromEmail = require('../../../utils/nameFromEmail');
const {sendTemporaryAccessCode} = require('../../../utils/sendgrid');
const { generateTemporaryAccessCode, verifyTemporaryAccessCode } = require('../../../utils/authentication');

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
            const code = await generateTemporaryAccessCode(emailAddress);
            await sendTemporaryAccessCode(emailAddress, code);
            return "Code Sent";
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};

module.exports.authWithTemporaryCodeResolver = async function (_, {emailAddress, code}) {
    try {
        await verifyTemporaryAccessCode(emailAddress, code);
        const user = await User.findOne({emailAddress});

        return user;
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};