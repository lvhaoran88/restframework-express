// import {NextFunction, Request, Response} from "express";
const {APIException, Throttled} = require("../exceptions");
const HttpMethodNotAllowed = require("../exceptions/index").HttpMethodNotAllowed

class APIView {
    httpMethodNames = ["get", "post", "put", "patch", 'delete', "head", "options", "trace"]

    // 权限认证列表
    permissionClasses = []
    authenticationClasses = []
    throttleClasses = []

    /**
     * 不允许的请求方法
     * @param req {Request}
     * @param res {Response}
     * @param next {NextFunction}
     */
    httpRequestNotAllowed(req, res, next) {
        throw new HttpMethodNotAllowed(`'${req.method}'方法不被允许`)
    }


    /**
     * 发生错误的请求
     * @param exc {Error | APIException}
     * @param res {Response}
     * @returns {*}
     */
    handlerException(exc, res) {
        if (exc instanceof APIException) {
            return res.send({detail: exc.message})
        }
        throw exc
    }


    getAuthenticators() {
        return this.authenticationClasses.map(m => {
            return new m()
        })
    }

    /**
     *
     * @param req {Request}
     * @private
     */
    _notAuthenticated(req) {
        Reflect.set(req, "user", null)
        Reflect.set(req, "auth", null)
    }


    /**
     * 用户认证
     * @param req {Request}
     */
    performAuthentication(req) {
        for (let authenticator of this.getAuthenticators()) {
            let userAuthTuple;
            try {
                userAuthTuple = authenticator.authenticate(req) || null
            } catch (e) {
                if (e instanceof APIException) {
                    this._notAuthenticated(req)
                }
                throw e
            }
            if (userAuthTuple !== null) {
                Reflect.set(req, "user", userAuthTuple[0] || null)
                Reflect.set(req, "auth", userAuthTuple[1] || null)
                return
            }
        }
        this._notAuthenticated(req)
    }

    getPermissions() {
        return this.permissionClasses.map(p => {
            return new p()
        })
    }

    /**
     * 校验用户权限
     * @param req
     */
    checkPermissions(req) {
        for (let permission of this.getPermissions()) {
            permission.hasPermission(req)
        }
    }

    /**
     * 获取当前视图定义的频限组件
     * @returns {*[]}
     */
    getThrottles() {
        return this.throttleClasses.map(t => {
            return new t()
        })
    }

    /**
     * 频率限制异常
     * @param req
     * @param wait
     */
    throttled(req, wait) {
        throw new Throttled(wait)
    }

    /**
     * 请求频率限制验证
     * @param req {Request}
     */
    checkThrottles(req) {
        let throttleDurations = []

        for (let throttle of this.getThrottles()) {
            if (!throttle.allowRequest(req, this)) {
                throttleDurations.push(throttle.wait())
            }
        }
        if (throttleDurations.length > 0) {
            let durations = throttleDurations.filter(d => {
                if (d !== null) {
                    return d
                }
            })
            let duration = Math.floor(Math.max(...durations) * 100) / 100
            this.throttled(req, duration)
        }
    }


    /**
     * 初始化请求
     * @param req {Request}
     */
    initial(req) {
        this.performAuthentication(req)
        this.checkPermissions(req)
        this.checkThrottles(req)
    }


    /**
     * 请求分发
     * @param req {Request}
     * @param res {Response}
     * @param next {NextFunction}
     * @returns {*}
     */
    dispatch(req, res, next) {
        let httpMethod = req.method.toLocaleLowerCase();
        let response;
        try {
            this.initial(req)

            let handle;
            if (this.httpMethodNames.indexOf(httpMethod) > -1 &&
                Reflect.has(this, httpMethod)) {
                handle = Reflect.get(this, httpMethod)
            } else {
                handle = this.httpRequestNotAllowed(req, res, next)
            }
            response = handle(req, res, next)
        } catch (exc) {
            response = this.handlerException(exc, res)
        }
        return response
    }

    /**
     * 视图方入口函数
     * @returns {function(*=, *=, *=): *}
     */
    static asView() {
        let self = new this()

        function view(req, res, next) {
            return self.dispatch(req, res, next)
        }

        return view
    }
}

module.exports = {
    APIView
}
