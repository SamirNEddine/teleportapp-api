const axios = require('axios');
const ApiError = require('../utils/apiError');

const contextServiceAPIBaseURL = process.env.CONTEXT_SERVICE_API_URL;
const clientId = process.env.CONTEXT_SERVICE_API_CLIENT_ID;
const clientSecret = process.env.CONTEXT_SERVICE_API_CLIENT_SECRET;

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
const scheduleTodayAvailabilityForUser = async function (userId, timeSlots) {
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
module.exports.setCurrentAvailabilityForUser = setCurrentAvailabilityForUser;
module.exports.scheduleTodayAvailabilityForUser = scheduleTodayAvailabilityForUser;
module.exports.updateUserContextParams = updateUserContextParams;