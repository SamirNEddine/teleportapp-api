const {GraphQLString} = require('graphql');
const {inputFields} = require('../type');
const {signInWithEmailResolver} = require('./resolvers');

/** Mutations definitions **/
const signInWithEmail = {
    type: GraphQLString,
    args: inputFields.signInWithEmail,
    resolve: signInWithEmailResolver
};

/** Exports **/
module.exports = {
    signInWithEmail
};