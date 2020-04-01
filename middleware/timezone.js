const {DateTime} = require("luxon");
const ApiError = require('../utils/apiError');
const {updateUserIANATimezoneIfNeeded} = require('../utils/timezone');

module.exports.httpTimezoneCheck = async function (req, rest, next) {
    if(!req.error){
        const IANATimezone = req.header('IANATimezone');
        const testDate = DateTime.local().setZone(IANATimezone);
        if(IANATimezone && testDate.isValid){
            if(req.jwtUser) {
                //auth endpoints
                try{
                    await updateUserIANATimezoneIfNeeded(req.jwtUser.id, IANATimezone);
                    req.IANATimezone = IANATimezone;
                }catch(error){
                    console.error(error);
                    req.error = ApiError.INTERNAL_SERVER_ERROR(error.message);
                }
            }else {
                //Non auth endpoints
                req.IANATimezone = IANATimezone;
            }
        }else{
            req.error = ApiError.BAD_REQUEST_ERROR('Bad request: Missing or invalid IANATimezone header');
            console.error(req.error);
        }
    }
    next();
};