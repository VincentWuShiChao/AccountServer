/**
 * Created by Administrator on 2018/7/29.
 */
var router=require('koa-router')();
var UserServer=require('../servers/UserServer');
router.post("/Verify",UserServer.verify);
router.get("/Verify",ctx=>{
    ctx.body="/ykVerify/Verify Post";
})
module.exports=router;

