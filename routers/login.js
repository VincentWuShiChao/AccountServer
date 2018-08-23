/**
 * Created by Administrator on 2018/7/29.
 */
var express=require('express');
var router=express.Router();
var UserServer=require('../servers/UserServer');
router.post("/Login",UserServer.login);
router.post("/LoginEntry",UserServer.loginEntry);
router.post("/Register",UserServer.register);
router.post("/UserInfoLogin",UserServer.UserInfoLogin);//小游戏中的微信登录信息
router.post("/UserInfoRegister",UserServer.UserInfoRegister);//小游戏中的微信注册信息
router.post("/UserMsgRegister",UserServer.userMsgRegister);//原生微信登录注册
router.post("/UserMsgLogin",UserServer.userMsgLogin);//原生微信登录注册
//router.post("/GetQQData",UserServer.getQQData);
router.post("/GetPhoneVerify",UserServer.getPhoneVerify);//获取手机号信息
router.post("/GetPhoneVerifyLogin",UserServer.getPhoneVerifyLogin);//获取手机号信息
module.exports=router;