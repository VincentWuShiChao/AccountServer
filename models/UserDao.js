/**
 * Created by Administrator on 2018/7/29.
 */
var UserMysql=require('../db/UserMysql');
var UserResult={
    "state":0,
    "userInfo":{}
}

class User{
    constructor(user){
        this.openid=user.openid;
        this.phone=user.phone;
        this.qq=user.qq;
        this.wx=user.wx;
        this.xl=user.xl;
        this.email=user.email;
        this.app=user.app;
        this.platform=user.platform;
        this.channel=user.channel;
        this.password=user.password;
        this.registertime=user.registertime;

    }
    addUser(userInfo,callback){//{uid:,openid:,bindingtype:,email:,app:,platform:,channel:,bindingMsg:{}}
        UserMysql.addUser(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="添加用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="添加用户成功";
                callback(UserResult);
            }
        });
    }
    addUserRegister(userInfo,callback){//{password:,uid:,openid:,bindingtype:,email:,app:,platform:,channel:,bindingMsg:{}}
        UserMysql.addUserRegister(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="添加用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="添加用户成功";
                callback(UserResult);
            }
        });
    }
    getUserByOpenId(userInfo,callback){//
        UserMysql.getUserByOpenId(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        });
    }
    getUserPwdByOpenId(userInfo,callback){//
        UserMysql.getUserPwdByOpenId(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                if(return_result[0].password===null){
                    UserResult.state=0;
                    console.log("还未设置登录密码");
                    UserResult.userInfo=return_result[0];
                    callback(UserResult);
                }else {
                    UserResult.state=1;
                    console.log("已经设置登录密码");
                    UserResult.userInfo=return_result[0];
                    callback(UserResult);
                }

            }
        });
    }

    //--------------------------------------------------------邮箱-------------------------------------------------------------
    getUserByEmail(userInfo,callback){
        UserMysql.getUserByEmail(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    updatePwdByOpenId(userInfo,callback){
        UserMysql.updatePwdByOpenId(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    updateEmailByOpenId(userInfo,callback){
        UserMysql.updateEmailByOpenId(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    getUserByEmailAndPwd(userInfo,callback){
        UserMysql.getUserByEmailAndPwd(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    dropUserByEmail(userInfo,callback){
        UserMysql.dropUserByEmail(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    //------------------------------------------------------普通用户--------------------------------------------------------------

    getUserByName(userInfo,callback){//userInfo:{uname:,password（hex）:}
        UserMysql.getUserByName(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    getUserByNameAndPassWord(userInfo,callback){//userInfo:{uname:,password（hex）:}
        UserMysql.getUserByNameAndPassWord(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    updateApp(userInfo,callback){
        UserMysql.updateApp(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    //---------------------------------------------手机用户------------------------------
    getUserByPhone(userInfo,callback){
        UserMysql.getUserByPhone(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    getUserByPhoneAndPwd(userInfo,callback){
        UserMysql.getUserByPhoneAndPwd(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    updatePhoneByOpenId(userInfo,callback){
        UserMysql.updatePhoneByOpenId(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    //-----------------------------------------------微博------------------------------
    getUserByWb(userInfo,callback){
        UserMysql.getUserByWb(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    //-----------------------------------------------qq用户------------------------------
    getUserByQQ(userInfo,callback){
        UserMysql.getUserByQQ(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    //----------------------------------------------微信用户-----------------------------
    getUserByWx(userInfo,callback){
        UserMysql.getUserByWx(userInfo, function (err,return_result) {
            if(err){
                console.log("查找失败");
            }else if(return_result.length===0){
                UserResult.state=-1;
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                console.log("用户存在");
                UserResult.userInfo=return_result[0];
                callback(UserResult);
            }
        })
    }
    updateWxByOpenId(userInfo,callback){
        UserMysql.updateWxByOpenId(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    updateAppByOpenId(userInfo,callback){
        UserMysql.updateAppByOpenId(userInfo, function (err,return_result) {
            if(err){
                UserResult.state=-1;
                UserResult.desc="修改用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="修改用户成功";
                callback(UserResult);
            }
        });
    }
    /*addUserWx(callback){
        UserService.addUserWx(this, function (return_result) {
            if(return_result.state==-1){

                UserResult.state=-1;
                UserResult.desc="添加用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="添加用户成功";
                callback(UserResult);
            }
        });
    }
    getUserByPhone(userInfo,callback){
        UserService.getUserByPhone(userInfo, function (return_result) {
            if(return_result.state==-1){
                UserResult.state=-1;
                UserResult.desc="用户不存在";
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="用户存在";
                console.log("用户存在");
                UserResult.userInfo=return_result.userInfo;
                callback(UserResult);
            }
        })
    }*/


    /*
    getUserByOpenId(openId,callback){
        UserService.getUserByOpenId(openId, function (return_result) {
            if(return_result.state==-1){
                UserResult.state=-1;
                UserResult.desc="用户不存在";
                console.log("用户不存在");
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="用户存在";
                console.log("用户存在");
                UserResult.userInfo=return_result.userInfo;
                callback(UserResult);
            }
        })
    }

    addPhoneUser(userInfo,callback){
        UserService.addPhoneUser(userInfo, function (return_result) {
            if(return_result.state==-1){
                UserResult.state=-1;
                UserResult.desc="添加手机用户失败";
                callback(UserResult);
            }else{
                UserResult.state=0;
                UserResult.desc="添加手机用户成功";
                callback(UserResult);
            }
        })
    }
    addWxUser(userInfo,callback){
        UserService.addWxUser(userInfo, function (return_result) {
            
        })
    }
*/

}


module.exports=User;