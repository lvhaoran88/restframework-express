/*@File     :   exceptions.js
* @Time     :   2020/11/12 11:17 上午
* @Author   :   Lv HaoRan
* @Email    :   905097829@qq.com
* @Software :   GoLand
* @Desc     :
*/

class APIException extends Error {
    constructor(msg) {
        super();
        this.msg = msg
    }
}


class AuthenticationError extends APIException {
}

class PermissionDenied extends APIException {
}

module.exports = APIException
module.exports.AuthenticationError = AuthenticationError
module.exports.PermissionDenied = PermissionDenied

