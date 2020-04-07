const Skill = require('../../../model/Skill');
const {getRemainingAvailabilityForUser, getSuggestedAvailabilityForUser, getCurrentAvailabilityForUser} = require('../../../helpers/contextService');
const {getTimestampFromLocalTodayTime} = require('../../../utils/timezone');

module.exports.nestedUserSkillsResolver = async function (user) {
    try{
        return await Skill.find({'_id': {$in: user.skills}})
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedRemainingAvailabilityResolver = async function (user) {
    try{
        const startTimestamp = getTimestampFromLocalTodayTime(user.preferences.startWorkTime, user.IANATimezone);
        const endTimestamp = getTimestampFromLocalTodayTime(user.preferences.endWorkTime, user.IANATimezone);
        return await getRemainingAvailabilityForUser(user.id, startTimestamp, endTimestamp);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedSuggestedAvailabilityResolver = async function (user) {
    try{
        const startTimestamp = getTimestampFromLocalTodayTime(user.preferences.startWorkTime, user.IANATimezone);
        const endTimestamp = getTimestampFromLocalTodayTime(user.preferences.endWorkTime, user.IANATimezone);
        //To do: Get User profile values here
        return await getSuggestedAvailabilityForUser(user.id, startTimestamp, endTimestamp, 15, 60);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedCurrentAvailabilityResolver = async function (user) {
    try{
        const startTimestamp = getTimestampFromLocalTodayTime(user.preferences.startWorkTime, user.IANATimezone);
        const endTimestamp = getTimestampFromLocalTodayTime(user.preferences.endWorkTime, user.IANATimezone);
        return await getCurrentAvailabilityForUser(user.id, startTimestamp, endTimestamp);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};