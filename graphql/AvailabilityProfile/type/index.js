const graphql = require('graphql');
const { NonNull } = require('../../../utils/graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString
} = graphql;

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.AvailabilityProfileType = new GraphQLObjectType({
    name: 'AvailabilityProfile',
    fields: () => ({
        id: {
            type: NonNull(GraphQLID)
        },
        name: {
            type: NonNull(GraphQLString)
        },
        key: {
            type: NonNull(GraphQLString)
        },
        minAvailableSlotInMinutes: {
            type: NonNull(GraphQLString)
        },
        minFocusSlotInMinutes: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Input fields for queries and mutations **/
module.exports.inputFields = {
    //queries
    availabilityProfile: {
        id: {type: NonNull(GraphQLID)}
    },
    availabilityProfileForKey: {
        key: {type: NonNull(GraphQLString)}
    },
    //Mutations
    createAvailabilityProfile: {

    },
    updateAvailabilityProfileProperties: {

    },
    updateAvailabilityProfilePropertiesWithProfileKey: {

    }
};