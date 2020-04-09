const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType
} = graphql;

/** Types **/
const User = require('./User');
const AvailabilityProfile = require('./AvailabilityProfile');

/** Queries **/
const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...User.queries,
        ...AvailabilityProfile.queries
    }
});

/** Mutations **/
const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...User.mutations,
        ...AvailabilityProfile.mutations
    }
});

/** Schema **/
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});