const graphql = require('graphql');
const {GraphQLUser, inputFields} = require('../type');
const {signInWithEmailResolver} = require('./resolvers');
const {GraphQLString} = graphql;

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