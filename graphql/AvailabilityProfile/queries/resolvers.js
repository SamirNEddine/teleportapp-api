const AvailabilityProfile = require('../../../model/AvailabilityProfile');

module.exports.availabilityProfileResolver = async function (_, {id}) {
    try {
        return await AvailabilityProfile.findById(id);
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.availabilityProfileForKeyResolver = async function (_, {key}) {
    try {
        return await AvailabilityProfile.findOne({key});
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.availabilityProfilesResolver = async function () {
    try {
        return await AvailabilityProfile.find();
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};