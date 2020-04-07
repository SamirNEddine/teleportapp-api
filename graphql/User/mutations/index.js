const {GraphQLString} = require('graphql');
const {UserType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    signInWithEmailResolver,
    authWithTemporaryCodeResolver,
    updateUserProfileResolver,
    signInWithSlackResolver,
    refreshAccessTokenResolver,
    updateAvailabilityLevelResolver,
    addGoogleCalendarIntegrationResolver,
    updateRemainingAvailabilityResolver
} = require('./resolvers');

/** Mutations definitions **/
const signInWithEmail = {
    type: GraphQLString,
    args: inputFields.signInWithEmail,
    resolve: signInWithEmailResolver
};
const authWithTemporaryCode = {
    type: UserType,
    args: inputFields.authWithTemporaryCode,
    resolve: authWithTemporaryCodeResolver
};
const signInWithSlack = {
    type: UserType,
    args: inputFields.signInWithSlack,
    resolve: signInWithSlackResolver
};
const refreshAccessToken = {
    type: UserType,
    args: inputFields.refreshAccessToken,
    resolve: refreshAccessTokenResolver
};
const updateUserProfile = {
    type: UserType,
    args: inputFields.updateUserProfile,
    resolve: authenticatedResolver(updateUserProfileResolver)
};
const updateAvailabilityLevel = {
    type: GraphQLString,
    args: inputFields.updateAvailabilityLevel,
    resolve: authenticatedResolver(updateAvailabilityLevelResolver)
};
const addGoogleCalendarIntegration = {
    type: GraphQLString,
    args: inputFields.addGoogleCalendarIntegration,
    resolve: authenticatedResolver(addGoogleCalendarIntegrationResolver)
};
const updateRemainingAvailability = {
    type: GraphQLString,
    args: inputFields.updateRemainingAvailability,
    resolve: authenticatedResolver(updateRemainingAvailabilityResolver)
};

/** Exports **/
module.exports = {
    signInWithEmail,
    authWithTemporaryCode,
    signInWithSlack,
    refreshAccessToken,
    updateUserProfile,
    updateAvailabilityLevel,
    addGoogleCalendarIntegration,
    updateRemainingAvailability
};