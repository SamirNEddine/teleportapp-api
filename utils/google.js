const {google} = require('googleapis');

module.exports.authorizeCalendarAccess = async function (code, codeVerifier, clientId, redirectURI) {
    const oauth2Client = new google.auth.OAuth2();
    const {tokens} = await oauth2Client.getToken({
        code,
        codeVerifier,
        client_id: clientId,
        redirect_uri: redirectURI
    });
    return tokens;
};

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//
// const oauth2Client = new google.auth.OAuth2(
//     clientId,
//     clientSecret,
//     'https://tlprt.io/google/auth'
// );
//
// //Exports
// module.exports.generateCalendarAccessAuthURL = function(){
//     const scope = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'];
//     return oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope
//     });
// };
// module.exports.authorizeCalendarAccess = async function (code) {
//     const {tokens} = await oauth2Client.getToken(code);
//     return tokens;
// };
