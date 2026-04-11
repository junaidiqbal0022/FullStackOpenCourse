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
const unknownEndpoint = (request, response) => {
  response.status(404).send({
    errorCode: 404,
    error:
      'Well Hello there, where are you going?' +
      ' we have nothing to show you! try next door',
  })
}

const errorHandler = (error, request, response) => {
  console.error('hello from error handler', error.name, error.message)

  if (error.name === ErrorCode.CasctError) {
    return response.status(400).send({
      errorCode: ErrorCode.CastError,
      error: error.message ?? 'malformatted id',
    })
  } else if (error.name === ErrorCode.BulkDeleteNotAllowed) {
    return response.status(403).send({
      errorCode: ErrorCode.BulkDeleteNotAllowed,
      error: error.message ?? 'Bulk delete is not allowed',
    })
  } else if (error.name === ErrorCode.ValidationError) {
    return response.status(400).json({
      errorCode: ErrorCode.ValidationError,
      error: 'Validation failed ' + error.message,
    })
  } else if (error.name === ErrorCode.IdNotFound) {
    return response.status(404).json({
      errorCode: ErrorCode.IdNotFound,
      error: error.message ?? 'Id Not Found in Db..',
    })
  } else if (error.name === ErrorCode.NotFound) {
    return response.status(404).json({
      errorCode: ErrorCode.NotFound,
      error: error.message ?? error.message,
    })
  } else if (error.name === ErrorCode.DuplicateEntry) {
    return response.status(409).json({
      errorCode: ErrorCode.DuplicateEntry,
      error: error.message ?? error.message,
    })
  } else if (error.name === ErrorCode.InternalServerError) {
    return response.status(500).json({
      errorCode: ErrorCode.InternalServerError,
      error: error.message ?? error.message,
    })
  } else if (error.name === ErrorCode.RedirectPurposeful) {
    return response.status(302).json({
      errorCode: ErrorCode.RedirectPurposeful,
      error: error.message ?? 'Resource has been moved to another endpoint',
    })
  } else {
    return response.status(500).json({
      errorCode: ErrorCode.InternalServerError,
      error: error.message ?? 'Something went wrong',
    })
  }
}

module.exports = {
  ...ErrorCode,
  unknownEndpoint,
  errorHandler,
}
