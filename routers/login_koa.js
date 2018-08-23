/**
 * Created by Administrator on 2018/8/7.
 */
var router=require('koa-router')();

var UserServer_koa=require('../servers/UserServer_koa');
//router.post("/Login",UserServer.login);
router.post("/Register",UserServer_koa.register);
router.post("/UserInfoLogin",UserServer_koa.UserInfoLogin);//小游戏中的微信登录信息
router.post("/UserInfoRegister",UserServer_koa.UserInfoRegister);//小游戏中的微信注册信息
router.post("/UserMsg",UserServer_koa.userMsg);//原生微信登录注册
router.post("/Binding",UserServer_koa.binding);
router.post("/GetQQData",UserServer_koa.getQQData);
router.post("/Login", ctx=>{
    console.log(ctx.request.body.name);
    ctx.body="/ykLogin/Login Get";
})

module.exports=router;