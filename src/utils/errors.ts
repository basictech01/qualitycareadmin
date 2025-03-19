export class CustomError extends Error {
    message: string
    code: number

    constructor(message : string, statusCode: number) {
        super(message);
        this.message = message;
        this.code = statusCode;
    }
}

export const ERRORS = {
    // COMMON ERRORS
    SERVER_ERROR: new CustomError('Server error', 10000),
    FORM_NOT_FILLED: new CustomError('Please fill in all fields', 10001),
    LANG_LAT_NOT_NUMBER: new CustomError('Latitude and longitude must be numbers', 10002),
    UNAUTHORIZED: new CustomError('Unauthorized', 10003),
    
    
    // LOGIN ERRORS
    INVALID_EMAIL: new CustomError('Invalid email address', 10002),
    INVALID_CREDENTIALS: new CustomError('Invalid email or password', 10003),

    // MARKETING ERROR
    EN_IMAGE_REQUIRED: new CustomError('English image is required', 10004),
    AR_IMAGE_REQUIRED: new CustomError('Arabic image is required', 10005),
    START_DATE_REQUIRED: new CustomError('Start date is required', 10006),
    END_DATE_REQUIRED: new CustomError('End date is required', 10007),
    LINK_REQUIRED: new CustomError('Link is required', 10008),

}