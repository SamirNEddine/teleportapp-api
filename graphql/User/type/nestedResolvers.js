const Skill = require('../../../model/Skill');
const {getRemainingAvailabilityForUser, getSuggestedAvailabilityForUser, getCurrentAvailabilityForUser} = require('../../../helpers/contextService');

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
        return await getRemainingAvailabilityForUser(user.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedSuggestedAvailabilityResolver = async function (user) {
    try{
        return await getSuggestedAvailabilityForUser(user.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedCurrentAvailabilityResolver = async function (user) {
    try{
        return await getCurrentAvailabilityForUser(user.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};