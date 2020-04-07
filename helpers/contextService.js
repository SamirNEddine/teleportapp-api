const axios = require('axios');
const ApiError = require('../utils/apiError');

const contextServiceAPIBaseURL = process.env.CONTEXT_SERVICE_API_URL;
const clientId = process.env.CONTEXT_SERVICE_API_CLIENT_ID;
const clientSecret = process.env.CONTEXT_SERVICE_API_CLIENT_SECRET;

const updateIntegrationForUser = async function (userId, name, data) {
    const request = {
        method: "POST",
        url: `${contextServiceAPIBaseURL}integration/`,
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
const getCurrentAvailabilityForUser = async function (userId, startTimestamp, endTimestamp) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/remaining?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};
const getSuggestedAvailabilityForUser = async function (userId, startTimestamp, endTimestamp, minAvailableSlotInMinutes, minFocusSlotInMinutes) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability/suggested?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&minAvailableSlotInMinutes=${minAvailableSlotInMinutes}&minFocusSlotInMinutes=${minFocusSlotInMinutes}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    return response.data;
};

/** Exports **/
module.exports.updateSlackIntegrationForUser = updateSlackIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'slack', data);
};
module.exports.updateGoogleIntegrationForUser = updateGoogleIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'google', data);
};
module.exports.getCurrentAvailabilityForUser = getCurrentAvailabilityForUser;
module.exports.getSuggestedAvailabilityForUser = getSuggestedAvailabilityForUser;