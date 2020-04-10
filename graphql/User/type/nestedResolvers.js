const Skill = require('../../../model/Skill');
const AvailabilityProfile = require('../../../model/AvailabilityProfile');
const {getRemainingAvailabilityForUser, getSuggestedAvailabilityForUser, getCurrentAvailabilityForUser} = require('../../../helpers/contextService');

module.exports.nestedUserSkillsResolver = async function (user) {
    try{
        return await Skill.find({'_id': {$in: user.skills}})
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedRemainingAvailabilityForTodayResolver = async function (user) {
    try{
        return await getRemainingAvailabilityForUser(user.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedSuggestedAvailabilityForTodayResolver = async function (user) {
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
module.exports.nestedAvailabilityProfileResolver = async function (user) {
    try{
        return await AvailabilityProfile.findById(user.availabilityProfile);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};