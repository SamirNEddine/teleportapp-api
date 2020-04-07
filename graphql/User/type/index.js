const graphql = require('graphql');
const {NonNull} = require('../../../utils/graphql');
const {SkillType} = require('../../Skill');
const {nestedUserSkillsResolver, nestedRemainingAvailabilityResolver, nestedSuggestedAvailabilityResolver, nestedCurrentAvailabilityResolver} = require('./nestedResolvers');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;

/** Nested TimeSlot type **/
const TimeSlot = new GraphQLObjectType({
    name: 'TimeSlot',
    fields: () => ({
        start: {
            type: NonNull(GraphQLString)
        },
        end: {
            type: NonNull(GraphQLString)
        },
        status: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Nested Availability type **/
const AvailabilityType = new GraphQLObjectType({
    name: 'Availability',
    fields: () => ({
        busyTimeSlots: {
            type: GraphQLList(TimeSlot)
        },
        focusTimeSlots: {
            type: GraphQLList(TimeSlot)
        },
        availableTimeSlots: {
            type: GraphQLList(TimeSlot)
        },
        unassignedTimeSlots: {
            type: GraphQLList(TimeSlot)
        }
    })
});

/** Nested UserPreferences type **/
const UserPreferences = new GraphQLObjectType({
    name: 'Preferences',
    fields: () => ({
        startWorkTime: {
            type: NonNull(GraphQLString)
        },
        endWorkTime: {
            type: NonNull(GraphQLString)
        },
        dailySetupTime: {
            type: NonNull(GraphQLString)
        }
    })
});

/** Type definition **/
//Exports soon enough to overcome circular dependencies issues
module.exports.UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {
            type: NonNull(GraphQLID)
        },
        firstName: {
            type: NonNull(GraphQLString)
        },
        lastName: {
            type: GraphQLString
        },
        emailAddress: {
            type: NonNull(GraphQLString)
        },
        profilePictureURL: {
            type: GraphQLString
        },
        phoneNumber: {
            type: GraphQLString
        },
        skills: {
            type: GraphQLList(SkillType),
            resolve: nestedUserSkillsResolver
        },
        currentAvailability: {
            type: TimeSlot,
            resolve: nestedCurrentAvailabilityResolver
        },
        remainingAvailability: {
            type: AvailabilityType,
            resolve: nestedRemainingAvailabilityResolver
        },
        suggestedAvailability: {
            type: AvailabilityType,
            resolve: nestedSuggestedAvailabilityResolver
        },
        preferences: {
            type: UserPreferences
        },
        accessToken: {
            type: GraphQLString
        },
        refreshToken: {
            type: GraphQLString
        }
    })
});

/** Input fields for queries and mutations **/
module.exports.inputFields = {
    //Mutations
    signInWithEmail: {
        emailAddress: {type: NonNull(GraphQLString)}
    },
    authWithTemporaryCode: {
        emailAddress: {type: NonNull(GraphQLString)},
        code: {type: NonNull(GraphQLString)}
    },
    signInWithSlack: {
        code: {type: NonNull(GraphQLString)}
    },
    refreshAccessToken: {
        refreshToken: {type: NonNull(GraphQLString)}
    },
    updateUserProfile: {
        firstName: {type: NonNull(GraphQLString)},
        lastName: {type: NonNull(GraphQLString)}
    },
    updateAvailabilityLevel: {
        level: {type: NonNull(GraphQLInt)}
    },
    addGoogleCalendarIntegration: {
        code: {type: NonNull(GraphQLString)}
    }
};