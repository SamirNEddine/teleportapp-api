const graphql = require('graphql');

const {
    GraphQLSchema,
    GraphQLObjectType
} = graphql;

/** Types **/

/** Queries **/
const RootQuery = new GraphQLObjectType({
    name: "Query",
    fields: {
    }
});

/** Mutations **/
const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
    }
});

/** Schema **/
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});