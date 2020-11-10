## restframework-express

### 快速使用

+ 安装

```shell
npm i restframework-express
```

+ 使用

  + `api.js`

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

  + routes/index.js

    ```js
    let express = require('express');
    let router = express.Router();
    let UserInfo = require('../apis/api')
    
    // 在路由中注册
    router.all("/test/", Userinfo.asView())
    
    module.exports = router;
    ```

    

