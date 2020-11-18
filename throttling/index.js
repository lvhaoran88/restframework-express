const {NotImplementedError, ImproperlyConfigured} = require("../exceptions");

const defaultCache = {
    get(key, defaultValue) {
        return this[key] || defaultValue
    },
    set(key, value) {
        this[key] = value
    }
}


const api_settings = require("../settings")


class BaseThrottle {

    /**
     * 允许当次请求
     * @param req
     * @param view
     */
    allowRequest(req, view) {
        throw new NotImplementedError(`${this.constructor.name}.allowRequest()方法必须被重写`)
    }

    /**
     * 获取请求标识
     * @param req {Request}
     */
    getIdent(req) {
        return req.ip
    }

    wait() {
        return null
    }
}

class SimpleRateThrottle extends BaseThrottle {
    cache = defaultCache
    scope = null
    THROTTLE_RATES = api_settings.DEFAULT_THROTTLE_RATES


    cacheFormat(scope, ident) {
        return `throttle-${scope}-${ident}`
    }

    getCacheKey(req, view) {
        throw new NotImplementedError(`.get_cache_key() 必须被重写`)
    }

    init() {
        if (!Reflect.has(this, "rate")) {
            this.rate = this.getRate()
        }
        this.numRequests = this.parseRate(this.rate)[0]
        this.duration = this.parseRate(this.rate)[1]
    }

    getRate() {
        if (Reflect.has(this, "scope") === null) {
            let msg = `你必须为当前的throttle类${this.constructor.name}的'.scope' 或者 '.rate'属性设置必要的值`
            throw new ImproperlyConfigured(msg)
        }

        if (this.THROTTLE_RATES[this.scope] === undefined) {
            throw new ImproperlyConfigured(
                `没有给throttle的rate设置默认的${this.scope}scope`
            )
        }
        return this.THROTTLE_RATES[this.scope]
    }

    parseRate(rate) {
        if (!rate) {
            return [null, null]
        }
        let [num, period] = rate.split("/")
        let num_requests = Number(num)
        let duration = {
            s: 1, m: 60, h: 3600, d: 86400
        }[period[0]]
        return [num_requests, duration]
    }

    allowRequest(req, view) {
        this.init()
        if (this.rate == null || undefined) {
            return true
        }
        this.key = this.getCacheKey(req, view)
        if (this.key === null | undefined) {
            return true
        }

        this.history = this.cache.get(this.key, [])
        this.now = new Date().getTime() / 1000
        // 有访问记录， 访问记录的最后一个（最早的请求）大于当前设置的时间间隔 将这个值删除
        while (this.history && this.history[-1] <= this.now - this.duration) {
            this.history.pop()
        }

        // 如果历史访问记录大于当前设置的次数 返回频率限制
        if (this.history.length >= this.numRequests) {
            return this.throttleFailure()
        }

        // 通行
        return this.throttleSuccess()
    }

    throttleFailure() {
        return false
    }

    throttleSuccess() {
        // 通行并记录一条访问记录
        this.history.unshift(this.now)
        // 缓存中设置 就键值， 历史记录， 过期时间
        this.cache.set(this.key, this.history, this.duration)
        return true
    }

    wait() {
        let remainingDuration

        if (this.history.length > 0) {

            remainingDuration = this.duration - (this.now - this.history.slice(-1)[0])
        } else {
            remainingDuration = this.duration
        }

        // 校验 缓存的长度 与 定义的长度是否相等
        let availableRequests = this.numRequests - this.history.length + 1
        if (availableRequests <= 0) {
            return null
        }
        return remainingDuration / Number(availableRequests)
    }
}

class B extends SimpleRateThrottle {
    scope = "test"

}

let b = new B()


module.exports = {
    BaseThrottle,
    SimpleRateThrottle
}