const {AvailabilityProfileType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    createAvailabilityProfileResolver,
    updateAvailabilityProfilePropertiesResolver,
    updateAvailabilityProfilePropertiesWithProfileKeyResolver
} = require('./resolvers');

/** Mutations definitions **/
const createAvailabilityProfile = {
    type: AvailabilityProfileType,
    args: inputFields.createAvailabilityProfile,
    resolve: authenticatedResolver(createAvailabilityProfileResolver)
};
const updateAvailabilityProfileProperties = {
    type: AvailabilityProfileType,
    args: inputFields.updateAvailabilityProfileProperties,
    resolve: authenticatedResolver(updateAvailabilityProfilePropertiesResolver)
};
const updateAvailabilityProfilePropertiesWithProfileKey = {
    type: AvailabilityProfileType,
    args: inputFields.updateAvailabilityProfilePropertiesWithProfileKey,
    resolve: authenticatedResolver(updateAvailabilityProfilePropertiesWithProfileKeyResolver)
};

/** Exports **/
module.exports = {
    createAvailabilityProfile,
    updateAvailabilityProfileProperties,
    updateAvailabilityProfilePropertiesWithProfileKey
};