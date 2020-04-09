const graphql = require('graphql');
const {AvailabilityProfileType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    createAvailabilityProfileResolver,
    updateAvailabilityProfilePropertiesResolver,
    updateAvailabilityProfilePropertiesWithProfileKeyResolver,
    removeAvailabilityProfileResolver,
    removeAvailabilityProfileForKeyResolver
} = require('./resolvers');

const {
    GraphQLString
} = graphql;

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
const removeAvailabilityProfile = {
    type: GraphQLString,
    args: inputFields.removeAvailabilityProfile,
    resolve: authenticatedResolver(removeAvailabilityProfileResolver)
};
const removeAvailabilityProfileForKey = {
    type: GraphQLString,
    args: inputFields.removeAvailabilityProfileForKey,
    resolve: authenticatedResolver(removeAvailabilityProfileForKeyResolver)
};

/** Exports **/
module.exports = {
    createAvailabilityProfile,
    updateAvailabilityProfileProperties,
    updateAvailabilityProfilePropertiesWithProfileKey,
    removeAvailabilityProfile,
    removeAvailabilityProfileForKey
};