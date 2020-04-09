const User = require('../../../model/User');
const AvailabilityProfile = require('../../../model/AvailabilityProfile');
const nameFromEmail = require('../../../utils/nameFromEmail');
const {sendTemporaryAccessCode} = require('../../../utils/sendgrid');
const {generateTemporaryAccessCode, verifyTemporaryAccessCode, getJWTAccessTokenForUser, getJWTRefreshTokenForUser, getPayloadFromJWTRefreshToken} = require('../../../utils/authentication');
const {signInWithSlack, fetchUserInfoFromSlack, updateUserStatus} = require ('../../../utils/slack');
const {authorizeCalendarAccess, createCalendarEvent} = require('../../../utils/google');
const {updateSlackIntegrationForUser, updateGoogleIntegrationForUser, updateRemainingAvailabilityForUser, getSuggestedAvailabilityForUser, updateUserContextParams} = require('../../../helpers/contextService');

const DEFAULT_AVAILABILITY_PROFILE_KEY = 'notBusy';
module.exports.signInWithEmailResolver = async function (_, {emailAddress}, {IANATimezone}) {
    try{
        //Check if email exists
        let user = await User.findOne({emailAddress});
        if(!user) {
            const fullName = nameFromEmail(emailAddress);
            const defaultProfile = await AvailabilityProfile.findOne({key: DEFAULT_AVAILABILITY_PROFILE_KEY});
            user = User({emailAddress, firstName: fullName.firstName, lastName: fullName.lastName, availabilityProfile:defaultProfile.id, IANATimezone});
            await updateUserContextParams(user.id, await user.contextParams);
            user = await user.save();
        }
        if(user.password) {
            //Auth with password
            return 'Enter password';
        }else {
            //Password less auth. Send a temporary code
            const code = await generateTemporaryAccessCode(emailAddress);
            await sendTemporaryAccessCode(emailAddress, code);
            return 'Code Sent';
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
module.exports.signInWithSlackResolver = async function (_, {code}, {IANATimezone}){
    try {
        const slackIntegrationData = await signInWithSlack(code);
        const fetchedUserInfo = await fetchUserInfoFromSlack(slackIntegrationData);
        let user = await User.findOne({emailAddress: fetchedUserInfo.emailAddress});
        if(!user){
            const defaultProfile = await AvailabilityProfile.findOne({key: DEFAULT_AVAILABILITY_PROFILE_KEY});
            fetchedUserInfo.availabilityProfile = defaultProfile.id;
            fetchedUserInfo.IANATimezone = IANATimezone;
            user = User(fetchedUserInfo);
            await updateUserContextParams(user.id, await user.contextParams);
        }
        await updateSlackIntegrationForUser(user.id, slackIntegrationData);
        await user.save();
        user.accessToken = getJWTAccessTokenForUser(user.id, user.emailAddress);
        user.refreshToken = getJWTRefreshTokenForUser(user.id);
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
module.exports.updateUserPreferencesResolver = async function(_, preferences, {jwtUser}) {
    try {
        const user = await User.findById(jwtUser.id);
        if(!user) {
            //Shouldn't happen?
        }else{
            await user.updateUserPreferences(preferences);
            return user.preferences;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateAvailabilityProfileResolver = async function(_, {availabilityProfileId}, {jwtUser}) {
    try {
        const user = await User.findById(jwtUser.id);
        if(user.availabilityProfile !== availabilityProfileId){
            const newAvailabilityProfile = await AvailabilityProfile.findById(availabilityProfileId);
            if(newAvailabilityProfile){
                user.availabilityProfile = availabilityProfileId;
                await updateUserContextParams(user.id, await user.contextParams);
                await user.save();
            }
        }
        return await AvailabilityProfile.findById(user.availabilityProfile);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.addGoogleCalendarIntegrationResolver = async function (_, {code}, {jwtUser}) {
    try {
        const googleIntegrationData = await authorizeCalendarAccess(code);
        await updateGoogleIntegrationForUser(jwtUser.id, googleIntegrationData);
        return 'OK';
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateRemainingAvailabilityResolver = async function (_, {timeSlots}, {jwtUser}) {
    try {
        await updateRemainingAvailabilityForUser(jwtUser.id, timeSlots);
        return 'OK';
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.getAndConfirmRemainingAvailabilityResolver = async function (_, args, {jwtUser, IANATimezone}) {
    try {
        const user = await User.findById(jwtUser.id);
        const availability = await getSuggestedAvailabilityForUser(user.id);
        await updateRemainingAvailabilityForUser(jwtUser.id, availability.focusTimeSlots.concat(availability.availableTimeSlots));
        return 'OK';
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};