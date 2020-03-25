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
    console.log(response.data);
    if(response.status !== 200){
        throw ApiError.INTERNAL_SERVER_ERROR();
    }
};
const updateSlackIntegrationForUser = async function (userId, data) {
    await updateIntegrationForUser(userId, 'slack', data);
};

module.exports.updateSlackIntegrationForUser = updateSlackIntegrationForUser;