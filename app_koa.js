/**
 * Created by Administrator on 2018/8/7.
 */
const Koa=require('koa');
const app=new Koa();
var routerLogin=require('./routers/login_koa');
var routerVerify=require('./routers/verify_koa');
var router=require('koa-router')();
const BodyParser = require('koa-bodyparser');

//app.use(BodyParser());
app.use(BodyParser());
router.use("/ykLogin",routerLogin.routes());
router.use("/ykVerify",routerVerify.routes());
app.use(routerLogin.routes());
app.use(routerVerify.routes());
/*app.use((ctx,next)=>{
    console.log(ctx.url);
    let onceRouter=ctx.path.split("/")[1];
    if(onceRouter==="ykLogin"){
        app.use(routerLogin.routes());
    }else if(onceRouter==="ykVerify"){
        app.use(routerVerify.routes());
    }
});*/
app.on("error",(err,ctx)=>{
    console.log(err);
})
app.listen(3000);
