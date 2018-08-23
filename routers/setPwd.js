/**
 * Created by Administrator on 2018/8/13.
 */
var express=require('express');
var router=express.Router();
var UserServer=require('../servers/UserServer');
router.post("/",UserServer.setPwd);
router.post("/RegisterSetPwd",UserServer.registerSetPwd);


module.exports=router;