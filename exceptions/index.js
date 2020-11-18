class APIException extends Error {
}

/**
 *  APIView 相关的错误
 * */

class HttpMethodNotAllowed extends APIException {
}

/**
 * 用户认证相关的错误
 *
 */

// 用户验证失败
class AuthenticationFailed extends APIException {
}

// 权限校验失败
class PermissionDenied extends APIException {
}

// 频率限制异常
class Throttled extends APIException {
    constructor(msg, ...args) {
        super();
        this.message = `需要等待 ${msg} 秒才能访问`
    }
}

// 方法必须要实现
class NotImplementedError extends Error {
}

// 配置信息错误
class ImproperlyConfigured extends Error {
}

/**
 * 用户权限相关的错误
 *
 * */

module.exports = {
    APIException,
    HttpMethodNotAllowed,
    AuthenticationFailed,
    PermissionDenied,
    NotImplementedError,
    ImproperlyConfigured,
    Throttled
}