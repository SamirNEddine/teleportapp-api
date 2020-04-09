const graphql = require('graphql');
const {AvailabilityProfileType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    availabilityProfileResolver,
    availabilityProfileForKeyResolver,
    availabilityProfilesResolver
} = require('./resolvers');

const {
    GraphQLList
} = graphql;

/** Queries definitions **/
const availabilityProfile = {
    type: AvailabilityProfileType,
    args: inputFields.availabilityProfile,
    resolve: authenticatedResolver(availabilityProfileResolver)
};
const availabilityProfileForKey = {
    type: AvailabilityProfileType,
    args: inputFields.availabilityProfileForKey,
    resolve: authenticatedResolver(availabilityProfileForKeyResolver)
};
const availabilityProfiles = {
    type: GraphQLList(AvailabilityProfileType),
    resolve: authenticatedResolver(availabilityProfilesResolver)
};

/** Exports **/
module.exports = {
    availabilityProfile,
    availabilityProfileForKey,
    availabilityProfiles
};