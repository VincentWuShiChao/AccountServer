/**
 * Created by Administrator on 2018/7/29.
 */
var UserDao=require('../models/UserDao');
var result={
    "state":0,
    "userInfo":"",
    "desc":""
};
var publicUserDao=new UserDao({
 openid:"",
 phone:"",
 qq:"",
 wx:"",
 xl:"",
 email:"",
 app:"",
 platform:"",
 channel:"",
 password:"",
 registertime:""
 });
exports.addUser= function (userInfo,callback) {//{uid:,openid:,bindingtype:,email:,app:,platform:,channel:,bindingMsg:{}}

    publicUserDao.addUser(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "添加失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "添加成功";
            callback(result);
        }
    });
};
exports.addUserRegister= function (userInfo,callback) {//{password:,uid:,openid:,bindingtype:,email:,app:,platform:,channel:,bindingMsg:{}}

    publicUserDao.addUserRegister(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "添加失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "添加成功";
            callback(result);
        }
    });
};
exports.getUserByOpenId= function (userInfo,callback) {
    publicUserDao.getUserByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "没有该用户";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "存在该用户";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    });
};
exports.getUserPwdByOpenId=function (userInfo,callback) {
    publicUserDao.getUserPwdByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "没有该用户";
            callback(result);
        } else if(user_result.state===0){
            result.state = 0;
            result.desc = "请设置登录密码";
            result.userInfo = user_result.userInfo;
            callback(result);
        }else if(user_result.state===1){
            result.state = 1;
            result.desc = "已经设置登录密码";
            result.userInfo = user_result.userInfo;
            callback(result);
        }
    });
};
//-----------------------------------------------------------------------微博-----------------------------------------------------
exports.getUserByWb= function (userInfo,callback) {
    publicUserDao.getUserByWb(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
}
//-----------------------------------------------------------------------邮箱-------------------------------------------------------
exports.getUserByEmail= function (userInfo,callback) {//userInfo:{email:};
    publicUserDao.getUserByEmail(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })

};
exports.updatePwdByOpenId=function (userInfo,callback) {//userInfo:{password:,openId};
    publicUserDao.updatePwdByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    })

};
exports.updateEmailByOpenId=function (userInfo,callback) {
    publicUserDao.updateEmailByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
};
exports.getUserByEmailAndPwd= function (userInfo,callback) {
    publicUserDao.getUserByEmailAndPwd(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.dropUserByEmail=function (userInfo,callback) {
    publicUserDao.dropUserByEmail(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
};
//-----------------------------------------------------------------------普通用户-----------------------------------------------------------
exports.getUserByName= function (userInfo,callback){ //userInfo:{uname:,password（hex）:}
    publicUserDao.getUserByName(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.getUserByNameAndPassWord= function (userInfo,callback){ //userInfo:{uname:,password（hex）:}
    publicUserDao.getUserByNameAndPassWord(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.updateApp= function (userInfo,callback) {
    publicUserDao.updateApp(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
};
//----------------------------------------------------------------------手机号用户---------------------------------------------------
exports.getUserByPhone= function (userInfo,callback) {
    publicUserDao.getUserByPhone(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.getUserByPhoneAndPwd= function (userInfo,callback) {
    publicUserDao.getUserByPhoneAndPwd(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.updatePhoneByOpenId= function (userInfo,callback) {
    publicUserDao.updatePhoneByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
};
//---------------------------------------------------------------------QQ用户------------------------------------
exports.getUserByQQ= function (userInfo,callback) {
    publicUserDao.getUserByQQ(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
}
//----------------------------------------------------------------------微信用户-----------------------------------------------------
exports.getUserByWx= function (userInfo,callback) {
    publicUserDao.getUserByWx(userInfo, function (user_result) {
        if(user_result.state===-1){
            result.state=-1;
            result.desc="用户不存在";
            callback(result);
        }else if(user_result.state===0){
            result.state=0;
            result.desc="用户存在";
            result.userInfo=user_result.userInfo;
            callback(result);
        }
    })
};
exports.updateWxByOpenId= function (userInfo,callback) {
    publicUserDao.updateWxByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
}
exports.updateAppByOpenId= function (userInfo,callback) {
    publicUserDao.updateAppByOpenId(userInfo, function (user_result) {
        if (user_result.state === -1) {
            result.state = -1;
            result.desc = "修改失败";
            callback(result);
        } else {
            result.state = 0;
            result.desc = "修改成功";
            callback(result);
        }
    });
};
