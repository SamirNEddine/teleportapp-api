const {google} = require('googleapis');
const User = require('../model/User');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://tlprt.io/google/auth'
);
module.exports.generateCalendarAccessAuthURL = function(){
    const scope = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'];
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope
    });
};
module.exports.authorizeCalendarAccess = async function (code) {
    const {tokens} = await oauth2Client.getToken(code);
    return tokens;
};
module.exports.createCalendarEvent = async function (credentials) {
    oauth2Client.setCredentials(credentials);
    const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client
    });

    const start = new Date();
    const end = new Date(start.getTime() + 6*60*60*1000);
    const {data} = await calendar.freebusy.query({requestBody:{
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            items: [{id:'primary'}]
        }
    });

    console.log(data.calendars.primary.busy);
};

module.exports.getCalendarEventsUpdates = async function (userId, integrationData, localTodayDate, localTodayZeroHoursUTC, localToday24HoursUTC) {
    oauth2Client.setCredentials(integrationData);
    const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client
    });
    console.log(localTodayZeroHoursUTC.toISOString(), localToday24HoursUTC.toISOString());
    let syncToken = integrationData.syncToken;
    let syncDate = integrationData.syncDate;
    let data = null;
    if(!syncToken || new Date(syncDate).getTime() !== localTodayDate.getTime()){
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMax: localToday24HoursUTC.toISOString(),
            timeMin: localTodayZeroHoursUTC.toISOString()
        });
        data = response.data;

        syncDate = localTodayDate;
        syncToken = data.nextSyncToken;
    }else{
        const response = await calendar.events.list({
            calendarId: 'primary',
            syncToken: syncToken
        });
        data = response.data;
        syncToken = data.nextSyncToken;
        console.log(data);
    }

    if(syncToken !== integrationData.syncToken){
        integrationData.syncToken = syncToken;
        integrationData.syncDate = syncDate;
        const user = await User.findById(userId);
        user.setIntegrationData('google', integrationData);
        await user.save();
    }
};