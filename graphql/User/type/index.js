const graphql = require('graphql');
const {NonNull} = require('../../../utils/graphql');
const {SkillType} = require('../../Skill');
const {AvailabilityProfileType} = require('../../AvailabilityProfile');
const {
    nestedUserSkillsResolver,
    nestedRemainingAvailabilityResolver,
    nestedSuggestedAvailabilityResolver,
    nestedCurrentAvailabilityResolver,
    nestedAvailabilityProfileResolver
} = require('./nestedResolvers');
const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;

/** Nested TimeSlot type **/
const TimeSlotType = module.exports.TimeSlotType = new GraphQLObjectType({
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
            type: GraphQLList(TimeSlotType)
        },
        focusTimeSlots: {
            type: GraphQLList(TimeSlotType)
        },
        availableTimeSlots: {
            type: GraphQLList(TimeSlotType)
        },
        unassignedTimeSlots: {
            type: GraphQLList(TimeSlotType)
        }
    })
});

/** Nested UserPreferences type **/
const UserPreferencesType = module.exports.UserPreferencesType = new GraphQLObjectType({
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
        },
        lunchTime: {
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
            type: TimeSlotType,
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
            type: NonNull(UserPreferencesType)
        },
        accessToken: {
            type: NonNull(GraphQLString)
        },
        refreshToken: {
            type: NonNull(GraphQLString)
        },
        availabilityProfile: {
            type: NonNull(AvailabilityProfileType),
            resolve: nestedAvailabilityProfileResolver
        }
    })
});

/** Input fields for queries and mutations **/
const TimeSlotInputType = new GraphQLInputObjectType({
    name: 'TimeSlotInput',
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
    updateUserPreferences: {
        startWorkTime: {type: GraphQLString},
        endWorkTime: {type: GraphQLString},
        lunchTime: {type: GraphQLString},
        dailySetupTime: {type: GraphQLString}
    },
    updateAvailabilityProfile: {
        availabilityProfileId: {type: GraphQLString},
    },
    addGoogleCalendarIntegration: {
        code: {type: NonNull(GraphQLString)}
    },
    updateRemainingAvailability: {
        timeSlots: {type: NonNull(GraphQLList(TimeSlotInputType))}
    },
    overrideCurrentAvailability: {
        newAvailability: {type: NonNull(GraphQLString)}
    }
};