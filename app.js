/**
 * Created by Administrator on 2018/7/27.
 */

var express=require('express');
var bodyParser=require('body-parser');
var app=express();
var router_login=require('./routers/login.js');
var router_verify=require('./routers/verify.js');
var router_refresh=require('./routers/refresh.js');
var router_binding=require('./routers/binding.js');
var router_setPwd=require('./routers/setPwd.js');
var router_register=require('./routers/register.js');
app.use(bodyParser.json({limit:"2mb"}));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use("/public",express.static(__dirname+"/public"));
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By",' 3.2.1');
    res.setHeader("Content-Type", "application/json;charset=utf-8");
    next();
});
/*app.set("/entry",false);
console.log(app.get('/entry'));*/
/*app.param(function(param, option) {
    return function (req, res, next, val) {
        if (val == option) {
            next();
        }
        else {
            res.sendStatus(403);
        }
    }
});
app.param("id",112);
app.get("/:id", function (req,res) {
    console.log("相等");
});*/
app.use("/ykLogin",router_login);
app.use("/ykRegister",router_register);
app.use("/ykVerify",router_verify);
app.use("/ykBinding",router_binding);
app.use("/ykRefresh",router_refresh);
app.use("/ykSetPwd",router_setPwd);
app.locals.title="AccountServer";

app.listen(8000,"0.0.0.0", function () {
    console.log("开启账户服务器监听");
    //console.log(app.locals)
});
