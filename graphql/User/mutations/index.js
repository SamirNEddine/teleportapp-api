const {GraphQLString} = require('graphql');
const {UserType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    signInWithEmailResolver,
    authWithTemporaryCodeResolver,
    updateUserProfileResolver,
    signInWithSlackResolver,
    refreshAccessTokenResolver,
    updateAvailabilityLevelResolver
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

/** Exports **/
module.exports = {
    signInWithEmail,
    authWithTemporaryCode,
    signInWithSlack,
    refreshAccessToken,
    updateUserProfile,
    updateAvailabilityLevel
};