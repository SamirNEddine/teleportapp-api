const axios = require('axios');
const {redisGetAsync, redisSetAsyncWithTTL} = require('../utils/redis');
const ApiError = require('../utils/apiError');

const contextServiceAPIBaseURL = process.env.CONTEXT_SERVICE_API_URL;
const clientId = process.env.CONTEXT_SERVICE_API_CLIENT_ID;
const clientSecret = process.env.CONTEXT_SERVICE_API_CLIENT_SECRET;
const CALENDAR_INTEGRATION_ENABLED_REDIS_PREFIX = 'calendarIntegrationEnabled';
const HAS_SCHEDULES_AVAILABILITY_FOR_TODAY_REDIS_PREFIX = 'hasScheduledAvailabilityForToday';

/** Private **/
const _hasScheduledAvailabilityRedisKey = function (userId) {
    return `${HAS_SCHEDULES_AVAILABILITY_FOR_TODAY_REDIS_PREFIX}_${userId}`;
};
const _updateHasScheduledAvailabilityCache = async function (userId, IANATimezone, value) {
    const {getTimestampFromLocalTodayTime} = require('../utils/timezone');
    const redisKey = _hasScheduledAvailabilityRedisKey(userId);
    const now = new Date().getTime();
    const TTL = Math.floor((getTimestampFromLocalTodayTime('2359', IANATimezone) - now) / 1000);
    await redisSetAsyncWithTTL(redisKey, value, TTL);
};
const _getHasScheduledAvailabilityCache = async function (userId) {
    const redisKey = _hasScheduledAvailabilityRedisKey(userId);
    return await redisGetAsync(redisKey);
};

/** Public **/
const updateIntegrationForUser = async function (userId, name, data) {
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}/integration/`,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            clientId,
            clientSecret,
            userId,
            name,
            data
        }),
        proxy: false
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    //Quick and dirty for now
    if(name === 'google'){
        const redisKey = `${CALENDAR_INTEGRATION_ENABLED_REDIS_PREFIX}_${userId}`;
        await redisSetAsyncWithTTL(redisKey, response.status === 200 ? 'yes' : 'no', 7*24*60*60);
    }
};
const getTodayAvailabilityForUser = async function (userId) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/today?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const getSuggestedAvailabilityForUser = async function (userId) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/suggested?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const getCurrentAvailabilityForUser = async function (userId) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/current?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const getNextAvailabilityForUser = async function (userId) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/next?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const setCurrentAvailabilityForUser = async function (userId, newAvailability) {
    if(newAvailability !== 'available' && newAvailability !== 'focus') {
        throw(new Error('Invalid availability!'));
    }
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}/availability/current`,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            clientId,
            clientSecret,
            userId,
            newAvailability,
        }),
        proxy: false
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const scheduleTodayAvailabilityForUser = async function (userId, timeSlots, IANATimezone) {
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}/availability/today`,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            clientId,
            clientSecret,
            userId,
            timeSlots,
        }),
        proxy: false
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }else{
        //Update cache
        await _updateHasScheduledAvailabilityCache(userId, IANATimezone, 'yes');
    }
    return response.data;
};
const updateUserContextParams = async function (userId, userContextParams) {
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}/userContextParams/`,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            clientId,
            clientSecret,
            userId,
            userContextParams,
        }),
        proxy: false
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
};
module.exports.hasCalendarIntegrationEnabled = async function (userId) {
    const redisKey = `${CALENDAR_INTEGRATION_ENABLED_REDIS_PREFIX}_${userId}`;
    const cachedResult = await redisGetAsync(redisKey);
    if(cachedResult){
        return cachedResult === 'yes';
    }else{
        const request = {
            method: "GET",
            url: `${contextServiceAPIBaseURL}/integration?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}&name=google`
        };
        const response = await axios(request);
        await redisSetAsyncWithTTL(redisKey, response.status === 200 ? 'yes' : 'no', 7*24*60*60);
        return response.status === 200;
    }
};
module.exports.hasScheduledAvailabilityForToday = async function (userId, IANATimezone) {
    const cachedResult = await _getHasScheduledAvailabilityCache(userId);
    if(cachedResult){
        return cachedResult === 'yes';
    }else {
        const request = {
            method: "GET",
            url: `${contextServiceAPIBaseURL}/availability/today/scheduled?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}`
        };
        const response = await axios(request);
        if (response.status === 200) {
            await _updateHasScheduledAvailabilityCache(userId, IANATimezone, response.data);
            return response.data === 'yes';
        } else {
            return false;
        }
    }
};

/** admin **/
module.exports.cleanContextServiceDataForUser = async function(userId) {
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}/admin/deleteAccount`,
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            clientId,
            clientSecret,
            userId
        }),
        proxy: false
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data
};

/** Exports **/
module.exports.updateSlackIntegrationForUser = updateSlackIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'slack', data);
};
module.exports.updateGoogleIntegrationForUser = updateGoogleIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'google', data);
};
module.exports.getTodayAvailabilityForUser = getTodayAvailabilityForUser;
module.exports.getSuggestedAvailabilityForUser = getSuggestedAvailabilityForUser;
module.exports.getCurrentAvailabilityForUser = getCurrentAvailabilityForUser;
module.exports.getNextAvailabilityForUser = getNextAvailabilityForUser;
module.exports.setCurrentAvailabilityForUser = setCurrentAvailabilityForUser;
module.exports.scheduleTodayAvailabilityForUser = scheduleTodayAvailabilityForUser;
module.exports.updateUserContextParams = updateUserContextParams;