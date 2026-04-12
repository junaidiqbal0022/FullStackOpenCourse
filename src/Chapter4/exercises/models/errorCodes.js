const ErrorCode = Object.freeze({
    ValidationError: 'ValidationError',
    CastError: 'CastError',
    BulkDeleteNotAllowed: 'BulkDeleteNotAllowed',
    NotFound: 'NotFound',
    IdNotFound: 'IdNotFound',
    InternalServerError: 'InternalServerError',
    DuplicateEntry: 'DuplicateEntry',
    RedirectPurposeful: 'RedirectPurposeful',
})

module.exports = ErrorCode
