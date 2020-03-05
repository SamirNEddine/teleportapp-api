
const ApiStatusCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_ERROR: 500,
};

const APIErrorCodes = {
    NO_ERROR_CODE: 0,
    EXPIRED_ACCESS_CODE: 401.1,
    INVALID_ACCESS_CODE: 400.1,
};

module.exports = class ApiError extends Error{
    constructor(message, status, errorCode=APIErrorCodes.NO_ERROR_CODE){
        super();
        this.message = message;
        this.status = status;
        this.errorCode = errorCode;
        this.extensions = {message, status, errorCode};
    }
    static INTERNAL_SERVER_ERROR(message='Internal Server Error'){
        return new ApiError(message, ApiStatusCodes.INTERNAL_ERROR);
    }
    static UNAUTHORIZED_ERROR(message="Unauthorized request", errorCode){
        return new ApiError(message, ApiStatusCodes.UNAUTHORIZED, errorCode);
    }
    static BAD_REQUEST_ERROR(message="Bad request", errorCode){
        return new ApiError(message, ApiStatusCodes.BAD_REQUEST, errorCode);
    }
    static INVALID_ACCESS_CODE_ERROR(){
        return this.BAD_REQUEST_ERROR("Bad request. Invalid access code!", APIErrorCodes.INVALID_ACCESS_CODE);
    }
    static EXPIRED_ACCESS_CODE_ERROR(){
        return this.UNAUTHORIZED_ERROR("Unauthorized. Expired access code!", APIErrorCodes.EXPIRED_ACCESS_CODE);
    }
};