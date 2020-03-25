const Skill = require('../../../model/Skill');

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
        return "To do";
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};