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
var SendMail=require('../utils/Email');

const accessAbleTime=1000*60*60;
//{"openId":result.userInfo.openid,"access_token":accessToken_0,"accessState":0//有效,"accessTime":}
var accessTokenList=[];
var that=this;
openHeartListen();
exports.verify=function (req,res) {//userInfo:{openId:,app:,access_token:,type:}
    console.log("UserServer-59:",req.body);
    let body=req.body;
    let userInfo=isAvailableData(body).data;
    let openId=userInfo.openId;
    let access_token=userInfo.access_token;
    let tag_has=-1;
    for(let i=0;i<accessTokenList.length;i++){
        if(accessTokenList[i].openId===openId&&accessTokenList[i].access_token===access_token&&accessTokenList[i].accessState===0){
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
                res.send(result_server);
                clearResultServer();
            }else {
                console.log("UserServer-80:","用户合法登录");
                result_server.encode=0;
                result_server.msg="verify";
                result_server.desc="用户合法登录";
                result_server.userInfo=result.userInfo;
                res.send(result_server);
                clearResultServer();
            }
        })
    }else {
        result_server.encode=-2;
        result_server.msg="verify";
        result_server.desc="该用户不合法";
        res.send(result_server);
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
   /* let code_0=new Code(userInfo.bindingMsg.password,"base64");
    let encode_base64=code_0.decodeCoding();*/
    let code_hex=new Code(userInfo.bindingMsg.password,"hex");
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
exports.register= function (req,res) {
    let clientUser=req.body;//{bindingType:,email:,app:,platform:,channel:,bindingMsg:{}}//
    let userInfo=isAvailableData(clientUser).data;
    console.log("63:",userInfo);
    userInfo=standardUserInfo(userInfo);
    switch (userInfo.bindingType){
        case 0://普通方式注册//bindingMsg:{uname:,password（base64）:}
            RegisterUser(userInfo,res);
            break;
        case 1://微信小游戏微信注册//{bindingtype:,bindingMsg:{}}
            RegisterCode(userInfo,res);//等待客户端发送过来用户微信信息，跳转到UserInfo方法
            break;
        case 2://手机号注册//bindingMsg:{phone:,sendType:}
            RegisterPhone(userInfo,res);
            break;
        case 3://原版微信注册  bindingMsg:{openid:,access_token:}
            LoginWx(userInfo,res);
            break;
        case 4://qq账号//{bindingType:,app:,platform:,channel:,bindingMsg:{appid:,}}//
            LoginQQ(userInfo,res);
            break;
        case 5://新浪微博账号//{bindingType:,app:,platform:,channel:,bindingMsg:{idstr:,name:,profile_image_url:}}//
            RegisterWb(userInfo,res);
            break;
        case 6://邮箱
            RegisterEmail(userInfo,res);
            break;
    }
};
//------------------------------------------------登录------------------------------------------------------------------
exports.login= function (req,res) {
    let clientUser=req.body;
    console.log("###############################",clientUser);
    let userInfo=isAvailableData(clientUser).data;//{app:,bindingType:,bindingMsg:{}}//0:普通用户,1:手机用户,2:微信小程序微信登录,4:qq登录
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let bindingType=userInfo.bindingType;
    switch (bindingType){
        case 0://普通用户
            //uname
            LoginUser(userInfo,res);
            break;
        case 1://微信小游戏
            LoginCode(userInfo,res);
            break;
        case 2://手机用户//通过验证码登录
            LoginPhone(userInfo,res);
            break;
        case 3://微信用户
            LoginCode(userInfo,res);
            break;
        case 4://qq登录
            LoginQQ(userInfo,res);
            break;
        case 5://新浪微博账号
            LoginWb(userInfo,res);
            break;
        case 6://邮箱
            LoginEmailByPwd(userInfo,res);
            break;
    }
};
//手机号，邮箱通过登录密码登录
exports.loginEntry= function (req,res) {//{app:,bindingType:,bindingMsg:{}}//
    let clientUser=req.body;
    console.log("###############################",clientUser);
    let userInfo=isAvailableData(clientUser).data;//{app:,bindingType:,bindingMsg:{}}//0:普通用户,1:手机用户,2:微信小程序微信登录,4:qq登录
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let bindingType=userInfo.bindingType;
    switch (bindingType){
        case 0://普通用户
            //uname
            LoginUser(userInfo,res);
            break;
        case 1://微信小游戏
            LoginCode(userInfo,res);
            break;
        case 2://手机用户//通过密码{app:,bindingType:,bindingMsg:{phone:,password}}//
            LoginPhoneByPwd(userInfo,res);
            break;
        case 3://微信用户
            LoginCode(userInfo,res);
            break;
        case 4://qq登录
            LoginQQ(userInfo,res);
            break;
        case 5://新浪微博账号

            break;
        case 6://邮箱
            LoginEmailByPwd(userInfo,res);
            break;

    }
};
//--------------------------------------------------绑定-----------------------------------------------------------------------
exports.binding= function (req,res) {//{openId:,bindingtype:,bindingMsg:{}}
    let clientUser=req.body;//{openId:,bindingType:,bindingMsg:{}}//
    let userInfo=isAvailableData(clientUser).data;
    switch (userInfo.bindingType){
        case 0://普通用户

            break;
        case 1://微信小游戏
            break;
        case 2://手机用户bindingMsg:{phone:,sendType:}
            BindingPhone(userInfo,res);
            break;
        case 3://微信用户
            LoginWx(userInfo,res);
            break;
        case 4://qq登录
            break;
        case 5://新浪微博账号

            break;
        case 6://邮箱
            BindingEmail(userInfo,res);
            break;
    }
};
//---------------------------------------------------设置登录密码----------------------------------------------------------
exports.setPwd= function (req,res) {//{openId:,password:,bindingType:,bindingMsg:{}}//
    let clientUser=req.body;
    let userInfo=isAvailableData(clientUser).data;
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    switch (userInfo.bindingType){
        case 0://普通用户

            break;
        case 1://微信小游戏
            break;
        case 2://手机用户bindingMsg:{phone:,sendType:}
            PhoneSetPwd(userInfo,res);
            break;
        case 3://微信用户

            break;
        case 4://qq登录

            break;
        case 5://新浪微博账号

            break;
        case 6://邮箱
            emailSetPwd(userInfo,res);
            break;
    }
};//绑定
exports.registerSetPwd=function (req,res) {//{password:,bindingType:,bindingMsg:{}}//
    let clientUser=req.body;
    let userInfo=isAvailableData(clientUser).data;
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    switch (userInfo.bindingType){
        case 0://普通用户

            break;
        case 1://微信小游戏
            break;
        case 2://手机用户bindingMsg:{phone:,sendType:}
            PhoneSetPwd(userInfo,res);
            break;
        case 3://微信用户

            break;
        case 4://qq登录

            break;
        case 5://新浪微博账号

            break;
        case 6://邮箱bindingMsg:{email:,}
            emailRegisterSetPwd(userInfo,res);
            break;
    }
};//注册
//---------------------------------------------------微博--------------------------------------------------------------------
//注册
function RegisterWb(userInfo,res){//{bindingType:5,app:,platform:,channel:,bindingMsg:{idstr:,name:,profile_image_url:}}//
    userInfo=standardUserInfo(userInfo);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let body=userInfo.bindingMsg;
    userInfo.xl=`{\\\"idstr\\\":\\\"${body.idstr}\\\",\\\"name\\\":\\\"${body.name}\\\",\\\"profile_image_url\\\":\\\"${body.profile_image_url}\\\"`;
    UserService.getUserByWb(userInfo, function (result) {
        if(result.state===-1){
            let date=new _Date();
            let time=date._getDate();
            let content=body.idstr;
            let code=new Code(content,"base64");
            let openid=code.setCoding();
            userInfo.openid=openid;
            userInfo.registertime=time;
            userInfo.openId=openid;
            let _uid_2=Math.ceil(Math.random()*100000);
            let uid=body.name+"_"+_uid_2;
            userInfo.uid=uid;
            UserService.addUser(userInfo,function (result_recall) {
                if(result_recall.state===-1){
                    result_user.result="error";
                    result_user.msg="register";
                    result_user.desc=result_recall.desc;
                    res.send(result_user);
                    clearResultUser();
                }else {
                    UserService.getUserByWb(userInfo, function (result_1) {
                        if(result_1.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_1.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            let time_2=new Date().getTime();
                            let content_2=result_1.userInfo+"&"+time_2;
                            let code_2=new Code(content_2,"base64");
                            let accessToken_2=code_2.setCoding();
                            accessTokenList.push({
                                "openId":result_1.userInfo.openid,
                                "access_token":accessToken_2,
                                "accessState":0,//有效
                                "accessTime":new Date().getTime()
                            });
                            result_1.userInfo.password="********";
                            result_user.result="ok";
                            result_user.msg="Login";
                            result_user.desc=result_1.desc;
                            result_user.userInfo=result_1.userInfo;
                            result_user.access_token=accessToken_2;
                            res.send(result_user);
                            clearResultUser();
                        }
                    });
                }
            });
        }else {
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="register";
            result_user.desc="已经注册过，不能注册多个账号";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });
}
//登录
function LoginWb(userInfo,res){//{bindingType:5,app:,platform:,channel:,bindingMsg:{idstr:,name:,profile_image_url:}}//
    userInfo=standardUserInfo(userInfo);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let body=userInfo.bindingMsg;
    userInfo.xl=`{\\\"idstr\\\":\\\"${body.idstr}\\\",\\\"name\\\":\\\"${body.name}\\\",\\\"profile_image_url\\\":\\\"${body.profile_image_url}\\\"`;
    UserService.getUserByWb(userInfo, function (result) {
        if(result.state===-1){
            console.log("微博首次登录");
            let date=new _Date();
            let time=date._getDate();
            let content=body.idstr;
            let code=new Code(content,"base64");
            let openid=code.setCoding();
            userInfo.openid=openid;
            userInfo.registertime=time;
            userInfo.openId=openid;
            let _uid_2=Math.ceil(Math.random()*100000);
            let uid=body.name+"_"+_uid_2;
            userInfo.uid=uid;
            UserService.addUser(userInfo,function (result_recall) {
                if(result_recall.state===-1){
                    result_user.result="error";
                    result_user.msg="register";
                    result_user.desc=result_recall.desc;
                    res.send(result_user);
                    clearResultUser();
                }else {
                    UserService.getUserByWb(userInfo, function (result_1) {
                        if(result_1.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_1.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            let time_2=new Date().getTime();
                            let content_2=result_1.userInfo+"&"+time_2;
                            let code_2=new Code(content_2,"base64");
                            let accessToken_2=code_2.setCoding();
                            accessTokenList.push({
                                "openId":result_1.userInfo.openid,
                                "access_token":accessToken_2,
                                "accessState":0,//有效
                                "accessTime":new Date().getTime()
                            });
                            result_1.userInfo.password="********";
                            result_user.result="ok";
                            result_user.msg="Login";
                            result_user.desc=result_1.desc;
                            result_user.userInfo=result_1.userInfo;
                            result_user.access_token=accessToken_2;
                            res.send(result_user);
                            clearResultUser();
                        }
                    });
                }
            });
        }else {
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="Login";
            result_user.desc="登录成功";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });
}
//绑定

//---------------------------------------------------邮箱--------------------------------------------------------------------
//注册
var ToCommitList=[];//确认注册邮箱
setInterval(function () {
    ToCommitList.forEach(function (each) {
        let nowTime=new Date().getTime();
        if(nowTime-each.time>1000*60){
            each.status=-2;
        }
    });
},1000*60);
function RegisterEmail(userInfo,res){//{{bindingType:5,platform:,channel:,bindingMsg:{email;,},app:,}//
    let email=userInfo.bindingMsg.email;
    userInfo=standardUserInfo(userInfo);
    var mail={
        //发件人
        from:'vincent_wsc@126.com',
        //主题
        subject:'注册邮箱账号',
        //收件人
        to:email,
        //邮件内容，HTML格式
        text:'点击<html>' +
        '<a href="http://localhost:8000/ykBinding/EmailCommit?email='+email+'">激活</a>' +
        '</html>'
    };
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    UserService.getUserByEmail(userInfo.bindingMsg, function (result) {
        if(result.state===-1){
            let date=new _Date();
            let time=date._getDate();
            let content=email;
            let code=new Code(content,"base64");
            let openid=code.setCoding();
            userInfo.openid=openid;
            userInfo.registertime=time;
            userInfo.openId=openid;
            let _uid_2=Math.ceil(Math.random()*100000);
            let uid=email+"_"+_uid_2;
            userInfo.uid=uid;

            ToCommitList.push({email:email,status:-1,time:new Date().getTime(),userInfo:userInfo});
            SendMail(mail);
            result_user.result="ok";
            result_user.msg="register";
            result_user.desc="此时跳转到设置密码界面，同时提示请到邮箱激活";
            res.send(result_user);
            clearResultUser();
        }else {
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="register";
            result_user.desc="已经注册过，不能注册多个账号";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });
}
exports.emailCommit=function(req,res){
    var arg=url.parse(req.url).query;
    var email=qs.parse(arg)['email'];
    ToCommitList.forEach(function (each,index) {
        if(each.email===email){
            if(each.status===-2){
                ToActivateList.splice(index,1);
                result_user.result="ok";
                result_user.msg="commit";
                result_user.desc="邮箱激活失效,请重新绑定";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===-1){
                each.status=0;
                each.time=new Date().getTime();
                result_user.result="ok";
                result_user.msg="commit";
                result_user.desc="邮箱激活成功,请设置登录密码";
                res.send(result_user);
                clearResultUser();
            }
        }
    });
};
function emailRegisterSetPwd(userInfo,res){//{password:,bindingType:,bindingMsg:{email:,}}
    let email=userInfo.bindingMsg.email;
    let code_hex=new Code(userInfo.password,"hex");
    let hex_password=code_hex.setCoding();
    userInfo.password=hex_password;
    ToCommitList.forEach(function (each,index) {
        if(each.email===email){
            if(each.status===-2){
                ToCommitList.splice(index,1);
                result_user.result="ok";
                result_user.msg="commit";
                result_user.desc="邮箱激活失效,请重新注册";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===-1){
                result_user.result="ok";
                result_user.msg="commit";
                result_user.desc="还未到邮箱中激活,请登录邮箱激活";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===0){
                each.userInfo.password=userInfo.password;
                UserService.addUserRegister(each.userInfo, function (result_recall) {
                    if (result_recall.state === -1) {
                        result_user.result = "error";
                        result_user.msg = "register";
                        result_user.desc = result_recall.desc;
                        res.send(result_user);
                        clearResultUser();
                    } else {
                        UserService.getUserByEmail(each.userInfo, function (result_1) {
                            if (result_1.state === -1) {
                                result_user.result = "error";
                                result_user.msg = "register";
                                result_user.desc = result_1.desc;
                                res.send(result_user);
                                clearResultUser();
                            } else {
                                result_user.result = "ok";
                                result_user.msg = "register";
                                result_user.desc = "邮箱注册成功，请登录";
                                res.send(result_user);
                                clearResultUser();
                            }
                        });
                    }
                });
            }
        }
    });
}
//登录
function LoginEmailByPwd(userInfo,res){//通过密码{app:,bindingType:,bindingMsg:{email:,password}}//
    UserService.getUserByEmail(userInfo.bindingMsg, function (phone_result) {
        if(phone_result.state===-1){
            result_user.result="ok";
            result_user.msg="login";
            result_user.desc="用户名不存在或未绑定，请注册或绑定";
        }else {
            UserService.getUserByEmailAndPwd(userInfo, function (result) {
                if(result.state===-1){
                    result_user.result="ok";
                    result_user.msg="login";
                    result_user.desc="用户名或者密码错误,请重新登录";
                }else {
                    let time_2=new Date().getTime();
                    let content_2=result.userInfo+"&"+time_2;
                    let code_2=new Code(content_2,"base64");
                    let accessToken_2=code_2.setCoding();
                    accessTokenList.push({
                        "openId":result.userInfo.openid,
                        "access_token":accessToken_2,
                        "accessState":0,//有效
                        "accessTime":new Date().getTime()
                    });
                    result.userInfo.password="********";
                    result_user.result="ok";
                    result_user.msg="login";
                    result_user.desc="用户登录成功";
                    result_user.userInfo=result.userInfo;
                    result_user.access_token=accessToken_2;
                    res.send(result_user);
                    clearResultUser();
                }
            });
        }
    });

}
//绑定
var ToActivateList=[];//待激活的邮箱,-2:失效，-1：待激活需要设置密码，0：激活不用设置密码，1激活但未设置密码
setInterval(function () {
    ToActivateList.forEach(function (each) {
        let nowTime=new Date().getTime();
        if(nowTime-each.time>1000*60){
            each.status=-2;
        }
    });
},1000*60);
function BindingEmail(userInfo,res){//{openId:,bindingType:,bindingMsg:{email:,}}//

    let email=userInfo.bindingMsg.email;
    let openId=userInfo.openId;
    var mail={
        //发件人
        from:'vincent_wsc@126.com',
        //主题
        subject:'绑定邮箱',
        //收件人
        to:email,
        //邮件内容，HTML格式
        text:'点击<html>' +
        '<a href="http://localhost:8000/ykBinding/EmailActivate?email='+email+'&openId='+openId+'">激活</a>' +
        '</html>'
    };
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    UserService.getUserByEmail(userInfo.bindingMsg, function (result) {
        if(result.state===-1){
            UserService.getUserPwdByOpenId(userInfo, function (user_result) {//查看是否需要设置登录密码
                if(user_result.state===0){
                    ToActivateList.push({email:email,status:0,time:new Date().getTime(),userInfo:userInfo});
                    SendMail(mail);
                    result_user.result="ok";
                    result_user.msg="binding";
                    result_user.desc="此时跳转到设置密码界面，同时提示请到邮箱激活";
                    res.send(result_user);
                    clearResultUser();
                    /*UserService.updateEmailByOpenId(userInfo, function (result_1) {//绑定邮箱
                        if(result_1.state===0){
                            ToActivateList.push({email:email,status:-1,time:new Date().getTime(),userInfo:userInfo});
                            result_user.result="ok";
                            result_user.msg="binding";
                            result_user.desc="此时跳转到设置密码界面，同时提示请到邮箱激活";
                            res.send(result_user);
                            SendMail(mail);
                            clearResultUser();
                        }else {
                            console.log("用户的邮箱绑定失败");
                        }
                    });*/
                }else if(user_result.state===1){
                    ToActivateList.push({email:email,status:1,time:new Date().getTime(),userInfo:userInfo});
                    SendMail(mail);
                    result_user.result="ok";
                    result_user.msg="binding";
                    result_user.desc="跳转到登录界面，同时提示请到邮箱激活";
                    res.send(result_user);
                    clearResultUser();
                }else {
                    console.log("未获取到该用户");
                }
            })
        }else {
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="binding";
            result_user.desc="已经绑定过，不能绑定多个账号";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });

}
exports.emailActivate=function(req,res){//{openId:,email:}//
    var arg=url.parse(req.url).query;
    var email=qs.parse(arg)['email'];
    var openId=qs.parse(arg)['openId'];
    ToActivateList.forEach(function (each,index) {
        if(each.email===email){
            if(each.status===-2){
                ToActivateList.splice(index,1);
                result_user.result="ok";
                result_user.msg="activate";
                result_user.desc="邮箱激活失效,请重新绑定";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===0){
                each.status=0.1;
                result_user.result="ok";
                result_user.msg="activate";
                result_user.desc="邮箱激活成功,请设置登录密码";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===1){

                UserService.updateEmailByOpenId(each.userInfo, function (result_1) {//绑定邮箱
                    if(result_1.state===0){
                        ToActivateList.splice(index,1);
                        result_user.result="ok";
                        result_user.msg="activate";
                        result_user.desc="邮箱绑定成功,可直接登录";
                        res.send(result_user);
                        clearResultUser();
                    }else {
                        console.log("用户的邮箱绑定失败");
                    }
                });

            }
        }
    });
};
function emailSetPwd(userInfo,res){//{openId:,password:,bindingType:,bindingMsg:{email:,}}
    let email=userInfo.bindingMsg.email;
    let openId=userInfo.openId;
    let code_hex=new Code(userInfo.password,"hex");
    let hex_password=code_hex.setCoding();
    userInfo.password=hex_password;
    ToActivateList.forEach(function (each,index) {
        if(each.email===email){
            if(each.status===-2){
                ToActivateList.splice(index,1);
                result_user.result="ok";
                result_user.msg="activate";
                result_user.desc="邮箱激活失效,请重新绑定";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===0){
                result_user.result="ok";
                result_user.msg="activate";
                result_user.desc="邮箱未激活失效，请登录邮箱激活";
                res.send(result_user);
                clearResultUser();
            }else if(each.status===0.1){
                let userInfo={
                    openId:openId,
                    password:userInfo.password
                };
                UserService.updatePwdByOpenId(userInfo, function (result_1) {//设置登录密码
                    if(result_1.state===0){
                        ToActivateList.splice(index,1);
                        UserService.getUserByOpenId(userInfo, function (user_result) {
                            user_result.userInfo.password="********";
                            result_user.result="ok";
                            result_user.msg="setPwd";
                            result_user.desc="登录密码设置成功";
                            result_user.userInfo=user_result.userInfo;
                            res.send(result_user);
                            clearResultUser();
                        })
                    }else {
                        console.log("用户登录密码设置失败");
                    }
                });
            }
        }
    });
}
//----------------------------------------------更新用户的accessToken--------------------------------------------------------
let result_refresh={
    encode:0,
    msg:"refreshAccessToken",
    desc:""
};
exports.refreshAccessToken= function (req,res) {//{openId:,access_token:}
    let clientUser=req.body;//{openId:,bindingType:,bindingMsg:{}}//
    let userInfo=isAvailableData(clientUser).data;
    accessTokenList.forEach(function (accessTokenEach) {
        if(accessTokenEach.openId===userInfo.openId&&accessTokenEach.access_token===userInfo.access_token){
            let nowTime=new Date().getTime();
            if(accessTokenEach.accessState===0){
                result_refresh.encode=0;
                result_refresh.desc="该用户的access_token没有失效，请不要重复更新";
                res.send(result_refresh);
            }else {
                let time=new Date().getTime();
                let content=userInfo.openId+"&"+time;
                let code=new Code(content,"base64");
                let accessToken=code.setCoding();
                accessTokenEach.access_token=accessToken;
                accessTokenEach.accessState=0;
                accessTokenEach.accessTime=time;
                result_refresh.accessTokenData=accessTokenEach;
                result_refresh.encode=1;
                result_refresh.desc="刷新用户access_token成功";
                res.send(result_refresh);
            }
        }
    });
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
function openHeartListen(){
    console.log("开启了心跳监听");
    setInterval(function () {
        console.log("达到监听时效，开始执行心跳");
        accessTokenList.forEach(function (accessTokenEach) {
            let nowTime=new Date().getTime();
            if(nowTime-accessTokenEach.accessTime>accessAbleTime&&accessTokenEach.accessState===0){
                accessTokenEach.accessState=-1;
                console.log(`${accessTokenEach.openId}用户的access_token失效`)
            }
        });
    },1000*60*20);
}

//---------------------------------------------------普通用户-----------------------------------------------------
function RegisterUser(userInfo,res){
    //password
    userInfo=createPassword(userInfo);
    //openid
    userInfo=createOpenId(userInfo);
    //registertime
    let time_0=new Date().getTime();
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
                    UserService.getUserByName(userInfo.bindingMsg, function (result_1) {
                        result_1.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="register";
                        result_user.desc=result_add.desc;
                        result_user.userInfo=result_1.userInfo;
                        res.send(result_user);
                        clearResultUser();
                    })

                }
            })
        }else if(result.state===0){
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="register";
            result_user.desc="用户存在请登录";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });
}
function LoginUser(userInfo,res){
    let code_name=new Code(userInfo.bindingMsg.uname,"hex");
    let name=code_name.setCoding();
    userInfo.bindingMsg.uname=name;
    //password
    /*let code_0=new Code(userInfo.bindingMsg.password,"base64");
    let encode_base64=code_0.decodeCoding();*/
    let code_hex=new Code(userInfo.bindingMsg.password,"hex");
    let hex_password=code_hex.setCoding();
    userInfo.bindingMsg.password=hex_password;
    UserService.getUserByName(userInfo.bindingMsg, function (result) {
        if(result.state===-1){
            console.log("214用户不存在");
            result_user.result="error";
            result_user.msg="login";
            result_user.desc=result.desc;
            res.send(result_user);
            clearResultUser();
        }else if(result.state===0){
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",userInfo);
            UserService.getUserByNameAndPassWord(userInfo.bindingMsg, function (result_all) {
                console.log("result_all-322:",result_all);
                if(result_all.state===-1){
                    result_user.result="error";
                    result_user.msg="login";
                    result_user.desc="用户存在但密码不正确，请重新登录";
                    res.send(result_user);
                    clearResultUser();
                }else {
                    console.log("用户登录成功",result.userInfo.app);
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
                            "accessState":0,//有效
                            "accessTime":new Date().getTime()
                        });
                        result.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="login";
                        result_user.desc=result.desc;
                        result_user.userInfo=result.userInfo;
                        result_user.access_token=accessToken_0;
                        res.send(result_user);
                        clearResultUser();
                    }else {
                        app_list.push(userInfo.app);
                        userInfo.app=app_list;
                        UserService.updateApp(userInfo, function (result_app) {
                            if(result_app.state===-1){
                                result.userInfo.password="********";
                                result_user.result="error";
                                result_user.msg="login";
                                result_user.desc="更新app失败";
                                result_user.userInfo=result.userInfo;
                                res.send(result_user);
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
                                    "accessState":0,//有效
                                    "accessTime":new Date().getTime()
                                });
                                result.userInfo.password="********";
                                result.userInfo.app=app_list;
                                result_user.result="ok";
                                result_user.msg="login";
                                result_user.desc=result.desc;
                                result_user.userInfo=result.userInfo;
                                result_user.access_token=accessToken_0;
                                res.send(result_user);
                                clearResultUser();
                            }
                        })
                    }
                }
            })

        }
    });
}


//---------------------------------------------------手机号登录-------------------------------------------------------------------
var https=require('https');
var qs=require('querystring');
let phone_config={
    mobile:"",
    apikey:'e83880957cfab23509a4c64a53d04b9a',
    text:"",// 修改为您要发送的短信内容
    code:"",// 发送语音验证码接口https地址
    get_user_info_uri:'/v2/user/get.json',// 查询账户信息https地址
    sms_host:'sms.yunpian.com',// 智能匹配模板发送https地址
    voice_host:'voice.yunpian.com',
    send_sms_uri: '/v2/sms/single_send.json',
    send_tpl_sms_uri:'/v2/sms/tpl_single_send.json',// 指定模板发送接口https地址
    send_voice_uri:'/v2/voice/send.json'// 发送语音验证码接口https地址
};
let phone_code=[
    {
        "phone": "18434360985",
        "code": "9500",
        "state": 0
    }
];

let phone_result={
    result:"ok",
    msg:"register",
    desc:""
};
//注册
function RegisterPhone(userInfo,res){//{bindingType:,app:,bindingMsg:{phone:,sendType:}}
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let sendType=body.sendType;

    phone_config.mobile=phone;

    var newCode="";
    for(let i=0;i<4;i++){
        newCode=newCode+Math.floor(Math.random()*10);
    }
    console.log(newCode);
    // 修改为您要发送的短信内容
    phone_config.text = `【吴世超】您的验证码是${newCode}。如非本人操作，请忽略本短信`;
    phone_config.code=newCode;
    phone_code.push({
        phone:phone_config.mobile,
        code:phone_config.code,
        state:-1//0为有效
    });
    //query_user_info(phone_config.get_user_info_uri,phone_config.apikey,res);
    switch (sendType){
        case 1://发送短信
            console.log("走到发送短信case1");
            send_sms(phone_config.send_sms_uri,phone_config.apikey,phone_config.mobile,phone_config.text,res);
            break;
        case 2://发送语音
            send_voice_sms(phone_config.send_voice_uri,phone_config.apikey,phone_config.mobile,phone_config.code,res);
            break;
    }
}
exports.getPhoneVerify= function (req,res) {//{bindingType:2,platform:,channel:,bindingMsg:{phone:,code:},app:,}
    let clientUser=req.body;
    let userInfo=isAvailableData(clientUser).data;
    userInfo=standardUserInfo(userInfo);
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let code=body.code;
    phone_code.forEach(function (phone_code_each,index) {
        if(phone_code_each.code===code&&phone_code_each.phone===phone){
            if(phone_code_each.state===0){
                phone_result.result="ok";
                phone_result.desc="验证通过";
                phone_code.splice(index,1);
                let date=new _Date();
                let time=date._getDate();
                let content=phone_code_each.phone;
                let code=new Code(content,"base64");
                let openid=code.setCoding();
                userInfo.openid=openid;
                userInfo.registertime=time;
                userInfo.openId=openid;
                UserService.getUserByPhone(userInfo, function (result) {
                    if(result.state===-1){
                        //uid
                        let _uid_2=Math.ceil(Math.random()*100000);
                        let uid=phone+"_"+_uid_2;
                        userInfo.uid=uid;
                        UserService.addUser(userInfo,function (result_recall) {
                            if(result_recall.state===-1){
                                result_user.result="error";
                                result_user.msg="register";
                                result_user.desc=result_recall.desc;
                                res.send(result_user);
                                clearResultUser();
                            }else {
                                UserService.getUserByPhone(userInfo, function (result_1) {
                                    if(result_1.state===-1){
                                        result_user.result="error";
                                        result_user.msg="register";
                                        result_user.desc=result_1.desc;
                                        res.send(result_user);
                                        clearResultUser();
                                    }else {
                                        result_user.result="ok";
                                        result_user.msg="register";
                                        result_user.desc="手机注册成功，请设置登录密码";
                                        res.send(result_user);
                                        clearResultUser();
                                    }
                                });
                            }
                        });
                    }else {
                        result.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="register";
                        result_user.desc="用户已经存在不能重复注册,请直接登录";
                        result_user.userInfo=result.userInfo;
                        res.send(result_user);
                        clearResultUser();
                    }
                });
            }else {

                phone_result.result="error";
                result_user.msg="register";
                phone_result.desc="验证码已经失效,请重新获取";
                phone_code.splice(index,1);
                res.send(phone_result);
            }
        }
    });
};
//登录
function LoginPhone(userInfo,res){//{bindingType:,app:,bindingMsg:{phone:,sendType:}}
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let sendType=body.sendType;

    phone_config.mobile=phone;

    var newCode="";
    for(let i=0;i<4;i++){
        newCode=newCode+Math.floor(Math.random()*10);
    }
    console.log(newCode);
    // 修改为您要发送的短信内容
    phone_config.text = `【吴世超】您的验证码是${newCode}。如非本人操作，请忽略本短信`;
    phone_config.code=newCode;
    phone_code.push({
        phone:phone_config.mobile,
        code:phone_config.code,
        state:-1//0为有效
    });
    //query_user_info(phone_config.get_user_info_uri,phone_config.apikey,res);
    switch (sendType){
        case 1://发送短信
            console.log("走到发送短信case1");
            send_sms(phone_config.send_sms_uri,phone_config.apikey,phone_config.mobile,phone_config.text,res);
            break;
        case 2://发送语音
            send_voice_sms(phone_config.send_voice_uri,phone_config.apikey,phone_config.mobile,phone_config.code,res);
            break;
    }
}
//通过验证码登录
exports.getPhoneVerifyLogin= function (req,res) {//{bindingType:2,platform:,channel:,bindingMsg:{phone:,code:},app:,}
    let clientUser=req.body;
    let userInfo=isAvailableData(clientUser).data;
    userInfo=standardUserInfo(userInfo);
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let code=body.code;
    phone_code.forEach(function (phone_code_each,index) {
        if(phone_code_each.code===code&&phone_code_each.phone===phone){
            if(phone_code_each.state===0){
                phone_result.result="ok";
                phone_result.desc="验证通过";
                phone_code.splice(index,1);
                let date=new _Date();
                let time=date._getDate();
                let content=phone_code_each.phone;
                let code=new Code(content,"base64");
                let openid=code.setCoding();
                userInfo.openid=openid;
                userInfo.registertime=time;
                userInfo.openId=openid;
                UserService.getUserByPhone(userInfo, function (result) {
                    if(result.state===-1){
                        //uid
                        let _uid_2=Math.ceil(Math.random()*100000);
                        let uid=phone+"_"+_uid_2;
                        userInfo.uid=uid;
                        UserService.addUser(userInfo,function (result_recall) {
                            if(result_recall.state===-1){
                                result_user.result="error";
                                result_user.msg="login";
                                result_user.desc=result_recall.desc;
                                res.send(result_user);
                                clearResultUser();
                            }else {
                                UserService.getUserByPhone(userInfo, function (result_1) {
                                    if(result_1.state===-1){
                                        result_user.result="error";
                                        result_user.msg="login";
                                        result_user.desc=result_1.desc;
                                        res.send(result_user);
                                        clearResultUser();
                                    }else {
                                        let time_2=new Date().getTime();
                                        let content_2=result_1.userInfo+"&"+time_2;
                                        let code_2=new Code(content_2,"base64");
                                        let accessToken_2=code_2.setCoding();
                                        accessTokenList.push({
                                            "openId":result_1.userInfo.openid,
                                            "access_token":accessToken_2,
                                            "accessState":0,//有效
                                            "accessTime":new Date().getTime()
                                        });
                                        result_1.userInfo.password="********";
                                        result_user.result="ok";
                                        result_user.msg="login";
                                        result_user.desc=result_1.desc;
                                        result_user.userInfo=result_1.userInfo;
                                        result_user.access_token=accessToken_2;
                                        res.send(result_user);
                                        clearResultUser();
                                    }
                                });
                            }
                        });
                    }else {
                        let time_2=new Date().getTime();
                        let content_2=result.userInfo+"&"+time_2;
                        let code_2=new Code(content_2,"base64");
                        let accessToken_2=code_2.setCoding();
                        accessTokenList.push({
                            "openId":result.userInfo.openid,
                            "access_token":accessToken_2,
                            "accessState":0,//有效
                            "accessTime":new Date().getTime()
                        });
                        result.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="login";
                        result_user.desc="用户已经存在,已经直接登录";
                        result_user.userInfo=result.userInfo;
                        result_user.access_token=accessToken_2;
                        res.send(result_user);
                        clearResultUser();
                    }
                });
            }else {
                phone_result.result="error";
                result_user.msg="login";
                phone_result.desc="验证码已经失效,请重新获取";
                phone_code.splice(index,1);
                res.send(phone_result);
            }
        }
    });
};
//通过密码登录
function LoginPhoneByPwd(userInfo,res){//通过密码{app:,bindingType:,bindingMsg:{phone:,password}}//
    UserService.getUserByPhone(userInfo, function (phone_result) {
        if(phone_result.state===-1){
            result_user.result="ok";
            result_user.msg="login";
            result_user.desc="用户名不存在，请注册";
        }else {
            UserService.getUserByPhoneAndPwd(userInfo, function (result) {
                if(result.state===-1){
                    result_user.result="ok";
                    result_user.msg="login";
                    result_user.desc="用户名或者密码错误,请重新登录";
                }else {
                    let time_2=new Date().getTime();
                    let content_2=result.userInfo+"&"+time_2;
                    let code_2=new Code(content_2,"base64");
                    let accessToken_2=code_2.setCoding();
                    accessTokenList.push({
                        "openId":result.userInfo.openid,
                        "access_token":accessToken_2,
                        "accessState":0,//有效
                        "accessTime":new Date().getTime()
                    });
                    result.userInfo.password="********";
                    result_user.result="ok";
                    result_user.msg="login";
                    result_user.desc="用户登录成功";
                    result_user.userInfo=result.userInfo;
                    result_user.access_token=accessToken_2;
                    res.send(result_user);
                    clearResultUser();
                }
            });
        }
    });

}
//绑定
exports.getBindingPhone= function (req,res) {//{openId:,bindingType:2,bindingMsg:{phone:,code:}}
    let clientUser=req.body;
    let userInfo=isAvailableData(clientUser).data;
    console.log("userInfo-668",userInfo.bindingMsg);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let code=body.code;
    phone_code.forEach(function (phone_code_each,index) {
        if(phone_code_each.code===code&&phone_code_each.phone===phone){
            if(phone_code_each.state===0){
                phone_result.result="ok";
                phone_result.desc="验证通过";
                phone_code.splice(index,1);
                UserService.getUserByPhone(userInfo, function (result) {
                    if(result.state===-1){
                        UserService.getUserPwdByOpenId(userInfo,function(user_result){
                            if(user_result.state===0){
                                UserService.updatePhoneByOpenId(userInfo, function (result_1) {
                                    if(result_1.state===0){
                                        UserService.getUserByPhone(userInfo, function (result_2) {
                                            result_2.userInfo.password="********";
                                            result_user.result="ok";
                                            result_user.msg="binding";
                                            result_user.desc="手机绑定成功，请设置登录密码";
                                            result_user.userInfo=result_2.userInfo;
                                            res.send(result_user);
                                            clearResultUser();
                                        });
                                    }else {
                                        console.log("用户的手机绑定失败");
                                    }
                                });
                            }else if(user_result.state===1){

                                UserService.updatePhoneByOpenId(userInfo, function (result_1) {//绑定手机
                                    if(result_1.state===0){
                                        UserService.getUserByPhone(userInfo, function (result_2) {
                                            result_2.userInfo.password="********";
                                            result_user.result="ok";
                                            result_user.msg="binding";
                                            result_user.desc="手机绑定成功,已经设置登录密码,可直接登录";
                                            result_user.userInfo=result_2.userInfo;
                                            res.send(result_user);
                                            clearResultUser();
                                        });
                                    }else {
                                        console.log("用户的邮箱绑定失败");
                                    }
                                });
                            }else {
                                console.log("未获取到该用户");
                            }
                        });

                    }else {
                        result.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="binding";
                        result_user.desc="已经绑定过，不能绑定多个账号";
                        result_user.userInfo=result.userInfo;
                        res.send(result_user);
                        clearResultUser();
                    }
                });
            }else {
                phone_result.result="error";
                phone_result.msg="binding";
                phone_result.desc="验证码已经失效,请重新获取";
                phone_code.splice(index,1);
                res.send(phone_result);
            }
        }
    });

};
function BindingPhone(userInfo,res){//{bindingType:,app:,bindingMsg:{phone:,sendType:}}
    let body=userInfo.bindingMsg;
    let phone=body.phone;
    let sendType=body.sendType;

    phone_config.mobile=phone;

    var newCode="";
    for(let i=0;i<4;i++){
        newCode=newCode+Math.floor(Math.random()*10);
    }
    console.log(newCode);
    // 修改为您要发送的短信内容
    phone_config.text = `【吴世超】您的验证码是${newCode}。如非本人操作，请忽略本短信`;
    phone_config.code=newCode;
    phone_code.push({
        phone:phone_config.mobile,
        code:phone_config.code,
        state:-1//0为有效
    });
    //query_user_info(phone_config.get_user_info_uri,phone_config.apikey,res);
    switch (sendType){
        case 1://发送短信
            console.log("走到发送短信case1");
            send_sms(phone_config.send_sms_uri,phone_config.apikey,phone_config.mobile,phone_config.text,res);
            break;
        case 2://发送语音
            send_voice_sms(phone_config.send_voice_uri,phone_config.apikey,phone_config.mobile,phone_config.code,res);
            break;
    }
}
//设置登录密码
function PhoneSetPwd(userInfo,res){//{openId:,password:,bindingType:,bindingMsg:{phone:,}}
    let phone=userInfo.bindingMsg.phone;
    let openId=userInfo.openId;
    let code_hex=new Code(userInfo.password,"hex");
    let hex_password=code_hex.setCoding();
    userInfo.password=hex_password;
    UserService.updatePwdByOpenId(userInfo, function (result_1) {//设置登录密码
        if(result_1.state===0){
            UserService.getUserByOpenId(userInfo, function (user_result) {
                user_result.userInfo.password="********";
                result_user.result="ok";
                result_user.msg="setPwd";
                result_user.desc="登录密码设置成功,请重新登录";
                result_user.userInfo=user_result.userInfo;
                res.send(result_user);
                clearResultUser();
            })
        }else {
            console.log("用户登录密码设置失败");
        }
    });
}

function query_user_info(uri,apikey,res){
    var post_data = {
        'apikey': apikey,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    post(uri,content,phone_config.sms_host,res);
}
function send_sms(uri,apikey,mobile,text,res){
    var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'text':text,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    post(uri,content,phone_config.sms_host,res);
}
function send_voice_sms(uri,apikey,mobile,code,res){
    var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'code':code,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    console.log(content);
    post(uri,content,phone_config.voice_host,res);
}
function post(uri,content,host,next){
    var options = {
        hostname: host,
        port: 443,
        path: uri,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            let body=isAvailableData(chunk).data;
            if(body.code===0){
                console.log("发送成功");
                phone_code.forEach(function (phone_code_each) {
                    if(phone_code_each.phone===body.mobile){
                        phone_code_each.state=0;
                        next.send(phone_code_each);
                    }

                });
            }else {
                console.log("发送失败");
                phone_code.forEach(function (phone_code_each) {
                    if(phone_code_each.phone===body.mobile){
                        phone_code_each.state=-1;
                        next.send(phone_code_each);
                    }

                });
            }
        });
    });
    //console.log(content);
    req.write(content);

    req.end();
}
//--------------------------------------------------微信小游戏版登录---------------------------------------------------------------
//微信小游戏登录入口
function RegisterCode(userInfo,res) {
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
        res.send(JSON.stringify(result));
    });
}
exports.UserInfoRegister=function(req,res){//{bindingtype:,bindingMsg:{},app:,platform:,channel:,}
    console.log("UserInfoRegister-303");
    let clientUser=req.body;
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
            userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${data.openId}\\\",\\\"avatarUrl\\\":\\\"${data.avatarUrl}\\\"}`;
            console.log("UserServer-332:",userInfo.wx);
            userInfo.openId=openid_2;
            UserService.getUserByWx(userInfo, function (result) {
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
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            UserService.getUserByOpenId(userInfo, function (result_1) {
                                if(result_1.state===-1){
                                    result_user.result="error";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    res.send(result_user);
                                    clearResultUser();
                                }else {
                                    let time_2=new Date().getTime();
                                    let content_2=result_1.userInfo+"&"+time_2;
                                    let code_2=new Code(content_2,"base64");
                                    let accessToken_2=code_2.setCoding();
                                    accessTokenList.push({
                                        "openId":result_1.userInfo.openid,
                                        "access_token":accessToken_2,
                                        "accessState":0,//有效
                                        "accessTime":new Date().getTime()
                                    });
                                    result_1.userInfo.password="********";
                                    result_user.result="ok";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    result_user.userInfo=result_1.userInfo;
                                    result_user.access_token=accessToken_2;
                                    res.send(result_user);
                                    clearResultUser();
                                }
                            });
                        }
                    });
                }else {
                    let time_2=new Date().getTime();
                    let content_2=result.userInfo+"&"+time_2;
                    let code_2=new Code(content_2,"base64");
                    let accessToken_2=code_2.setCoding();
                    accessTokenList.push({
                        "openId":result.userInfo.openid,
                        "access_token":accessToken_2,
                        "accessState":0,//有效
                        "accessTime":new Date().getTime()
                    });
                    result.userInfo.password="********";
                    result_user.result="ok";
                    result_user.msg="register";
                    result_user.desc="用户已经存在不能重复注册,已经直接登录";
                    result_user.userInfo=result.userInfo;
                    result_user.access_token=accessToken_2;
                    res.send(result_user);
                    clearResultUser();
                }
            });

            break;
        }
    }
};
function LoginCode(userInfo,res) {
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
        res.send(JSON.stringify(result));
    });
}
exports.UserInfoLogin=function(req,res){//{bindingType:,email:,app:,platform:,channel:,password:,bindingMsg:{}}
    let clientUser=req.body;
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
            userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${data.openId}\\\",\\\"avatarUrl\\\":\\\"${data.avatarUrl}\\\"}`;
            userInfo.openId=openid_2;//跟微信openId一样唯一
            UserService.getUserByWx(userInfo, function (result) {
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
                            res.send(result_user);
                            clearResultUser();
                        }else {

                            UserService.getUserByOpenId(userInfo, function (result_1) {
                                if(result_1.state===-1){
                                    result_user.result="error";
                                    result_user.msg="login";
                                    result_user.desc=result_1.desc;
                                    res.send(result_user);
                                    clearResultUser();
                                }else {
                                    let time_2=new Date().getTime();
                                    let content_2=result_1.userInfo+"&"+time_2;
                                    let code_2=new Code(content_2,"base64");
                                    let accessToken_2=code_2.setCoding();
                                    accessTokenList.push({
                                        "openId":result_1.userInfo.openid,
                                        "access_token":accessToken_2,
                                        "accessState":0,//有效
                                        "accessTime":new Date().getTime()
                                    });
                                    result_1.userInfo.password="********";
                                    result_user.result="ok";
                                    result_user.msg="login";
                                    result_user.desc=result_1.desc;
                                    result_user.userInfo=result_1.userInfo;
                                    result_user.access_token=accessToken_2;
                                    res.send(result_user);
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
                        result.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="login";
                        result_user.desc=result.desc;
                        result_user.userInfo=result.userInfo;
                        result_user.access_token=accessToken_0;
                        res.send(result_user);
                        clearResultUser();
                    }else {
                        app_list.push(userInfo.app);
                        userInfo.app=app_list;
                        UserService.updateAppByOpenId(userInfo, function (result_app) {
                            if(result_app.state===-1){
                                result.userInfo.password="********";
                                result_user.result="error";
                                result_user.msg="login";
                                result_user.desc="更新app失败";
                                result_user.userInfo=result.userInfo;
                                res.send(result_user);
                                clearResultUser();
                            }else {
                                let time_0=new Date().getTime();
                                let content_0=result.userInfo+"&"+time_0;
                                let code_0=new Code(content_0,"base64");
                                let accessToken_0=code_0.setCoding();
                                accessTokenList.push({
                                    "openId":result.userInfo.openid,
                                    "access_token":accessToken_0,
                                    "accessState":0,//有效
                                    "accessTime":new Date().getTime()
                                });
                                result.userInfo.password="********";
                                result.userInfo.app=app_list;
                                result_user.result="ok";
                                result_user.msg="login";
                                result_user.desc=result.desc;
                                result_user.userInfo=result.userInfo;
                                result_user.access_token=accessToken_0;
                                res.send(result_user);
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
function LoginWx(userInfo,res) {
    let body=userInfo.bindingMsg;
    let wx_openid=body.openid;
    let wx_access_token=body.access_token;
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
        res.send(result);
    });
}
exports.userMsgRegister=function(req,res) {//{bindingtype:,bindingMsg:{body:},app:,platform:,channel:,}
    console.log("userMsg");

    var result_client=req.body;
    let userInfo=isAvailableData(result_client).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.platform=parseInt(userInfo.platform);
    userInfo.channel=parseInt(userInfo.channel);
    let userInfoBody=userInfo.bindingMsg;
    let wxBody=userInfoBody.body;//微信返回给客户端的信息

    let date=new _Date();
    let time=date._getDate();
    let code=new Code(wxBody.openid,"base64");
    let openId=code.setCoding();
    userInfo.openid=openId;
    userInfo.registertime=time;
    let code_nickname=new Code(wxBody.nickname,"hex");
    let nickname=code_nickname.setCoding();
    userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${wxBody.openid}\\\",\\\"avatarUrl\\\":\\\"${wxBody.headimgurl}\\\"}`;
    console.log("UserServer-669:",userInfo.wx);
    userInfo.openId=openId;
    UserService.getUserByWx(userInfo, function (result) {
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
                    res.send(result_user);
                    clearResultUser();
                }else {
                    UserService.getUserByOpenId(userInfo, function (result_1) {
                        if(result_1.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_1.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            let time_2=new Date().getTime();
                            let content_2=result_1.userInfo+"&"+time_2;
                            let code_2=new Code(content_2,"base64");
                            let accessToken_2=code_2.setCoding();
                            accessTokenList.push({
                                "openId":result_1.userInfo.openid,
                                "access_token":accessToken_2,
                                "accessState":0,//有效
                                "accessTime":new Date().getTime()
                            });
                            result_1.userInfo.password="********";
                            result_user.result="ok";
                            result_user.msg="register";
                            result_user.desc=result_1.desc;
                            result_user.userInfo=result_1.userInfo;
                            result_user.access_token=accessToken_2;
                            res.send(result_user);
                            clearResultUser();
                        }
                    });
                }
            });
        }else {
            let time_2=new Date().getTime();
            let content_2=result.userInfo+"&"+time_2;
            let code_2=new Code(content_2,"base64");
            let accessToken_2=code_2.setCoding();
            accessTokenList.push({
                "openId":result.userInfo.openid,
                "access_token":accessToken_2,
                "accessState":0,//有效
                "accessTime":new Date().getTime()
            });
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="register";
            result_user.desc="用户已经存在不能重复注册,已经直接登录";
            result_user.access_token=accessToken_2;
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });

};
exports.userMsgLogin=function(req,res) {//{bindingtype:,bindingMsg:{body:},app:,platform:,channel:,}
    console.log("userMsg");

    var result_client=req.body;
    let userInfo=isAvailableData(result_client).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    userInfo.platform=parseInt(userInfo.platform);
    userInfo.channel=parseInt(userInfo.channel);
    let userInfoBody=userInfo.bindingMsg;
    let wxBody=userInfoBody.body;//微信返回给客户端的信息

    let date=new _Date();
    let time=date._getDate();
    let code=new Code(wxBody.openid,"base64");
    let openId=code.setCoding();
    userInfo.openid=openId;
    userInfo.registertime=time;
    let code_nickname=new Code(wxBody.nickname,"hex");
    let nickname=code_nickname.setCoding();
    userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${wxBody.openid}\\\",\\\"avatarUrl\\\":\\\"${wxBody.headimgurl}\\\"}`;
    console.log("UserServer-669:",userInfo.wx);
    userInfo.openId=openId;
    UserService.getUserByWx(userInfo, function (result) {
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
                    result_user.msg="login";
                    result_user.desc=result_recall.desc;
                    res.send(result_user);
                    clearResultUser();
                }else {
                    UserService.getUserByOpenId(userInfo, function (result_1) {
                        if(result_1.state===-1){
                            result_user.result="error";
                            result_user.msg="login";
                            result_user.desc=result_1.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            let time_2=new Date().getTime();
                            let content_2=result_1.userInfo+"&"+time_2;
                            let code_2=new Code(content_2,"base64");
                            let accessToken_2=code_2.setCoding();
                            accessTokenList.push({
                                "openId":result_1.userInfo.openid,
                                "access_token":accessToken_2,
                                "accessState":0,//有效
                                "accessTime":new Date().getTime()
                            });
                            result_1.userInfo.password="********";
                            result_user.result="ok";
                            result_user.msg="login";
                            result_user.desc=result_1.desc;
                            result_user.userInfo=result_1.userInfo;
                            result_user.access_token=accessToken_2;
                            res.send(result_user);
                            clearResultUser();
                        }
                    });
                }
            });
        }else {
            let time_2=new Date().getTime();
            let content_2=result.userInfo+"&"+time_2;
            let code_2=new Code(content_2,"base64");
            let accessToken_2=code_2.setCoding();
            accessTokenList.push({
                "openId":result.userInfo.openid,
                "access_token":accessToken_2,
                "accessState":0,//有效
                "accessTime":new Date().getTime()
            });
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="login";
            result_user.desc="用户已经存在不能重复注册,已经直接登录";
            result_user.userInfo=result.userInfo;
            result_user.access_token=accessToken_2;
            res.send(result_user);
            clearResultUser();
        }
    });

};
exports.getBindingWx= function (req,res) {//{openId:,bindingType:3,bindingMsg:{body:}}
    var result_client=req.body;
    let userInfo=isAvailableData(result_client).data;
    userInfo.bindingType=parseInt(userInfo.bindingType);
    userInfo.bindingMsg=isAvailableData(userInfo.bindingMsg).data;
    let userInfoBody=userInfo.bindingMsg;
    let wxBody=userInfoBody.body;//微信返回给客户端的信息
    let code_nickname=new Code(wxBody.nickname,"hex");
    let nickname=code_nickname.setCoding();
    userInfo.wx=`{\\\"nickName\\\":\\\"${nickname}\\\",\\\"openId\\\":\\\"${wxBody.openid}\\\"}`;
    UserService.getUserByWx(userInfo, function (result) {
        if(result.state===-1){
            UserService.updateWxByOpenId(userInfo, function (result_1) {
                if(result_1.state===0){
                    UserService.getUserByPhone(userInfo, function (result_2) {
                        result_2.userInfo.password="********";
                        result_user.result="ok";
                        result_user.msg="binding";
                        result_user.desc="绑定成功";
                        result_user.userInfo=result_2.userInfo;
                        res.send(result_user);
                        clearResultUser();
                    });
                }else {
                    console.log("微信绑定失败");
                }
            })
        }else {
            result.userInfo.password="********";
            result_user.result="ok";
            result_user.msg="binding";
            result_user.desc="已经绑定过，不能绑定多个账号";
            result_user.userInfo=result.userInfo;
            res.send(result_user);
            clearResultUser();
        }
    });

};

//-------------------------------------------------qq登录-------------------------------------------------
function LoginQQ(userInfo,res) {
    let body=userInfo.bindingMsg;
    let openid=body.openid;
    let access_token=body.access_token;
    let user=body.userInfo;
    console.log("qq_userInfo:",openid);
    request({
        method: 'post',
        form: { key: 'value' },
        url: "http://ysdk.qq.com/auth/qq_check_token?openid=" + openid + "&openkey=" + access_token
    }, function(err, res1, body){
        //用户服务器返回的数值
        console.log("QQ返回的信息：",res1.body);
        if(true){
            let date_2=new _Date();
            let time_2=date_2._getDate();
            let content_2=openid;
            let code_2=new Code(content_2,"base64");
            let openid_2=code_2.setCoding();
            userInfo.openid=openid_2;
            userInfo.registertime=time_2;
            let code_nickname=new Code(user.nickname,"hex");
            let nickname=code_nickname.setCoding();
            userInfo.qq=`{'nickName':'${nickname}','openId':'${openid}','avatarUrl':'${user.figureurl}'}`;
            userInfo.openId=openid_2;
            UserService.getUserByQQ(userInfo, function (result) {
                if(result.state===-1){
                    //uid
                    let _uid_2=Math.ceil(Math.random()*100000);
                    let uid=nickname+"_"+_uid_2;
                    userInfo.uid=uid;
                    UserService.addUser(userInfo,function (result_recall) {
                        if(result_recall.state===-1){
                            result_user.result="error";
                            result_user.msg="register";
                            result_user.desc=result_recall.desc;
                            res.send(result_user);
                            clearResultUser();
                        }else {
                            UserService.getUserByOpenId(userInfo, function (result_1) {
                                if(result_1.state===-1){
                                    result_user.result="error";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    res.send(result_user);
                                    clearResultUser();
                                }else {
                                    console.log("查找到该用户的信息");
                                    let time_2=new Date().getTime();
                                    let content_2=result_1.userInfo+"&"+time_2;
                                    let code_2=new Code(content_2,"base64");
                                    let accessToken_2=code_2.setCoding();
                                    accessTokenList.push({
                                        "openId":result_1.userInfo.openid,
                                        "access_token":accessToken_2,
                                        "accessState":0,//有效
                                        "accessTime":new Date().getTime()
                                    });
                                    result_1.userInfo.password="********";
                                    result_user.result="ok";
                                    result_user.msg="register";
                                    result_user.desc=result_1.desc;
                                    result_user.userInfo=result_1.userInfo;
                                    result_user.access_token=accessToken_2;
                                    console.log("*************",res);
                                    res.send(result_user);
                                    clearResultUser();
                                }
                            });
                        }
                    });
                }else {
                    console.log("用户已经存在不能重复注册");
                    let time_2=new Date().getTime();
                    let content_2=result.userInfo+"&"+time_2;
                    let code_2=new Code(content_2,"base64");
                    let accessToken_2=code_2.setCoding();
                    accessTokenList.push({
                        "openId":result.userInfo.openid,
                        "access_token":accessToken_2,
                        "accessState":0,//有效
                        "accessTime":new Date().getTime()
                    });
                    result.userInfo.password="********";
                    result_user.result="ok";
                    result_user.msg="register";
                    result_user.desc="用户已经存在不能重复注册,已经直接登录";
                    result_user.userInfo=result.userInfo;
                    result_user.access_token=accessToken_2;
                    console.log("用户已经存在不能重复注册;",result_user);
                    res.send(result_user);
                    //console.log("*************",res);
                    console.log("用户已经存在不能重复注册end");
                    clearResultUser();
                }
            });
        }
    });
}
/*exports.getQQData= function (req,res) {

};*/

