const {NotImplementedError} = require("../exceptions");

class BasePermission {
    /**
     * 校验本次请求有没有权限
     * @param req {Request}
     * @returns {boolean}
     */
    hasPermission(req) {
        // 如果权限允许，return true
        // 如果不允许 抛出异常 throw new PermissionDenied("权限校验失败的信息")
        throw new NotImplementedError(`${this.constructor.name}.hasPermission()方法必须被重写`)
    }
}

module.exports = {
    BasePermission
}