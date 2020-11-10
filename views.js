/*@File     :   views.js
* @Time     :   2020/11/10 5:38 下午
* @Author   :   Lv HaoRan
* @Email    :   905097829@qq.com
* @Software :   GoLand
* @Desc     :
*/

class APIView {
    httpMethodAllowed = ["get", "post", "put", "patch", 'delete', "head", "options", "trace"]

    httpRequestNotAllowed(req, res, next) {
        throw new Error(`'${req.method}'方法不被允许`)
    }

    handler_exception(err) {
        return err.message
    }

    dispatch(req, res, next) {
        let requestMethod = req.method.toLowerCase()
        let response = null
        try {
            this.initial(req)
            let handler = null
            if (this.httpMethodAllowed.indexOf(requestMethod) > -1 &&
                Reflect.has(this, requestMethod)
            ) {
                handler = Reflect.get(this, requestMethod)
            } else {
                handler = this.httpRequestNotAllowed(req, res, next)
            }
            response = handler(req, res, next)
        } catch (e) {
            response = this.handler_exception(e)
        }
        return response
    }


    initial(req) {
        // auth
    }

    static asView() {
        let self = new this()

        function view(req, res, next) {
            return self.dispatch(req, res, next)
        }

        // view 返回后需要进行CSRF 豁免
        return view
    }
}

export {APIView}