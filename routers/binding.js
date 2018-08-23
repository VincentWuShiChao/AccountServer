/**
 * Created by Administrator on 2018/7/29.
 */
var express=require('express');
var router=express.Router();
var UserServer=require('../servers/UserServer');
router.post("/Binding",UserServer.binding);
router.post("/GetBindingPhone",UserServer.getBindingPhone);
router.post("/GetBindingWx",UserServer.getBindingWx);
router.get("/EmailActivate",UserServer.emailActivate);
module.exports=router;