const graphql = require('graphql');
const {inputFields} = require('../type');
const {userResolver} = require('./resolvers');

const {
    GraphQLString
} = graphql;

/** Queries definitions **/
const user = {
    type: GraphQLString,
    args: inputFields.user,
    resolve: userResolver
};

/** Exports **/
module.exports = {
    user
};