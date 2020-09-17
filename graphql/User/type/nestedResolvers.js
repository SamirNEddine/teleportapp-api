const Company = require('../../../model/Company');
const Skill = require('../../../model/Skill');
const AvailabilityProfile = require('../../../model/AvailabilityProfile');
const {
    getTodayAvailabilityForUser,
    getSuggestedAvailabilityForUser,
    getCurrentAvailabilityForUser,
    hasScheduledAvailabilityForToday,
    getNextAvailabilityForUser,
    getIntegrationsForUser
} = require('../../../helpers/contextService');

module.exports.nestedUserCompanyResolver = async function (user) {
    try{
        return await Company.findById(user.companyId);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedUserDepartmentResolver = async function (user) {
    try{
        const company = await Company.findById(user.companyId);
        return company.departments.find(dep => user.departmentId == dep.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedUserSiteResolver = async function (user) {
    try{
        const company = await Company.findById(user.companyId);
        return company.sites.find(site => user.siteId == site.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedUserTeamResolver = async function (user) {
    try{
        const company = await Company.findById(user.companyId);
        return company.teams.find(team => user.teamId == team.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedUserSkillsResolver = async function (user) {
    try{
        return await Skill.find({'_id': {$in: user.skills}})
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedTodayAvailabilityResolver = async function (user) {
    try{
        return await getTodayAvailabilityForUser(user.id);
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
module.exports.nestedNextAvailabilityResolver = async function (user) {
    try{
        return await getNextAvailabilityForUser(user.id);
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
module.exports.nestedHasScheduledAvailabilityForTodayResolver = async function(user) {
    try{
        return await hasScheduledAvailabilityForToday(user.id, user.IANATimezone);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.nestedIntegrationsResolver = async function(user) {
    try{
        return await getIntegrationsForUser(user.id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};