const User = require('../../../model/User');
const nameFromEmail = require('../../../utils/nameFromEmail');
const {sendTemporaryAccessCode} = require('../../../utils/sendgrid');
const {generateTemporaryAccessCode, verifyTemporaryAccessCode, getJWTAccessTokenForUser, getJWTRefreshTokenForUser, getPayloadFromJWTRefreshToken} = require('../../../utils/authentication');
const {signInWithSlack, fetchUserInfoFromSlack} = require ('../../../utils/slack');

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
        user.accessToken = getJWTAccessTokenForUser(user.id, user.emailAddress);
        user.refreshToken = getJWTRefreshTokenForUser(user.id);
        return user;
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.signInWithSlackResolver = async function (_, {code}){
    try {
        const slackIntegrationData = await signInWithSlack(code);
        const fetchedUserInfo = await fetchUserInfoFromSlack(slackIntegrationData);
        let user = await User.findOne({emailAddress: fetchedUserInfo.emailAddress});
        if(!user){
            user = User(fetchedUserInfo);
        }
        user.setIntegrationData("slack", slackIntegrationData);
        user.accessToken = getJWTAccessTokenForUser(user.id, user.emailAddress);
        user.refreshToken = getJWTRefreshTokenForUser(user.id);
        await user.save();
        return user;
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.refreshAccessTokenResolver = async function (_, {refreshToken}) {
    try {
        const payload = await getPayloadFromJWTRefreshToken(refreshToken);
        const user = await User.findById(payload.userId);
        user.accessToken = getJWTAccessTokenForUser(user.id, user.emailAddress);
        user.refreshToken = getJWTRefreshTokenForUser(user.id);
        return user;
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateUserProfileResolver = async function (_, {firstName, lastName}, {jwtUser}) {
    try {
        const user = await User.findOneAndUpdate(
            {_id: jwtUser.id},
            {firstName, lastName},
            {new: true});
        if(!user) {
        }else{
            return user;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};