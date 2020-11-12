/*@File     :   authentication.js
* @Time     :   2020/11/11 3:14 下午
* @Author   :   Lv HaoRan
* @Email    :   905097829@qq.com
* @Software :   GoLand
* @Desc     :
*/


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
        throw new Error(".authenticate() 方法必须被重写")
        // return [user, token]
    }

    /**
     *
     * @param req {Request}
     */
    authenticate_header(req) {

    }
}

module.exports = {
    BaseAuthentication
}