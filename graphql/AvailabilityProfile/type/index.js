const graphql = require('graphql');
const { NonNull } = require('../../../utils/graphql');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
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
            type: NonNull(GraphQLInt)
        },
        minFocusSlotInMinutes: {
            type: NonNull(GraphQLInt)
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
        key: {type: NonNull(GraphQLString)},
        name: {type: NonNull(GraphQLString)},
        minAvailableSlotInMinutes: {type: NonNull(GraphQLInt)},
        minFocusSlotInMinutes: {type: NonNull(GraphQLInt)}
    },
    updateAvailabilityProfileProperties: {
        id: {type: NonNull(GraphQLID)},
        key: {type: GraphQLString},
        name: {type: GraphQLString},
        minAvailableSlotInMinutes: {type: GraphQLInt},
        minFocusSlotInMinutes: {type: GraphQLInt}
    },
    updateAvailabilityProfilePropertiesWithProfileKey: {
        key: {type: NonNull(GraphQLString)},
        name: {type: GraphQLString},
        minAvailableSlotInMinutes: {type: GraphQLInt},
        minFocusSlotInMinutes: {type: GraphQLInt}
    },
    removeAvailabilityProfile: {
        id: {type: NonNull(GraphQLID)}
    },
    removeAvailabilityProfileForKey: {
        key: {type: NonNull(GraphQLString)}
    }
};