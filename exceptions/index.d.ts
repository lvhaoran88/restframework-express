declare class APIException extends Error {
}

declare class HttpMethodNotAllowed extends APIException {

}

declare class AuthenticationFailed extends APIException {
}

declare class PermissionDenied extends APIException {
}

declare class Throttled extends APIException {
}

declare class NotImplementedError extends Error {
}

declare class ImproperlyConfigured extends Error {
}

module.exports = {
    APIException,
    HttpMethodNotAllowed,
    AuthenticationFailed,
    PermissionDenied,
    NotImplementedError,
    ImproperlyConfigured
}
