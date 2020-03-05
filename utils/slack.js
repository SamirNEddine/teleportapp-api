const axios = require('axios');
const ApiError = require('./apiError');

const slackAPIBaseURL = process.env.SLACK_API_BASE_URL;
const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

module.exports.signInWithSlack = async function (code) {
    const request = {
        method: "GET",
        url: `${slackAPIBaseURL}/oauth.access?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`

    };
    const response = await axios(request);
    if(!response.data.ok){
        throw ApiError.INVALID_ACCESS_CODE_ERROR();
    }
    return response.data;
};

module.exports.fetchUserInfoFromSlack = async function(integrationData) {
    const request = {
        method: "GET",
        url: `${slackAPIBaseURL}/users.profile.get?token=${integrationData.access_token}`
    };
    const response = await axios(request);
    if(!response.data.ok){
        throw ApiError.INTERNAL_SERVER_ERROR(`Internal server error: ${response.data.error}`);
    }
    const {first_name, last_name, email, phone} = response.data.profile;
    return {firstName: first_name, lastName: last_name, emailAddress: email, phoneNumber: phone};
};