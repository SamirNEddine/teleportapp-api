const Skill = require('../../../model/Skill');
const Availability = require('../../../model/Availability');;
const {performCalendarSync} = require('../../../utils/google')

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
        //Perform a calendar sync if needed
        await performCalendarSync(user, timeFrameInHours);

        return "To do";
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};