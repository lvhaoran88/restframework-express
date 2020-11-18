const {NotImplementedError} = require("../exceptions");

class BaseAuthentication {
    /**
     * 认证方法
     * @param req {Request} express.Request
     */
    authenticate(req) {
        /**
         * Authenticate方法 返回两个值得元组(数组)
         * return [user, token]
         */
        // throw new Error(".authenticate() 方法必须被重写")
        // return ["user", "token"]
        throw new NotImplementedError(`${this.constructor.name}.hasPermission()方法必须被重写`)
    }
}

module.exports = {
    BaseAuthentication
}