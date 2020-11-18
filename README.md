## restframework-express

**restframework-express**是基于`nodejs`后端服务框架`express`用于构建Web API的一个强大且十分灵活的express工具包插件



**我能做什么：**

+ 已写好`声明文件`，在各大编辑器中语法提示完美支持

+ router集中管理
+ ES6之后，引入了`class` 关键字来创建类。因此我们使用CBV模式来开发接口，让业务更易于查找、维护
+ 全局/局部的用户(auth)认证
+ 全局/局部的权限(permision)认证
+ 全局/局部的访问频率限制
+ ORM及非ORM数据源序列化、反序列化
+ 在线可视的API
+ 异常处理



### 1. 快速使用

+ 需求条件
  + nodejs
  + express 4.x+

+ 安装

```shell
npm i restframework-express
```

+ 你可以在[这里](https://github.com/lvhaoran88/restframework-express/blob/master/example/app.js)观看当前支持的示例



### 2.视图 

####  2.1 APIView的使用

`views.js`

```javascript
const express = require("express")
const {APIView} = require("restframework-express/views")  // 导入APIView组件

let app = express()
app.use(express.json())

// 创建自定义视图类，继承 APIView
class MyAPIView extends APIView {
    
  	// http get请求方法
    get(req, res, next) {
        return res.json({hello: "restful"})
    }
  	
  
  	// http post请求方法
  	post(req, res){
        data = req.body
      return res.json({msg: "post - success"})
    }
  	
  	// // http put请求方法
  	put(req, res){
        date = req.body
      	return res.json({msg: "put - success"})
    }
  	
  
  	// http patch请求方法
  	patch(req, res){
        data = req.body
      	return res.json(msg: "patch - sucess")
    }
  
  	// http delete请求方法
  	delete(req, res){
        data = req.body
      	return res.json(msg: "delete - sucess")
    }
}

// 注册路由、视图  调用.asView()方法
app.all("/test/", MyAPIView.asView())

// 监听 3000端口 开启服务
app.listen("3000", "0.0.0.0")
```





### 3. auth认证

#### 3.1 使用自定义认证

```javascript
const {APIView} = require('restframework-express/views')
cosnt {BaseAuthentication} = require("restframework-express/authentications")
const {AuthenticationFailed} = = require("restframework-express/exceptions")
// 1.自定义auth认证类继承BaseAuthentication
class MyAuth extends BaseAuthentication {
    // 2.需要重写 authenticate方法
    authenticate(req) {
      	// 加入 可以再当次请求中获取你自定义的数据 username值
        if (req.body.username) {
          // 3.认证通过 你需要返回一个数组(ts中为元组) 第一个值给 user 第二个值给auth
          // 或者是你在使用 数据库ORM等 返回一个可以表示用户信息的对象给user的位置
            return [req.body.username, null]
        } else {
          	// 4.如果认证不错通过，你需要抛出AuthenticationFailed异常
            throw new AuthenticationFailed("认证失败")
        }
    }
}

// 5.在视图中使用认证类
class MyAPIView extends APIView {
		// 6.在视图类中 制定 authentication_classes给一个数组(ts中为元组)，内容是上面我们自定义的认证类
    authenticationClasses = [MyAuth]

		post(req, res) {
      	console.log(req.user)  // 7.认证通过这里你会拿到当前定义的用户对象
      	console.log(req.auth)  // 7.这是一个auth 也是你在你自定义的认证类中返回的
        return res.json({code: 0, msg: "success", data: {hello: "world，auth认证通过"}})
    }
}

app.all("/auth/", MyAPIView.asView())
```



### 4.权限认证组件

#### 4.1 自定义权限认证组件

**建议权限组件配合auth认证组件使用**当然你也可以不用

```javascript
const {APIView} = require('restframework-express/views')
const {AuthenticationFailed, PermissionDenied} = = require("restframework-express/exceptions")
cosnt {BaseAuthentication} = require("restframework-express/authentications")
const {BasePermission} = = require("restframework-express/permissions")

// 1.自定义auth认证类继承BaseAuthentication
class MyAuth extends BaseAuthentication {
    // 2.需要重写 authenticate方法
    authenticate(req) {
      	// 加入 可以再当次请求中获取你自定义的数据 username值
        if (req.body.username) {
          // 3.认证通过 你需要返回一个数组(ts中为元组) 第一个值给 user 第二个值给auth
          // 或者是你在使用 数据库ORM等 返回一个可以表示用户信息的对象给user的位置
            return [req.body.username, null]
        } else {
          	// 4.如果认证不错通过，你需要抛出AuthenticationFailed异常
            throw new AuthenticationFailed("认证失败")
        }
    }
}


// 自定义的 权限组件
class MyPermission extends BasePermission {
  	hasPermission(req){
    // 我们在用户认证中 给request 添加一个 user属性， 这个属性是从数据库重查询出来的，如果你使用orm查询 你可以直接使用 user的链式操作
        let user = req.user  // type: Array
        //role = user.roles
        /**
        * 以下模拟 用户角色
        */
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
      	
        // 认证通过 你需要返回一个 true
        return true
  	}
}

// 5.在视图中使用认证类
class MyAPIView extends APIView {
    authenticationClasses = [MyAuth]  // 这是个数组 你可以给多个自定义的认证类
		permissionClasses = [MyPermission]  // 同上

		post(req, res) {
      	// TODO: 你自己的逻辑
        return res.json({code: 0, msg: "success", data: {hello: "world，auth、perimission认证通过"}})
    }
}

app.all("/auth_permission/", MyAPIView.asView())
```



### 访问频率限制组件

#### 4.1 自定义频率限制的组件

+ 频率支持格式

  ```javascript
  rate = '4/s'  // 每秒内最多可以访问4次
  rate = '10/m'  // 每分钟内最多可以访问10次
  rate = '20/h'  // 每小时内最多可以访问20次
  rate = '4000/m'  // 每天内最多可以访问4000次
  ```

##### 4.1.1 局部配置频率

```javascript
const {APIView} = require('restframework-express/views')

const {SimpleRateThrottle} = require('restframework-express/throttling')
class MyRateThrottle extends SimpleRateThrottle {
    // 给当前自定义的频率组件给个标志
  	// 比如这个限制是给登陆功能使用的
    scope = "login"
    // 给scope设置个频率， 登陆频率每分钟不能超过5次
    THROTTLE_RATES = {
       login: '5/m'
    }
		
		// 重写  getCacheKey方法
    getCacheKey(req, view) {
      	// 返回一个字符串
      	// 当前你可以根据 req.user 用户身份来标识
				id = this.getIdent(req)  // 用于登陆还没有用户信息所以这里主机ip来作为身份标识的
        return this.cacheFormat(this.scope, id)
    }
}

// 5.在视图中使用认证类
class MyAPIView extends APIView {
  	// 配置频现组件
    throttleClasses = [MyRateThrottle]

		post(req, res) {
      	// TODO: 你自己的逻辑
        return res.json({code: 0, msg: "success", data: {hello: "throttle认证通过"}})
    }
}

app.all("/throttle/", MyAPIView.asView())
```



##### 4.1.2 全局配置频率

```javascript
// 全局的 restful 配置
const api_settings = require("restframework-express/settings")  // type: Object
// 设置 scope = "test" 的 rate = '3/m'  每分钟限制3次访问
api_settings.DEFAULT_THROTTLE_RATES = {
    login: '5/m'
}

const {SimpleRateThrottle} = require('restframework-express/throttling')
// 这样你就不用在自定义组件中单个配置  THROTTLE_RATES字段
class MyRateThrottle extends SimpleRateThrottle {
    scope = "login"
		// 重写  getCacheKey方法
    getCacheKey(req, view) {
				id = this.getIdent(req)
        return this.cacheFormat(this.scope, id)
    }
}
```



##### 4.1.3 全局配置频率组件



感谢你的[star, 点这里](https://github.com/lvhaoran88/restframework-express)

<span style="color:#2db7f5; font-size:24px">功能持续更新中...</span>

<span>敬请期待！</span> 

联系我[https://github.com/lvhaoran88/restframework-express](https://github.com/lvhaoran88/restframework-express)

E-mail: 905097829@qq.com 、 lvhaoran@88.com

> 感谢[django-rest-framework](https://www.django-rest-framework.org/)

