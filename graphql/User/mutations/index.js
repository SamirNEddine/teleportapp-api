const {GraphQLString} = require('graphql');
const {UserType, inputFields} = require('../type');
const {signInWithEmailResolver,authWithTemporaryCodeResolver} = require('./resolvers');

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

/** Exports **/
module.exports = {
    signInWithEmail,
    authWithTemporaryCode
};