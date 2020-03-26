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
const getAvailabilityForUser = async function (userId, startTimestamp, endTimestamp) {
    const request = {
        method: "GET",
        url: `${contextServiceAPIBaseURL}/availability?clientId=${clientId}&clientSecret=${clientSecret}&userId=${userId}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`
    };
    const response = await axios(request);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
    console.log(response.data);
    return response.data;
};

module.exports.updateSlackIntegrationForUser = updateSlackIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'slack', data);
};
module.exports.updateGoogleIntegrationForUser = updateGoogleIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'google', data);
};
module.exports.getAvailabilityForUser = getAvailabilityForUser;