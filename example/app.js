const {BasePermission} = require("../permissions")

let express = require("express")
const {BaseAuthentication} = require("../authentications");
const {AuthenticationFailed, PermissionDenied} = require("../exceptions");

const {SimpleRateThrottle} = require("../throttling")
let app = express()
app.use(express.json())
let router = express.Router()
let {APIView} = require("../views")


class MyAuthentication extends BaseAuthentication {
    authenticate(req) {
        let username = req.body.username
        if (username) {
            // select * from user where username = username
            // user = select * from user where username = username
            let user = username
            return [user, null]
        }
        throw AuthenticationFailed("认证失败")
    }
}

class MyPermission extends BasePermission {
    hasPermission(req) {
        // 我们在用户认证中 给request 添加一个 user属性， 这个属性是从数据库重查询出来的，如果你使用orm查询 你可以直接使用 user的链式操作
        let user = req.user  // type: Array
        //role = user.roles
        let role = {
            "admin": ["admin", "menus"],
            "custom": ["menus"]
        }

        let needRole = ["admin", "menus"]

        let userRole = role[user] || []
        console.log(userRole)
        needRole.map(r => {
            if (userRole.indexOf(r) === -1) {
                throw new PermissionDenied("权限认证失败")
            }
        })
        return true
    }
}

// 全局的 restful 配置
const api_settings = require("../settings")  // type: Object
// 设置 scope = "test" 的 rate = '3/m'  每分钟限制3次访问
api_settings.DEFAULT_THROTTLE_RATES = {
    test: '3/m'
}

class MyRateThrottle extends SimpleRateThrottle {

    // 给当前自对应的频率组件给个标志
    scope = "test"
    // 局部的配置 替换全局的配置的 scope 对应的 rate
    // THROTTLE_RATES = {
    //   test: '3/m'
    //}
    getCacheKey(req, view) {
        return this.cacheFormat(this.scope, this.getIdent(req))
    }
}

class MyAPIView extends APIView {
    // permissionClasses = [MyPermission]
    // authenticationClasses = [MyAuthentication]
    throttleClasses = [MyRateThrottle]

    get(req, res, next) {
        console.log(req.connection.remoteAddress)
        console.log(req.ip)
        return res.json({hello: "restful"})
    }
}

router.all("/", MyAPIView.asView())


app.use("/", router)

app.listen("3000", "0.0.0.0")