/**
 * Created by Administrator on 2018/7/29.
 */
var express=require('express');
var router=express.Router();
var UserServer=require('../servers/UserServer');
router.post("/EmailCommit",UserServer.emailCommit);
module.exports=router;