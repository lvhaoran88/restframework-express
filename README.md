## restframework-express

<span style="color:#2db7f5; font-size:24px">功能持续更新中...</span>

<span>敬请期待！</span>



**[找到我github](https://github.com/lvhaoran88/restframework-express)**

> 感谢[django-restframework](https://www.django-rest-framework.org/)

### 1. 快速使用

+ 安装

```shell
npm i restframework-express
```



### 2.视图 

#### 1. APIView的使用

+ 创建一个app

  ```shell
  .mysite
  ├── view.js
  └── urls.js
  ```

  

+ `mysite/view.js`

  ```js
  let APIView = require('restframework-express/views')
  
  class Userinfo extends APIView {
      get(req, res) {
          return res.json({code: 0, msg: "success", data: {hello: "world"}})
      }
  
      post(req, res, next) {
          console.log(res.json)
          return res.json({code: 0, msg: "success", data: {username: "admin"}})
      }
  }
  
  module.exports = Userinfo;
  ```

+ `mysite/urls.js`

  ```js
  let express = require('express');
  let router = express.Router();
  let UserInfo = require('./view.js')
  
  // 在路由中注册
  router.all("/test/", Userinfo.asView())
  
  module.exports = router;
  ```



### 3. 三大认证

#### 3.1 auth认证

```js
let APIView = require('restframework-express/views')
let Authen = require("restframework-express/authentication")

class MyError extends Error {}

// 1.自定义认证类 Authen.BaseAuthentication
class MyAuth extends Authen.BaseAuthentication {
  
  // 2.需要重写 authenticate
  authenticate(req) {
        if (req.body.username) {
          // 3.认证通过 你需要返回一个数组(ts中为元组) 第一个值给 user 第二个值给token
            return [req.body.username, null]
        } else {
          	// 4.如果认证不错通过，你必须抛出 AuthenticationError异常
            throw new Authen.AuthenticationError("认证失败")
        }
    }
}


// 5.在视图中使用认证类
class Userinfo extends APIView {
		// 6.在视图类中 制定 authentication_classes给一个数组(ts中为元组)，内容是上面我们自定义的认证类
    authentication_classes = [MyAuth]
    
		get(req, res) {
      	console.log(req.user)  // 7.认证通过这里你会拿到当前定义的用户对象
      	console.log(req.token)  // 7.这是一个token 也是你在你自定义的认真类中返回的
        return res.json({code: 0, msg: "success", data: {hello: "world"}})
    }
}

router.all("/test/", Userinfo.asView())

module.exports = router;

```



[联系我](https://github.com/lvhaoran88/restframework-express)

邮箱: 905097829@qq.com 、 lvhaoran@88.com

