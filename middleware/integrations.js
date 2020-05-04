const {hasCalendarIntegrationEnabled} = require('../helpers/contextService');
const ApiError = require('../utils/apiError');

module.exports.integrationsCheck = async function (req, rest, next) {
    if((!req.header('ByPassIntegrationCheck') || req.header('ByPassIntegrationCheck') === 'false') && !req.body.query.includes('addGoogleCalendarIntegration')){
        if(!req.error && req.jwtUser){
            try{
                if(! await hasCalendarIntegrationEnabled(req.jwtUser.id)){
                    req.error = ApiError.MISSING_CALENDAR_INTEGRATION();
                }
            }catch(e){
                req.error = ApiError.MISSING_CALENDAR_INTEGRATION();
            }
        }
    }
    next();
};