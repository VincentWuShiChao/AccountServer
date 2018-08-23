/**
 * Created by Administrator on 2018/8/2.
 */
/**
 * @api {post} /ykLogin/Login ykLogin(商户客户端)
 * @apiName ykLogin
 * @apiGroup Login
 *
 * @apiParam (主参数) {Object} userInfo 客户端传过来的数据
 * @apiParamExample  {json} userInfo
 *      {
 *          app:,
 *          bindingType:,
 *          bindingMsg:{}
 *       }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "0"//代表普通用户登录
 * @apiParam (userInfo) {Object} bindingMsg 每种方式特有的登录信息，放在此变量中，以json形式保存.例如:{uname:"",password:""}
 * @apiParamExample  {json} bindingMsg
 *      {//普通用户登录时传的信息:
 *          uname:"muyinan",
 *          password:"0123"
 *      }
 * @apiSuccess (服务器返回给客户端的数据) {Object} result_user 返回给客户端的数据
 * @apiSuccessExample {json} result_user
 *      {
 *          result:"ok",
 *          msg:"login",
 *          desc:"用户合法登录",
 *          userInfo:{
 *              "uid": "wushichao57291",
 *              "openid": "d3VzaGljaGFvJjIwMTgwODAx",
 *              "uname": "77757368696368616f",//普通用户登录，默认null
 *              "password": "0123",//普通用户登录，默认null
 *              "registertime": "20180801",
 *              "app": "h1v1,h1v2,h1v3",
 *              "email": null,
 *              "phone": null,//手机登录信息
 *              "qq": null,//qq登录信息
 *              "wx": null,//微信登录信息
 *              "xl": null,//新浪登录信息
 *              "platform": 1,
 *              "channel": 0
 *          },
 *          access_token:"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 *      }
 * @apiSuccess (result_user) {String} access_token 令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。
 * @apiSuccessExample  {String} access_token：
 *      "W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 */

/**
 * @api {post} /ykLogin/Login wechatLogin(商户客户端微信小游戏版本)
 * @apiName wechatLogin
 * @apiGroup Login
 *
 * @apiParam (主参数) {Object} userInfo 客户端传过来的数据
 * @apiParamExample  {json} userInfo
 *      {
 *          app:,
 *          bindingType:,
 *          bindingMsg:{}
 *       }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "1"
 * @apiParam (userInfo) {Object} bindingMsg 每种方式特有的登录信息，放在此变量中，以json形式保存.例如:{uname:"",password:""}
 * @apiParamExample  {json} bindingMsg
 *      {//微信小程序版微信登录传的信息：
 *
 *          appid:"wxa129e93655a5147e",
 *          code:"023ekS1Q0B2vLa2A1W1Q0GBY1Q0ekS1t",
 *          errMsg:"login:ok",
 *          secret:"51aa352351761ce1ca64e610aed8ab6f"
 *
 *      }
 * @apiSuccess (微信登录返回给客户端的数据) {Object} result 返回给客户端的数据,客户端需要拿里面的sessionKey等数据再次调用UserInfoLogin接口完成最终的登录
 * @apiSuccessExample {json} result
 *      {
 *          result:"ok",
 *          msg:"sessionKey",
 *          data:"session_Key"
 *      }
 */
/**
 *@api {post} /ykLogin/UserInfoLogin wechatUserInfoLogin(商户客户端微信小游戏版本)
 * @apiName UserInfoLogin
 * @apiGroup Login
 *
 * @apiParam (主参数) {Object} userInfo 微信登录通过wechatLogin接口后，还需通过wechatUserInfoLogin才能完成最终登录
 * @apiParamExample  {json} userInfo
 *      {
 *          bindingType:,
 *          app:,
 *          platform:,
 *          channel:,
 *          bindingMsg:{
 *              sessionKey:"",//此参数为通过Login接口，接收到的账户服务器返回的sessionKey
 *              rawData:"",//该参数是客户端从微信服务器获取的信息。
 *              signature:"",//该参数是客户端从微信服务器获取的信息。
 *              encryptedData:"",//该参数是客户端从微信服务器获取的信息。
 *              iv:"",//该参数是客户端从微信服务器获取的信息。
 *          }
 *      }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "1"
 * @apiParam (userInfo) {String} platform 用户登录的平台（1：安卓）
 * @apiParamExample  {String} platform
 *      "1"
 * @apiParam (userInfo) {String} channel 用户登录的渠道
 * @apiParamExample  {String} channel
 *      "0"
 * @apiSuccess (服务器返回给客户端的数据) {Object} result_user 返回给客户端的数据
 * @apiSuccessExample {json} result_user
 *      {
 *          result:"ok",
 *          msg:"login",
 *          desc:"用户合法登录",
 *          userInfo:{
 *              "uid": "wushichao57291",
 *              "openid": "d3VzaGljaGFvJjIwMTgwODAx",
 *              "uname": null,//普通用户登录，默认null
 *              "password": null,//普通用户登录，默认null
 *              "registertime": "20180801",
 *              "app": "h1v1,h1v2,h1v3",
 *              "email": null,
 *              "phone": null,//手机登录信息
 *              "qq": null,//qq登录信息
 *              "wx": '{"nickName":"4561676c6573","openId":"o7qZc5dNzG1dmMs7ix0oklOQU-Pw"}',//微信登录信息
 *              "xl": null,//新浪登录信息
 *              "platform": 1,
 *              "channel": 0
 *          },
 *          access_token:"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 *      }
 * @apiSuccess (result_user) {String} access_token 令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。
 * @apiSuccessExample  {String} access_token：
 *      "W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 */


/**
 * @api {post} /ykLogin/Register ykRegister(商户客户端)
 * @apiName ykregister
 * @apiGroup Register
 *
 * @apiParam (主参数) {Object} userInfo
 * @apiParamExample  {json} userInfo
 *      {
 *          bindingType:,
 *          app:,
 *          email:,//普通用户
 *          platform:,
 *          channel:,
 *          bindingMsg:{
 *              //普通用户登录时传的信息:
 *                  uname:"muyinan",
 *                  password:"0123"
 *          }
 *      }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "0"//代表普通用户登录
 * @apiParam (userInfo) {String} platform 用户登录的平台（1：安卓）
 * @apiParamExample  {String} platform
 *      "1"
 * @apiParam (userInfo) {String} channel 用户登录的渠道
 * @apiParamExample  {String} channel
 *      "0"
 * @apiSuccess (服务器返回给客户端的数据) {Object} result_user 返回给客户端的数据
 * @apiSuccessExample {json} result_user
 *      {
 *          result:"ok",
 *          msg:"register",
 *          desc:"用户合法登录",
 *          userInfo:{
 *              "uid": "wushichao57291",
 *              "openid": "d3VzaGljaGFvJjIwMTgwODAx",
 *              "uname": "wushichao",//普通用户登录
 *              "password": "0123",//普通用户登录
 *              "registertime": "20180801",
 *              "app": "h1v1,h1v2,h1v3",
 *              "email": null,
 *              "phone": null,//手机登录信息
 *              "qq": null,//qq登录信息
 *              "wx": null,//微信登录信息
 *              "xl": null,//新浪登录信息
 *              "platform": 1,
 *              "channel": 0
 *          },
 *          access_token:"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 *      }
 * @apiSuccess (result_user) {String} access_token 令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。
 * @apiSuccessExample  {String} access_token：
 *      "W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 */

/**
 * @api {post} /ykLogin/Register wechatRegister(商户客户端微信小游戏版本)
 * @apiName wechatregister
 * @apiGroup Register
 *
 * @apiParam (主参数) {Object} userInfo 微信注册通过wechatRegister接口后，还需通过wechatUserInfoRegister才能完成最终注册
 * @apiParamExample  {json} userInfo
 *      {
 *          bindingType:,
 *          app:,
 *          platform:,
 *          channel:,
 *          bindingMsg:{
 *              //微信小程序版微信登录传的信息：
 *                  appid:"wxa129e93655a5147e",
 *                  code:"023ekS1Q0B2vLa2A1W1Q0GBY1Q0ekS1t",
 *                  errMsg:"login:ok",
 *                  secret:"51aa352351761ce1ca64e610aed8ab6f"
 *          }
 *      }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "1"//代表普通用户登录
 * @apiParam (userInfo) {String} platform 用户登录的平台（1：安卓）
 * @apiParamExample  {String} platform
 *      "1"
 * @apiParam (userInfo) {String} channel 用户登录的渠道
 * @apiParamExample  {String} channel
 *      "0"
 * @apiSuccess (微信登录返回给客户端的数据) {Object} result 返回给客户端的数据,客户端需要拿里面的sessionKey等数据再次调用UserInfoLogin接口完成最终的注册
 * @apiSuccessExample {json} result
 *      {
 *          result:"ok",
 *          msg:"sessionKey",
 *          data:"session_Key"
 *      }
 *
 */
/**
 * @api {post} /ykLogin/Register wechatUserInfoRegister(商户客户端微信小游戏版本)
 * @apiName wechatUserInfoRegister
 * @apiGroup Register
 *
 * @apiParam (主参数) {Object} userInfo 微信注册通过wechatRegister接口后，还需通过wechatUserInfoRegister才能完成最终注册并自动登录
 * @apiParamExample  {json} userInfo
 *      {
 *          bindingType:,
 *          app:,
 *          platform:,
 *          channel:,
 *          bindingMsg:{
 *              sessionKey:"",//此参数为通过Login接口，接收到的账户服务器返回的sessionKey
 *              rawData:"",//该参数是客户端从微信服务器获取的信息。
 *              signature:"",//该参数是客户端从微信服务器获取的信息。
 *              encryptedData:"",//该参数是客户端从微信服务器获取的信息。
 *              iv:"",//该参数是客户端从微信服务器获取的信息。
 *          }
 *      }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} bindingType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} bindingType
 *      "1"
 * @apiParam (userInfo) {String} platform 用户登录的平台（1：安卓）
 * @apiParamExample  {String} platform
 *      "1"
 * @apiParam (userInfo) {String} channel 用户登录的渠道
 * @apiParamExample  {String} channel
 *      "0"
 * @apiSuccess (服务器返回给客户端的数据) {Object} result_user 返回给客户端的数据,自动登录
 * @apiSuccessExample {json} result_user
 *      {
 *          result:"ok",
 *          msg:"register",
 *          desc:"用户合法登录",
 *          userInfo:{
 *              "uid": "wushichao57291",
 *              "openid": "d3VzaGljaGFvJjIwMTgwODAx",
 *              "uname": null,//默认null
 *              "password": null,//默认null
 *              "registertime": "20180801",
 *              "app": "h1v1,h1v2,h1v3",
 *              "email": null,
 *              "phone": null,//手机登录信息
 *              "qq": null,//qq登录信息
 *              "wx": '{"nickName":"4561676c6573","openId":"o7qZc5dNzG1dmMs7ix0oklOQU-Pw"}',//微信登录信息
 *              "xl": null,//新浪登录信息
 *              "platform": 1,
 *              "channel": 0
 *          },
 *          access_token:"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 *      }
 * @apiSuccess (result_user) {String} access_token 令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。
 * @apiSuccessExample  {String} access_token
 *      "W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg="
 */

/**
 * @api {post} /ykVerify/Verify Verify(商户服务端)
 * @apiName Verify
 * @apiGroup Verify
 *
 * @apiParam (主参数) {Object} userInfo 商户客户端传过来的数据
 * @apiParamExample  {json} userInfo
 *      {
 *          app:"",
 *          loginType:"",
 *          access_token:"",
 *          openId:""
 *       }
 * @apiParam (userInfo) {String} app 软件类型
 * @apiParamExample  {String} app
 *      "h1v1"
 * @apiParam (userInfo) {String} loginType 用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）
 * @apiParamExample  {String} loginType
 *      "0"
 * @apiParam (userInfo) {String} access_token 商户客户端登录账户服务器获取的access_token
 * @apiParamExample  {String} access_token
 *      "W29iamVjdCBPYmplY3RdJjE1MzMyMDAwMTk3ODM="
 * @apiParam (userInfo) {String} openId 商户客户端登录账户服务器获取的openId
 * @apiParamExample  {String} openId
 *      "bXV5aW5hbiYyMDE4MDgwMg=="
 *
 * @apiSuccess (服务器返回给商户服务器端的数据（Success）) {Object} result_server 返回给商户服务器端的数据
 * @apiSuccessExample {json} result_server
 *      {
 *          encode:"0",
 *          msg:"verify",
 *          desc:"用户合法登录",
 *          userInfo:{
 *              "uid": "wushichao57291",
 *              "openid": "d3VzaGljaGFvJjIwMTgwODAx",
 *              "uname": "77757368696368616f",//普通用户登录，默认null
 *              "password": "0123",//普通用户登录，默认null
 *              "registertime": "20180801",
 *              "app": "h1v1,h1v2,h1v3",
 *              "email": null,
 *              "phone": null,//手机登录信息
 *              "qq": null,//qq登录信息
 *              "wx": null,//微信登录信息
 *              "xl": null,//新浪登录信息
 *              "platform": 1,
 *              "channel": 0
 *          }
 *      }
 * @apiError (服务器返回给商户服务器端的数据（Error）) {Object} result_server 返回给商户服务器端的数据
 * @apiErrorExample  {json} result_server
 *      {
 *          encode:"-1",//或者-2
 *          msg:"verify",
 *          desc:"用户不合法登录",
 *      }
 */