const {GraphQLString} = require('graphql');
const {UserType, UserPreferencesType, TimeSlotType, inputFields} = require('../type');
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
    scheduleAvailabilityForTodayResolver,
    getAndConfirmRemainingAvailabilityResolver,
    updateAvailabilityProfileResolver,
    overrideCurrentAvailabilityResolver
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
const scheduleAvailabilityForToday = {
    type: GraphQLString,
    args: inputFields.scheduleAvailabilityForToday,
    resolve: authenticatedResolver(scheduleAvailabilityForTodayResolver)
};
const getAndConfirmRemainingAvailability = {
    type: GraphQLString,
    resolve: authenticatedResolver(getAndConfirmRemainingAvailabilityResolver)
};
const overrideCurrentAvailability = {
    type: TimeSlotType,
    args: inputFields.overrideCurrentAvailability,
    resolve: authenticatedResolver(overrideCurrentAvailabilityResolver)
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
    scheduleAvailabilityForToday,
    getAndConfirmRemainingAvailability,
    overrideCurrentAvailability
};