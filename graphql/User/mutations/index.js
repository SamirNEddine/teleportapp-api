const {GraphQLString} = require('graphql');
const {UserType, inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {signInWithEmailResolver,authWithTemporaryCodeResolver,updateUserProfileResolver} = require('./resolvers');

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

const updateUserProfile = {
    type: UserType,
    args: inputFields.updateUserProfile,
    resolve: authenticatedResolver(updateUserProfileResolver)
};

/** Exports **/
module.exports = {
    signInWithEmail,
    authWithTemporaryCode,
    updateUserProfile
};