const graphql = require('graphql');
const {inputFields} = require('../type');
const {authenticatedResolver} = require('../../../utils/authentication');
const {
    userResolver,
    getGoogleCalendarAuthURLResolver
} = require('./resolvers');

const {
    GraphQLString
} = graphql;

/** Queries definitions **/
const user = {
    type: GraphQLString,
    args: inputFields.user,
    resolve: userResolver
};
const getGoogleCalendarAuthURL = {
    type: GraphQLString,
    resolve: authenticatedResolver(getGoogleCalendarAuthURLResolver)
};

/** Exports **/
module.exports = {
    user,
    getGoogleCalendarAuthURL
};