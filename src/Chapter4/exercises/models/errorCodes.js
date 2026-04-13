const ErrorCode = Object.freeze({
    ValidationError: 'ValidationError',
    CastError: 'CastError',
    BulkDeleteNotAllowed: 'BulkDeleteNotAllowed',
    NotFound: 'NotFound',
    IdNotFound: 'IdNotFound',
    InternalServerError: 'InternalServerError',
    DuplicateEntry: 'DuplicateEntry',
    RedirectPurposeful: 'RedirectPurposeful',
    MongoServerError: 'MongoServerError',
    JsonWebTokenError: 'JsonWebTokenError',
    TypeError: 'TypeError',
    TokenExpiredError: 'TokenExpiredError',
    InvalidToken: 'InvalidToken',
    InsufficientPrivilages: 'InsufficientPrivilages'
})

module.exports = ErrorCode
