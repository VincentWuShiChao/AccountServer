define({ "api": [
  {
    "type": "post",
    "url": "/ykLogin/UserInfoLogin",
    "title": "wechatUserInfoLogin(商户客户端微信小游戏版本)",
    "name": "UserInfoLogin",
    "group": "Login",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>微信登录通过wechatLogin接口后，还需通过wechatUserInfoLogin才能完成最终登录</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>用户登录的平台（1：安卓）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "channel",
            "description": "<p>用户登录的渠道</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    bindingType:,\n    app:,\n    platform:,\n    channel:,\n    bindingMsg:{\n        sessionKey:\"\",//此参数为通过Login接口，接收到的账户服务器返回的sessionKey\n        rawData:\"\",//该参数是客户端从微信服务器获取的信息。\n        signature:\"\",//该参数是客户端从微信服务器获取的信息。\n        encryptedData:\"\",//该参数是客户端从微信服务器获取的信息。\n        iv:\"\",//该参数是客户端从微信服务器获取的信息。\n    }\n}",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "platform",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "channel",
          "content": "\"0\"",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "服务器返回给客户端的数据": [
          {
            "group": "服务器返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result_user",
            "description": "<p>返回给客户端的数据</p>"
          }
        ],
        "result_user": [
          {
            "group": "result_user",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_user",
          "content": "{\n    result:\"ok\",\n    msg:\"login\",\n    desc:\"用户合法登录\",\n    userInfo:{\n        \"uid\": \"wushichao57291\",\n        \"openid\": \"d3VzaGljaGFvJjIwMTgwODAx\",\n        \"uname\": null,//普通用户登录，默认null\n        \"password\": null,//普通用户登录，默认null\n        \"registertime\": \"20180801\",\n        \"app\": \"h1v1,h1v2,h1v3\",\n        \"email\": null,\n        \"phone\": null,//手机登录信息\n        \"qq\": null,//qq登录信息\n        \"wx\": '{\"nickName\":\"4561676c6573\",\"openId\":\"o7qZc5dNzG1dmMs7ix0oklOQU-Pw\"}',//微信登录信息\n        \"xl\": null,//新浪登录信息\n        \"platform\": 1,\n        \"channel\": 0\n    },\n    access_token:\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"\n}",
          "type": "json"
        },
        {
          "title": "access_token：",
          "content": "\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/ykLogin/Login",
    "title": "wechatLogin(商户客户端微信小游戏版本)",
    "name": "wechatLogin",
    "group": "Login",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>客户端传过来的数据</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "Object",
            "optional": false,
            "field": "bindingMsg",
            "description": "<p>每种方式特有的登录信息，放在此变量中，以json形式保存.例如:{uname:&quot;&quot;,password:&quot;&quot;}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    app:,\n    bindingType:,\n    bindingMsg:{}\n }",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "bindingMsg",
          "content": "{//微信小程序版微信登录传的信息：\n\n    appid:\"wxa129e93655a5147e\",\n    code:\"023ekS1Q0B2vLa2A1W1Q0GBY1Q0ekS1t\",\n    errMsg:\"login:ok\",\n    secret:\"51aa352351761ce1ca64e610aed8ab6f\"\n\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "微信登录返回给客户端的数据": [
          {
            "group": "微信登录返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>返回给客户端的数据,客户端需要拿里面的sessionKey等数据再次调用UserInfoLogin接口完成最终的登录</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result",
          "content": "{\n    result:\"ok\",\n    msg:\"sessionKey\",\n    data:\"session_Key\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/ykLogin/Login",
    "title": "ykLogin(商户客户端)",
    "name": "ykLogin",
    "group": "Login",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>客户端传过来的数据</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "Object",
            "optional": false,
            "field": "bindingMsg",
            "description": "<p>每种方式特有的登录信息，放在此变量中，以json形式保存.例如:{uname:&quot;&quot;,password:&quot;&quot;}</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    app:,\n    bindingType:,\n    bindingMsg:{}\n }",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"0\"//代表普通用户登录",
          "type": "String"
        },
        {
          "title": "bindingMsg",
          "content": "{//普通用户登录时传的信息:\n    uname:\"muyinan\",\n    password:\"0123\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "服务器返回给客户端的数据": [
          {
            "group": "服务器返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result_user",
            "description": "<p>返回给客户端的数据</p>"
          }
        ],
        "result_user": [
          {
            "group": "result_user",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_user",
          "content": "{\n    result:\"ok\",\n    msg:\"login\",\n    desc:\"用户合法登录\",\n    userInfo:{\n        \"uid\": \"wushichao57291\",\n        \"openid\": \"d3VzaGljaGFvJjIwMTgwODAx\",\n        \"uname\": \"77757368696368616f\",//普通用户登录，默认null\n        \"password\": \"0123\",//普通用户登录，默认null\n        \"registertime\": \"20180801\",\n        \"app\": \"h1v1,h1v2,h1v3\",\n        \"email\": null,\n        \"phone\": null,//手机登录信息\n        \"qq\": null,//qq登录信息\n        \"wx\": null,//微信登录信息\n        \"xl\": null,//新浪登录信息\n        \"platform\": 1,\n        \"channel\": 0\n    },\n    access_token:\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"\n}",
          "type": "json"
        },
        {
          "title": "access_token：",
          "content": "\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/ykLogin/Register",
    "title": "wechatUserInfoRegister(商户客户端微信小游戏版本)",
    "name": "wechatUserInfoRegister",
    "group": "Register",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>微信注册通过wechatRegister接口后，还需通过wechatUserInfoRegister才能完成最终注册并自动登录</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>用户登录的平台（1：安卓）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "channel",
            "description": "<p>用户登录的渠道</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    bindingType:,\n    app:,\n    platform:,\n    channel:,\n    bindingMsg:{\n        sessionKey:\"\",//此参数为通过Login接口，接收到的账户服务器返回的sessionKey\n        rawData:\"\",//该参数是客户端从微信服务器获取的信息。\n        signature:\"\",//该参数是客户端从微信服务器获取的信息。\n        encryptedData:\"\",//该参数是客户端从微信服务器获取的信息。\n        iv:\"\",//该参数是客户端从微信服务器获取的信息。\n    }\n}",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "platform",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "channel",
          "content": "\"0\"",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "服务器返回给客户端的数据": [
          {
            "group": "服务器返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result_user",
            "description": "<p>返回给客户端的数据,自动登录</p>"
          }
        ],
        "result_user": [
          {
            "group": "result_user",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_user",
          "content": "{\n    result:\"ok\",\n    msg:\"register\",\n    desc:\"用户合法登录\",\n    userInfo:{\n        \"uid\": \"wushichao57291\",\n        \"openid\": \"d3VzaGljaGFvJjIwMTgwODAx\",\n        \"uname\": null,//默认null\n        \"password\": null,//默认null\n        \"registertime\": \"20180801\",\n        \"app\": \"h1v1,h1v2,h1v3\",\n        \"email\": null,\n        \"phone\": null,//手机登录信息\n        \"qq\": null,//qq登录信息\n        \"wx\": '{\"nickName\":\"4561676c6573\",\"openId\":\"o7qZc5dNzG1dmMs7ix0oklOQU-Pw\"}',//微信登录信息\n        \"xl\": null,//新浪登录信息\n        \"platform\": 1,\n        \"channel\": 0\n    },\n    access_token:\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"\n}",
          "type": "json"
        },
        {
          "title": "access_token",
          "content": "\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Register"
  },
  {
    "type": "post",
    "url": "/ykLogin/Register",
    "title": "wechatRegister(商户客户端微信小游戏版本)",
    "name": "wechatregister",
    "group": "Register",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>微信注册通过wechatRegister接口后，还需通过wechatUserInfoRegister才能完成最终注册</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>用户登录的平台（1：安卓）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "channel",
            "description": "<p>用户登录的渠道</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    bindingType:,\n    app:,\n    platform:,\n    channel:,\n    bindingMsg:{\n        //微信小程序版微信登录传的信息：\n            appid:\"wxa129e93655a5147e\",\n            code:\"023ekS1Q0B2vLa2A1W1Q0GBY1Q0ekS1t\",\n            errMsg:\"login:ok\",\n            secret:\"51aa352351761ce1ca64e610aed8ab6f\"\n    }\n}",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"1\"//代表普通用户登录",
          "type": "String"
        },
        {
          "title": "platform",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "channel",
          "content": "\"0\"",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "微信登录返回给客户端的数据": [
          {
            "group": "微信登录返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>返回给客户端的数据,客户端需要拿里面的sessionKey等数据再次调用UserInfoLogin接口完成最终的注册</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result",
          "content": "{\n    result:\"ok\",\n    msg:\"sessionKey\",\n    data:\"session_Key\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Register"
  },
  {
    "type": "post",
    "url": "/ykLogin/Register",
    "title": "ykRegister(商户客户端)",
    "name": "ykregister",
    "group": "Register",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": ""
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "bindingType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>用户登录的平台（1：安卓）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "channel",
            "description": "<p>用户登录的渠道</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    bindingType:,\n    app:,\n    email:,//普通用户\n    platform:,\n    channel:,\n    bindingMsg:{\n        //普通用户登录时传的信息:\n            uname:\"muyinan\",\n            password:\"0123\"\n    }\n}",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "bindingType",
          "content": "\"0\"//代表普通用户登录",
          "type": "String"
        },
        {
          "title": "platform",
          "content": "\"1\"",
          "type": "String"
        },
        {
          "title": "channel",
          "content": "\"0\"",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "服务器返回给客户端的数据": [
          {
            "group": "服务器返回给客户端的数据",
            "type": "Object",
            "optional": false,
            "field": "result_user",
            "description": "<p>返回给客户端的数据</p>"
          }
        ],
        "result_user": [
          {
            "group": "result_user",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>令牌：此令牌和openid参数一起被客户端接收后发送给自己的服务端，自己服务端拿着此两个参数去账户服务器发送验证，验证成功后，自己服务器才能让客户端进入自己服务器。</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_user",
          "content": "{\n    result:\"ok\",\n    msg:\"register\",\n    desc:\"用户合法登录\",\n    userInfo:{\n        \"uid\": \"wushichao57291\",\n        \"openid\": \"d3VzaGljaGFvJjIwMTgwODAx\",\n        \"uname\": \"wushichao\",//普通用户登录\n        \"password\": \"0123\",//普通用户登录\n        \"registertime\": \"20180801\",\n        \"app\": \"h1v1,h1v2,h1v3\",\n        \"email\": null,\n        \"phone\": null,//手机登录信息\n        \"qq\": null,//qq登录信息\n        \"wx\": null,//微信登录信息\n        \"xl\": null,//新浪登录信息\n        \"platform\": 1,\n        \"channel\": 0\n    },\n    access_token:\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"\n}",
          "type": "json"
        },
        {
          "title": "access_token：",
          "content": "\"W29iamVjdCBPYmplY3RdJjE1MzMxNzQzMTY0Njg=\"",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Register"
  },
  {
    "type": "post",
    "url": "/ykVerify/Verify",
    "title": "Verify(商户服务端)",
    "name": "Verify",
    "group": "Verify",
    "parameter": {
      "fields": {
        "主参数": [
          {
            "group": "主参数",
            "type": "Object",
            "optional": false,
            "field": "userInfo",
            "description": "<p>商户客户端传过来的数据</p>"
          }
        ],
        "userInfo": [
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "app",
            "description": "<p>软件类型</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "loginType",
            "description": "<p>用户登录类型（0：普通用户，1：微信小游戏版登录，2：手机登录）</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>商户客户端登录账户服务器获取的access_token</p>"
          },
          {
            "group": "userInfo",
            "type": "String",
            "optional": false,
            "field": "openId",
            "description": "<p>商户客户端登录账户服务器获取的openId</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "userInfo",
          "content": "{\n    app:\"\",\n    loginType:\"\",\n    access_token:\"\",\n    openId:\"\"\n }",
          "type": "json"
        },
        {
          "title": "app",
          "content": "\"h1v1\"",
          "type": "String"
        },
        {
          "title": "loginType",
          "content": "\"0\"",
          "type": "String"
        },
        {
          "title": "access_token",
          "content": "\"W29iamVjdCBPYmplY3RdJjE1MzMyMDAwMTk3ODM=\"",
          "type": "String"
        },
        {
          "title": "openId",
          "content": "\"bXV5aW5hbiYyMDE4MDgwMg==\"",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "服务器返回给商户服务器端的数据（Success）": [
          {
            "group": "服务器返回给商户服务器端的数据（Success）",
            "type": "Object",
            "optional": false,
            "field": "result_server",
            "description": "<p>返回给商户服务器端的数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_server",
          "content": "{\n    encode:\"0\",\n    msg:\"verify\",\n    desc:\"用户合法登录\",\n    userInfo:{\n        \"uid\": \"wushichao57291\",\n        \"openid\": \"d3VzaGljaGFvJjIwMTgwODAx\",\n        \"uname\": \"77757368696368616f\",//普通用户登录，默认null\n        \"password\": \"0123\",//普通用户登录，默认null\n        \"registertime\": \"20180801\",\n        \"app\": \"h1v1,h1v2,h1v3\",\n        \"email\": null,\n        \"phone\": null,//手机登录信息\n        \"qq\": null,//qq登录信息\n        \"wx\": null,//微信登录信息\n        \"xl\": null,//新浪登录信息\n        \"platform\": 1,\n        \"channel\": 0\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "服务器返回给商户服务器端的数据（Error）": [
          {
            "group": "服务器返回给商户服务器端的数据（Error）",
            "type": "Object",
            "optional": false,
            "field": "result_server",
            "description": "<p>返回给商户服务器端的数据</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "result_server",
          "content": "{\n    encode:\"-1\",//或者-2\n    msg:\"verify\",\n    desc:\"用户不合法登录\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "utils/ApiDoc.js",
    "groupTitle": "Verify"
  }
] });
