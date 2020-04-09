const AvailabilityProfile = require('../../../model/AvailabilityProfile');

module.exports.createAvailabilityProfileResolver = async function (_, availabilityProfileProperties) {
    try {
        const {key} = availabilityProfileProperties;
        const existingProfileFromKey = await AvailabilityProfile.findOne({key});
        if(existingProfileFromKey){
            throw(new Error('Key is already used for another profile!'));
        }else{
            const newProfile = new AvailabilityProfile(availabilityProfileProperties);
            await newProfile.save();
            return newProfile;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateAvailabilityProfilePropertiesResolver = async function (_, availabilityProfileProperties) {
    try {
        const {id} = availabilityProfileProperties;
        const profile = await AvailabilityProfile.findById(id);
        if(!profile){
            throw(new Error('No profile found with the provided id!'));
        }else{
            const {key} = availabilityProfileProperties;
            if(key && key !== profile.key){
                const existingProfileFromKey = await AvailabilityProfile.findOne({key});
                if(existingProfileFromKey) throw(new Error('The new key is already used for another profile!'));
            }
            await profile.updateProperties(availabilityProfileProperties);
            return profile;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};
module.exports.updateAvailabilityProfilePropertiesWithProfileKeyResolver = async function (_, availabilityProfileProperties) {
    try {
        const {key} = availabilityProfileProperties;
        const profile = await AvailabilityProfile.findOne({key});
        if(!profile){
            throw(new Error('No profile found with the provided key!'));
        }else{
            await profile.updateProperties(availabilityProfileProperties);
            return profile;
        }
    }catch (error) {
        console.debug(error);
        throw(error);
    }
};