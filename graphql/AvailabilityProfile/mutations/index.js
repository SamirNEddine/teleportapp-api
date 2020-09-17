const graphql = require('graphql');
const {AvailabilityProfileType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const { authorizedResolver, AccessLevels } = require('../../../utils/authorization');
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
    resolve: authenticatedResolver(authorizedResolver(createAvailabilityProfileResolver, AccessLevels.SUPER_ADMIN))
};
const updateAvailabilityProfileProperties = {
    type: AvailabilityProfileType,
    args: inputFields.updateAvailabilityProfileProperties,
    resolve: authenticatedResolver(authorizedResolver(updateAvailabilityProfilePropertiesResolver, AccessLevels.SUPER_ADMIN))
};
const updateAvailabilityProfilePropertiesWithProfileKey = {
    type: AvailabilityProfileType,
    args: inputFields.updateAvailabilityProfilePropertiesWithProfileKey,
    resolve: authenticatedResolver(authorizedResolver(updateAvailabilityProfilePropertiesWithProfileKeyResolver, AccessLevels.SUPER_ADMIN))
};
const removeAvailabilityProfile = {
    type: GraphQLString,
    args: inputFields.removeAvailabilityProfile,
    resolve: authenticatedResolver(authorizedResolver(removeAvailabilityProfileResolver, AccessLevels.SUPER_ADMIN))
};
const removeAvailabilityProfileForKey = {
    type: GraphQLString,
    args: inputFields.removeAvailabilityProfileForKey,
    resolve: authenticatedResolver(authorizedResolver(removeAvailabilityProfileForKeyResolver, AccessLevels.SUPER_ADMIN))
};

/** Exports **/
module.exports = {
    createAvailabilityProfile,
    updateAvailabilityProfileProperties,
    updateAvailabilityProfilePropertiesWithProfileKey,
    removeAvailabilityProfile,
    removeAvailabilityProfileForKey
};