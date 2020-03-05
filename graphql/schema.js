const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType
} = graphql;

/** Types **/
const User = require('./User');

/** Queries **/
const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...User.queries
    }
});

/** Mutations **/
const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...User.mutations
    }
});

/** Schema **/
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});