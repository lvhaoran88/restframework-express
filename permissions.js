/*@File     :   permissions.js
* @Time     :   2020/11/12 9:41 上午
* @Author   :   Lv HaoRan
* @Email    :   905097829@qq.com
* @Software :   GoLand
* @Desc     :
*/


class BasePermission {
    /**
     * 校验本次请求有没有权限
     * @param req {Request}
     * @returns {boolean}
     */
    hasPermission(req) {
        // 如果权限允许，return true
        // 如果不允许 抛出异常 throw new PermissionDenied("权限校验失败的信息")
        return true
    }
}

module.exports.BasePermission = BasePermission
