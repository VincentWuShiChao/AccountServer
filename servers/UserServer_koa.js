/**
 * Created by Administrator on 2018/8/7.
 */
/**
 * Created by Administrator on 2018/7/29.
 */
var UserService=require('../services/UserService');
var Code=require('../utils/Code');
var _Date=require('../utils/Date');
var request=require('request');
var result_user={
    result:"ok",
    msg:"",
    desc:"",
    userInfo:{}
};//返回给客户端
var result_server={
    encode:0,
    msg:"",
    desc:"",
    userInfo:{}
};//返回服务端

//{"openId":result.userInfo.openid,"access_token":accessToken_0,"accessState":0//有效}
var accessTokenList=[];
function clearResultUser(){
    result_user={
        result:"ok",
        msg:"",
        desc:"",
        userInfo:{}
    };
}
function clearResultServer(){
    result_server={
        encode:0,
        msg:"",
        desc:"",
        userInfo:{}
    };
}
function isAvailableData(data){
    console.log("进入isAvailableData方法");
    if(data instanceof Object){
        console.log("14:",data);
        return {encode:0,data:data};

    }else{
        try{
            console.log("30:",data);
            console.log("31:",typeof data);
            data=JSON.parse(data);
            console.log("18:",data);
            return {encode:0,data:data};
        }catch (err){
            console.log("23:",err);
            return {encode:-1,data:data}
        }
    }
}
exports.verify=(ctx,next)=> {//userInfo:{openId:,app:,access_token:,type:}

    let body=ctx.request.body;
    let userInfo=isAvailableData(body).data;
    let openId=userInfo.openId;
    let access_token=userInfo.access_token;
    let tag_has=-1;
    for(let i=0;i<accessTokenList.length;i++){
        if(accessTokenList[i].openId===openId&&accessTokenList[i].access_token===access_token){
            tag_has=i;
            break;
        }
    }
    if(tag_has!=-1){
        UserService.getUserByOpenId(userInfo, function (result) {
            if(result.state===-1){
                result_server.encode=-1;
                result_server.msg="verify";
                result_server.desc="未找到该用户";
                ctx.body=result_server;
                clearResultServer();
            }else {
                console.log("UserServer-80:","用户合法登录");
                result_server.encode=0;
                result_server.msg="verify";
                result_server.desc="用户合法登录";
                result_server.userInfo=result.userInfo;
                ctx.body=result_server;
                clearResultServer();
            }
        })
    }else {
        result_server.encode=-2;
        result_server.msg="verify";
        result_server.desc="该用户不合法";
        ctx.body=result_server;
        clearResultServer();
    }
};
//微信小游戏版微信登录-----------------------------
var sessionkeyList=[];
var appid="";
const sha1 = require("sha1");
var WXBizDataCrypt=require("../utils/WXBizDataCrypt");
function standardUserInfo(userInfo){
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.platform=parseInt(userInfo.platform);
    userInfo.channel=parseInt(userInfo.channel);
    return userInfo;
}
function createPassword(userInfo){
    let code_0=new Code(userInfo.bindingMsg.password,"base64");
    let encode_base64=code_0.decodeCoding();
    let code_hex=new Code(encode_base64,"hex");
    let hex_password=code_hex.setCoding();
    userInfo.bindingMsg.password=hex_password;
    return userInfo;
}
function createOpenId(userInfo){
    let date_0=new _Date();
    let time_0=date_0._getDate();
    let content_0=userInfo.bindingMsg.uname+"&"+time_0;
    let code_openid_0=new Code(content_0,"base64");
    let openid_0=code_openid_0.setCoding();
    userInfo.openid=openid_0;
    return userInfo;
}
//-------------------------------------------------注册----------------------------------------------------
exports.register= (ctx,next)=> {
    let clientUser=ctx.request.body;//{bindingType:,email:,app:,platform:,channel:,bindingMsg:{}}//
    let userInfo=isAvailableData(clientUser).data;
    console.log("63:",userInfo);
    userInfo=standardUserInfo(userInfo);
    switch (userInfo.bindingType){
        case 0://普通方式注册//bindingMsg:{uname:,password（base64）:}
            //password
            userInfo=createPassword(userInfo);
            //openid
            userInfo=createOpenId(userInfo);
            //registertime
            userInfo.registertime=time_0;
            //uname
            let code_name=new Code(userInfo.bindingMsg.uname,"hex");
            let name=code_name.setCoding();
            userInfo.bindingMsg.uname=name;
            UserService.getUserByName(userInfo.bindingMsg, function (result) {
                if(result.state===-1){
                    //uid
                    userInfo=createUid(userInfo);
                    UserService.addUser(userInfo, function (result_add) {
                        if(result_add.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_add.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            result_user.result="ok";
                            result_user.msg="register";
                            result_user.desc=result_add.desc;
                            res.send(result_user);
                            clearResultUser();
                        }
                    })
                }else if(result.state===0){
                    result_user.result="ok";
                    result_user.msg="register";
                    result_user.desc=result.desc;
                    result_user.userInfo=result.userInfo;
                    res.send(result_user);
                    clearResultUser();
                }
            });
            break;
        case 1://微信小游戏微信注册//{bindingtype:,bindingMsg:{}}
            LoginCode(userInfo,ctx);//等待客户端发送过来用户微信信息，跳转到UserInfo方法
            break;
        case 2://手机号注册//bindingMsg:{phone:}

            break;
        case 3://原版微信注册  bindingMsg:{openid:,access_token:}
            let wx_openid=userInfo.bindingMsg.openid;
            let wx_access_token=userInfo.bindingMsg.access_token;
            let url=`https://api.weixin.qq.com/sns/auth?openid=${wx_openid}&access_token=${wx_access_token}`;
            request({
                method: 'get',
                url:url
            }, function(err, res1, body){
                //用户服务器返回的数值
                console.log("微信返回的信息：",res1.body);
                let result={
                    result:"ok"
                };
                result.result="ok";
                result.msg="getUser";
                result.data=res1.body;
                ctx.body=result;
            });
            break;
        case 4://qq账号//{bindingType:,app:,platform:,channel:,bindingMsg:{appid:,}}//

            break;
        case 5://新浪微博账号

            break;
    }
};
//------------------------------------------------登录------------------------------------------------------------------
exports.login= ctx=> {
    let clientUser=ctx.request.body;
    console.log(clientUser);
    let userInfo=isAvailableData(clientUser).data;//{app:,bindingType:,bindingMsg:{}}//0:普通用户,1:手机用户,2:微信小程序微信登录
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let bindingType=userInfo.bindingType;
    switch (bindingType){
        case 0://普通用户
            //uname
            let code_name=new Code(userInfo.bindingMsg.uname,"hex");
            let name=code_name.setCoding();
            userInfo.bindingMsg.uname=name;
            //password
            let code_0=new Code(userInfo.bindingMsg.password,"base64");
            let encode_base64=code_0.decodeCoding();
            let code_hex=new Code(encode_base64,"hex");
            let hex_password=code_hex.setCoding();
            userInfo.bindingMsg.password=hex_password;
            UserService.getUserByName(userInfo.bindingMsg, function (result) {
                if(result.state===-1){
                    console.log("214用户不存在");
                    result_user.result="error";
                    result_user.msg="login";
                    result_user.desc=result.desc;
                    ctx.body=result_user;
                    clearResultUser();
                }else if(result.state===0){
                    console.log("220用户存在",result.userInfo.app);
                    let app_list=result.userInfo.app.split(",");
                    console.log(app_list);
                    let tag=-1;
                    for(let i=0;i<app_list.length;i++){
                        if(app_list[i]===userInfo.app){
                            tag=i;
                            break;
                        }
                    }
                    if(tag!=-1){
                        let date_0=new _Date();
                        let time_0=new Date().getTime();
                        let content_0=result.userInfo+"&"+time_0;
                        let code_0=new Code(content_0,"base64");
                        let accessToken_0=code_0.setCoding();
                        accessTokenList.push({
                            "openId":result.userInfo.openid,
                            "access_token":accessToken_0,
                            "accessState":0//有效
                        });
                        result_user.result="ok";
                        result_user.msg="login";
                        result_user.desc=result.desc;
                        result_user.userInfo=result.userInfo;
                        result_user.access_token=accessToken_0;
                        ctx.body=result_user;
                        clearResultUser();
                    }else {
                        app_list.push(userInfo.app);
                        userInfo.app=app_list;
                        UserService.updateApp(userInfo, function (result_app) {
                            if(result_app.state===-1){
                                result_user.result="error";
                                result_user.msg="login";
                                result_user.desc="更新app失败";
                                result_user.userInfo=result.userInfo;
                                ctx.body=result_user;
                                clearResultUser();
                            }else {
                                let date_0=new _Date();
                                let time_0=new Date().getTime();
                                let content_0=result.userInfo+"&"+time_0;
                                let code_0=new Code(content_0,"base64");
                                let accessToken_0=code_0.setCoding();
                                accessTokenList.push({
                                    "openId":result.userInfo.openid,
                                    "access_token":accessToken_0,
                                    "accessState":0//有效
                                });
                                result.userInfo.app=app_list;
                                result_user.result="ok";
                                result_user.msg="login";
                                result_user.desc=result.desc;
                                result_user.userInfo=result.userInfo;
                                result_user.access_token=accessToken_0;
                                ctx.body=result_user;
                                clearResultUser();
                            }
                        })
                    }
                }
            });
            break;

        case 1://手机用户
            break;
        case 2://微信用户
            LoginCode(userInfo,res);
            break;
    }
};
//--------------------------------------------------绑定-----------------------------------------------------------------------
exports.binding= ctx=>{//{bindingtype:,bindingMsg:{}}

};
//--------------------------------------------------utils---------------------------------------------------------------------
function createUid(userInfo) {
    let _uid=Math.ceil(Math.random()*100000);
    let decode_name=new Code(userInfo.bindingMsg.uname,"hex");
    let dename=decode_name.decodeCoding();
    let uid=dename+_uid;
    userInfo.uid=uid;
    return userInfo;
}

//--------------------------------------------------微信小游戏版登录---------------------------------------------------------------
//微信小游戏登录入口
function LoginCode(userInfo,ctx) {
    let body=userInfo.bindingMsg;
    let code=body.code;
    console.log("code:",code);
    appid=body.appid;
    let secret=body.secret;
    request({
        method: 'get',
        url:"https://api.weixin.qq.com/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code"
    }, function(err, res1, body){
        //用户服务器返回的数值
        console.log("微信返回的信息：",res1.body);
        let result={
            result:"ok"
        };
        console.log("session_key:",JSON.parse(res1.body).session_key);
        sessionkeyList.push(JSON.parse(res1.body).session_key);
        result.result="ok";
        result.msg="sessionKey";
        result.data=JSON.parse(res1.body).session_key;
        ctx.body=result;
    });
}
exports.UserInfoRegister=ctx=>{//{bindingtype:,bindingMsg:{},app:,platform:,channel:,}
    console.log("UserInfoRegister-303");
    let clientUser=ctx.request.body;
    let userInfo=isAvailableData(clientUser).data;
    console.log("306:", typeof userInfo.bindingMsg);
    userInfo=standardUserInfo(userInfo);
    console.log("309:", typeof userInfo.bindingMsg);
    let body=userInfo.bindingMsg;
    console.log("309:",body.userInfo);
    for(let i=0;i<sessionkeyList.length;i++){
        if(sessionkeyList[i]===body.sessionKey){
            let signature2 = sha1(body.rawData + sessionkeyList[i]);
            if (body.signature != signature2) return res.json("数据签名校验失败");
            // 解密
            let pc = new WXBizDataCrypt(appid, sessionkeyList[i]);
            let data = pc.decryptData(body.encryptedData,body.iv);
            console.log('解密后用户信息: ', data);
            console.log('解密后用户信息类型: ', typeof data);
            //将微信用户信息加入到user表中
            let date_2=new _Date();
            let time_2=date_2._getDate();
            let content_2=data.openId;
            let code_2=new Code(content_2,"base64");
            let openid_2=code_2.setCoding();
            userInfo.openid=openid_2;
            userInfo.registertime=time_2;
            let code_nickname=new Code(data.nickName,"hex");
            let nickname=code_nickname.setCoding();
            userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${data.openId}\\\"}`;
            console.log("UserServer-332:",userInfo.wx);
            userInfo.openId=openid_2;
            UserService.getUserByOpenId(userInfo, function (result) {
                if(result.state===-1){
                    //uid
                    let _uid_2=Math.ceil(Math.random()*100000);
                    let decode_name=new Code(nickname,"hex");
                    let dename=decode_name.decodeCoding();
                    let uid=dename+_uid_2;
                    userInfo.uid=uid;
                    console.log("UserServer-341:",userInfo.wx);
                    UserService.addUser(userInfo,function (result_recall) {
                        if(result_recall.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_recall.desc;
                            ctx.body=result_user;
                            clearResultUser();
                        }else {
                            UserService.getUserByOpenId(userInfo, function (result_1) {
                                if(result_1.state===-1){
                                    result_user.result="error";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    ctx.body=result_user;
                                    clearResultUser();
                                }else {
                                    let time_2=new Date().getTime();
                                    let content_2=result_1.userInfo+"&"+time_2;
                                    let code_2=new Code(content_2,"base64");
                                    let accessToken_2=code_2.setCoding();
                                    accessTokenList.push({
                                        "openId":result_1.userInfo.openid,
                                        "access_token":accessToken_2,
                                        "accessState":0//有效
                                    });
                                    result_user.result="ok";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    result_user.userInfo=result_1.userInfo;
                                    result_user.access_token=accessToken_2;
                                    ctx.body=result_user;
                                    clearResultUser();
                                }
                            });
                        }
                    });
                }else {
                    result_user.result="ok";
                    result_user.msg="register";
                    result_user.desc="用户已经存在不能重复注册";
                    result_user.userInfo=result.userInfo;
                    ctx.body=result_user;
                    clearResultUser();
                }
            });
            break;
        }
    }
};
exports.UserInfoLogin=ctx=>{//{bindingType:,email:,app:,platform:,channel:,password:,bindingMsg:{}}
    let clientUser=ctx.request.body;
    let userInfo=isAvailableData(clientUser).data;
    console.log("63:",userInfo);
    userInfo=standardUserInfo(userInfo);
    let body=userInfo.bindingMsg;
    for(let i=0;i<sessionkeyList.length;i++){
        if(sessionkeyList[i]===body.sessionKey){
            let signature2 = sha1(body.rawData + sessionkeyList[i]);
            if (body.signature != signature2) return res.json("数据签名校验失败");
            // 解密
            let pc = new WXBizDataCrypt(appid, sessionkeyList[i]);
            let data = pc.decryptData(body.encryptedData,body.iv);
            console.log('解密后用户信息: ', data);
            console.log('解密后用户信息类型: ', typeof data);
            //将微信用户信息加入到user表中
            let date_2=new _Date();
            let time_2=date_2._getDate();
            let content_2=data.openId;
            let code_2=new Code(content_2,"base64");
            let openid_2=code_2.setCoding();
            userInfo.openid=openid_2;
            userInfo.registertime=time_2;
            let code_nickname=new Code(data.nickName,"hex");
            let nickname=code_nickname.setCoding();
            userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${data.openId}\\\"}`;
            userInfo.openId=openid_2;//跟微信openId一样唯一
            UserService.getUserByOpenId(userInfo, function (result) {
                if(result.state===-1){
                    //uid
                    let _uid_2=Math.ceil(Math.random()*100000);
                    let decode_name=new Code(nickname,"hex");
                    let dename=decode_name.decodeCoding();
                    let uid=dename+_uid_2;
                    userInfo.uid=uid;
                    UserService.addUser(userInfo,function (result_recall) {
                        if(result_recall.state===-1){
                            result_user.result="error";
                            result_user.msg="login";
                            result_user.desc=result_recall.desc;
                            ctx.body=result_user;
                            clearResultUser();
                        }else {

                            UserService.getUserByOpenId(userInfo, function (result_1) {
                                if(result_1.state===-1){
                                    result_user.result="error";
                                    result_user.msg="login";
                                    result_user.desc=result_1.desc;
                                    ctx.body=result_user;
                                    clearResultUser();
                                }else {
                                    let time_2=new Date().getTime();
                                    let content_2=result_1.userInfo+"&"+time_2;
                                    let code_2=new Code(content_2,"base64");
                                    let accessToken_2=code_2.setCoding();
                                    accessTokenList.push({
                                        "openId":result_1.userInfo.openid,
                                        "access_token":accessToken_2,
                                        "accessState":0//有效
                                    });
                                    result_user.result="ok";
                                    result_user.msg="login";
                                    result_user.desc=result_1.desc;
                                    result_user.userInfo=result_1.userInfo;
                                    result_user.access_token=accessToken_2;
                                    ctx.body=result_user;
                                    clearResultUser();
                                }
                            });
                        }
                    });
                }else {
                    let app_list=result.userInfo.app.split(",");
                    console.log(app_list);
                    let tag=-1;
                    for(let i=0;i<app_list.length;i++){
                        if(app_list[i]===userInfo.app){
                            tag=i;
                            break;
                        }
                    }
                    if(tag!=-1){
                        let time_0=new Date().getTime();
                        let content_0=result.userInfo+"&"+time_0;
                        let code_0=new Code(content_0,"base64");
                        let accessToken_0=code_0.setCoding();
                        accessTokenList.push({
                            "openId":result.userInfo.openid,
                            "access_token":accessToken_0,
                            "accessState":0//有效
                        });
                        result_user.result="ok";
                        result_user.msg="login";
                        result_user.desc=result.desc;
                        result_user.userInfo=result.userInfo;
                        result_user.access_token=accessToken_0;
                        ctx.body=result_user;
                        clearResultUser();
                    }else {
                        app_list.push(userInfo.app);
                        userInfo.app=app_list;
                        UserService.updateAppByOpenId(userInfo, function (result_app) {
                            if(result_app.state===-1){
                                result_user.result="error";
                                result_user.msg="login";
                                result_user.desc="更新app失败";
                                result_user.userInfo=result.userInfo;
                                ctx.body=result_user;
                                clearResultUser();
                            }else {
                                let time_0=new Date().getTime();
                                let content_0=result.userInfo+"&"+time_0;
                                let code_0=new Code(content_0,"base64");
                                let accessToken_0=code_0.setCoding();
                                accessTokenList.push({
                                    "openId":result.userInfo.openid,
                                    "access_token":accessToken_0,
                                    "accessState":0//有效
                                });
                                result.userInfo.app=app_list;
                                result_user.result="ok";
                                result_user.msg="login";
                                result_user.desc=result.desc;
                                result_user.userInfo=result.userInfo;
                                result_user.access_token=accessToken_0;
                                ctx.body=result_user;
                                clearResultUser();
                            }
                        })
                    }
                }
            });
            break;
        }
    }
};
//-------------------------------------------------原版微信登录---------------------------------------------------------------
exports.userMsg=ctx=> {//{bindingtype:,bindingMsg:{},app:,platform:,channel:,}
    console.log("userMsg");

    var result_client=ctx.request.body;
    let userInfo=isAvailableData(result_client).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.platform=parseInt(userInfo.platform);
    userInfo.channel=parseInt(userInfo.channel);
    let body=userInfo.bindingMsg;


};
//-------------------------------------------------qq登录-------------------------------------------------

exports.getQQData= ctx=> {

};