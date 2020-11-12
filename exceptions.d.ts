delete class APIException extends Error {
    constructor(msg: string): void
}


declare class AuthenticationError extends APIException {
}

declare class PermissionDenied extends APIException {
}

module.exports = APIException
module.exports.AuthenticationError = AuthenticationError
module.exports.PermissionDenied = PermissionDenied
