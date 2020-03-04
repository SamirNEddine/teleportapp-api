const graphql = require('graphql');
const { NonNull } = require('../../../utils/graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
} = graphql;

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.Skill = new GraphQLObjectType({
    name: 'Skill',
    fields: () => ({
        id: NonNull(GraphQLID),
        name: NonNull(GraphQLString)
    })
});