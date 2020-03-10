const graphql = require('graphql');
const {UserType, inputFields} = require('../type');
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
    type: UserType,
    args: inputFields.user,
    resolve: authenticatedResolver(userResolver)
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