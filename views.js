/*@File     :   views.js
* @Time     :   2020/11/10 5:38 下午
* @Author   :   Lv HaoRan
* @Email    :   905097829@qq.com
* @Software :   GoLand
* @Desc     :
*/

let APIException = require('./exceptions')
let Permissions = require("./permissions").Permissions

class APIView {
    httpMethodNames = ["get", "post", "put", "patch", 'delete', "head", "options", "trace"]

    /**
     * 不允许的请求方法，当前视图中没有定义的方法，返回这个错误
     * @param req {Request} express的请求对象
     * @param res {Response} express的相应对象
     * @param next {NextFunction} 可选参数 express的上下文
     */
    httpRequestNotAllowed(req, res, next) {
        throw new Error(`'${req.method}'方法不被允许`)
    }

    permissionClasses = []
    authenticationClasses = []

    /**
     * 处理异常的函数
     * @param exc {Error} Error或者他的子类
     * @param res {Response} express的Response对象
     * @returns {string} 返回Error的错误信息
     */
    handlerException(exc, res) {
        return res.send({detial: exc.message})
    }

    /**
     * 视图类的静态方法
     * @returns {function(Request, Response, NextFunction): *}
     */
    static asView() {
        let self = new this()

        function view(req, res, next) {
            return self.dispatch(req, res, next)
        }

        // view 返回后需要进行CSRF 豁免
        return view
    }

    /**
     * 获取当前视图有哪些请求方法
     * @returns {string[]}
     */
    get allowedMethods() {
        return this._allowedMethods
    }

    /**
     * 获取当前视图有哪些请求方法
     * @returns {string[]}
     * @private
     */
    get _allowedMethods() {
        return this.httpMethodNames.filter(m => {
            if (Reflect.has(this, m)) {
                return m
            }
        })
    }

    // 认证类实例化
    get authenticators() {
        return this.authenticationClasses.map(authenticator => {
            return new authenticator()
        })
    }

    /**
     * 重置认证
     * @param req {Request}
     * @param userAuthTuple {any[]}
     * @private
     */
    _notAuthenticated(req, userAuthTuple = [null, null]) {
        Reflect.set(req, "user", userAuthTuple[0])
        Reflect.set(req, "auth", userAuthTuple[1])
    }

    // 认证类进行认证
    performAuthentication(req) {

        for (let authenticator of this.authenticators) {

            try {
                let userAuthTuple = authenticator.authenticate(req) || null

                if (userAuthTuple !== null) {
                    this._notAuthenticated(req, userAuthTuple)
                    return
                }
            } catch (e) {
                // 判断e的类型是不是自己定义的异常
                if (e instanceof APIException) {
                    this._notAuthenticated(req)
                } else {
                    console.log(e)
                }
                throw e
            }
        }
        this._notAuthenticated(req)
    }


    /**
     * 生成权限对象
     * @returns {Permissions[]}
     */
    getPermissions() {
        return this.permissionClasses.map(p => {
            return new p()
        })
    }


    /**
     * 权限校验
     * @param req
     */
    checkPermissions(req) {
        for (let permission of this.getPermissions()) {
            permission.hasPermission(req)
        }
    }

    /**
     * 频率校验
     * @param req
     */
    checkThrottles(req) {

    }

    /**
     * 初始化请求
     * @param req {Request}
     * @param initkwargs {Object}
     */
    initial(req, initkwargs=null) {
        this.performAuthentication(req)
        this.checkPermissions(req)
        this.checkThrottles(req)
    }


    /**
     * 请求分发
     * @param req {Request} express的请求对象
     * @param res {Response} express的相应对象
     * @param next {NextFunction} 可选参数 express的上下文
     * @returns {*} 返回响应结果
     */
    dispatch(req, res, next) {
        let requestMethod = req.method.toLowerCase()

        let response
        try {
            // 处理请求
            this.initial(req)

            // 做反射
            let handler
            if (this.httpMethodNames.indexOf(requestMethod) > -1 &&
                Reflect.has(this, requestMethod)
            ) {
                handler = Reflect.get(this, requestMethod)
            } else {
                handler = this.httpRequestNotAllowed(req, res, next)
            }
            response = handler(req, res, next)
        } catch (e) {
            // 错误响应
            response = this.handlerException(e, res)
        }
        // 返回响应
        return response
    }
}

module.exports = APIView