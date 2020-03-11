const {google} = require('googleapis');
const Availability = require('../model/Availability');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://tlprt.io/google/auth'
);

const getCalendarEventsUpdatesWithToken = async function(calendar, syncToken){
    console.debug("Calendar updates with time syncToken");
    const response = await calendar.events.list({
        calendarId: 'primary',
        syncToken
    });
    return response.data;
};
const getCalendarEventsUpdatesWithISODates = async function(calendar, timeMin, timeMax){
    console.debug("Calendar updates with time frame");
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMax,
        timeMin
    });
    return response.data;
};
const getCalendarEventsUpdates = async function (mongooseUser, timeFrameInHours) {
    const integrationData = mongooseUser.getIntegrationData('google');
    oauth2Client.setCredentials(integrationData);
    const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client
    });
    let calendarUpdates = null;
    if (parseInt(integrationData.timeFrameInHours) !== parseInt(timeFrameInHours) || (new Date().getTime() - new Date(integrationData.lastFullSyncDate).getTime())/1000 > timeFrameInHours*60*60){
        const timeMin = new Date();
        const timeMax = new Date(timeMin.getTime() + timeFrameInHours*60*60*1000);
        calendarUpdates = await getCalendarEventsUpdatesWithISODates(calendar, timeMin.toISOString(), timeMax.toISOString());
        integrationData.timeFrameInHours = timeFrameInHours;
        integrationData.lastFullSyncDate = timeMin;
    }else{
        calendarUpdates = await getCalendarEventsUpdatesWithToken(calendar, integrationData.syncToken);
    }
    const {nextSyncToken} = calendarUpdates;
    if(nextSyncToken !== integrationData.syncToken){
        integrationData.syncToken = nextSyncToken;
        mongooseUser.setIntegrationData('google', integrationData);
        await mongooseUser.save();
    }
    return calendarUpdates.items;
};

//Exports
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

module.exports.performCalendarSync = async function (mongooseUser, timeFrameInHours) {
    const calendarUpdates = await getCalendarEventsUpdates(mongooseUser, timeFrameInHours);
    console.debug(calendarUpdates);
    const updates = [];
    for(let i=0; i<calendarUpdates.length; i++){
        const update = calendarUpdates[i];
        if(update.status === 'cancelled'){
            updates.push({
                deleteOne: {
                    filter: {externalIdentifier: update.id}
                }
            });
        }else{
            updates.push({
                updateOne: {
                    filter: {externalIdentifier: update.id},
                    update: {
                        externalIdentifier: update.id,
                        externalDescription: update.summary,
                        userId: mongooseUser.id,
                        startDateTime: new Date(update.start.dateTime),
                        endDateTime: new Date(update.end.dateTime),
                    },
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            });
        }
    }

    if(updates.length){
        await Availability.bulkWrite(updates);
    }
};