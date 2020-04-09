const {GraphQLString} = require('graphql');
const {UserType, UserPreferencesType, inputFields} = require('../type');
const {AvailabilityProfileType} = require('../../AvailabilityProfile');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    signInWithEmailResolver,
    authWithTemporaryCodeResolver,
    updateUserProfileResolver,
    signInWithSlackResolver,
    refreshAccessTokenResolver,
    updateUserPreferencesResolver,
    addGoogleCalendarIntegrationResolver,
    updateRemainingAvailabilityResolver,
    getAndConfirmRemainingAvailabilityResolver,
    updateAvailabilityProfileResolver
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
const updateUserPreferences = {
    type: UserPreferencesType,
    args: inputFields.updateUserPreferences,
    resolve: authenticatedResolver(updateUserPreferencesResolver)
};
const updateAvailabilityProfile = {
    type: AvailabilityProfileType,
    args: inputFields.updateAvailabilityProfile,
    resolve: authenticatedResolver(updateAvailabilityProfileResolver)
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
const getAndConfirmRemainingAvailability = {
    type: GraphQLString,
    resolve: authenticatedResolver(getAndConfirmRemainingAvailabilityResolver)
};

/** Exports **/
module.exports = {
    signInWithEmail,
    authWithTemporaryCode,
    signInWithSlack,
    refreshAccessToken,
    updateUserProfile,
    updateUserPreferences,
    updateAvailabilityProfile,
    addGoogleCalendarIntegration,
    updateRemainingAvailability,
    getAndConfirmRemainingAvailability
};