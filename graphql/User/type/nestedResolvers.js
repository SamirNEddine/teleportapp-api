const Skill = require('../../../model/Skill');
const {getAvailabilityForUser} = require('../../../helpers/contextService');
const {getTimestampFromLocalTodayTime} = require('../../../utils/timezone');

module.exports.nestedUserSkillsResolver = async function (user) {
    try{
        return await Skill.find({'_id': {$in: user.skills}})
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedAvailabilityResolver = async function (user, {timeFrameInHours=120}) {
    try{
        const startTimestamp = getTimestampFromLocalTodayTime(user.preferences.startWorkTime, user.IANATimezone);
        const endTimestamp = getTimestampFromLocalTodayTime(user.preferences.endWorkTime, user.IANATimezone);
        return await getAvailabilityForUser(user.id, startTimestamp, endTimestamp);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};