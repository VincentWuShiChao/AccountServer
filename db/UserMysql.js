/**
 * Created by Administrator on 2018/7/29.
 */
/**
 * Created by Administrator on 2018/7/28.
 */
var mysql=require('mysql');

var _Date=require("../utils/Date");
var conn_pool=mysql.createPool({
    host:"127.0.0.1" ,
    port:3306,
    database:"accountmysql",
    user:"root",
    password:"03251222yxn"
});
function isAvailableData(data){
    console.log("进入isAvailableData方法");
    if(data instanceof Object){
        console.log("14:",data);
        return {encode:0,data:data};

    }else{
        console.log("========================:",typeof data);
        try{
            //console.log("25:",typeof JSON.parse(data));
            data=JSON.parse(data);
            console.log("27:",typeof data);
            return {encode:0,data:data};
        }catch (err){
            console.log("23:",err);
            return {encode:-1,data:data}
        }
    }
}
function mysql_exce(sql,callback){
    conn_pool.getConnection(function (err,conn) {
        if(err){
            console.log("连接数据库失败",err);
            return;
        }else {
            console.log("连接数据库成功");
            conn.query(sql, function (sql_err,sql_result,fields_desic) {
                if(sql_err){
                    if(callback){
                        callback(sql_err,null,null);
                        conn.release();
                    }
                    return;
                }
                if(callback){
                    callback(null,sql_result,fields_desic);
                    conn.release();
                }
            });
        }


    });
}
function disAmend(sql,data){
    return sql+" and "+data;
}
//用户第一次手机登录，将用户信息保存到数据库
exports.addUser= function (userInfo,callback) {//{uid:,openid:,bindingType:,email:,app:,platform:,channel:,bindingMsg:{}}
    let bindingType=userInfo.bindingType;
    let appList=[];
    appList.push(userInfo.app);
    appList.push("h1v2");
    switch (bindingType){
        case 0://普通用户bindingMsg:{uname:,password:,}
            let sql_0=`insert into user(uid,openid,uname,password,registertime,app,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}","${userInfo.bindingMsg.uname}","${userInfo.bindingMsg.password}","${userInfo.registertime}","${appList}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-68:",sql_0);
            mysql_exce(sql_0, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
        case 1://微信小游戏
            let sql_1=`insert into user(uid,openid,registertime,app,wx,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}",\
     "${userInfo.registertime}","${appList}","${userInfo.wx}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-68:",sql_1);
            mysql_exce(sql_1, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
        case 2://手机用户
            let sql_2=`insert into user(uid,openid,phone,registertime,app,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}","${userInfo.bindingMsg.phone}","${userInfo.registertime}","${appList}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-68:",sql_2);
            mysql_exce(sql_2, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
        case 3://原版微信用户

            let sql_3=`insert into user(uid,openid,registertime,app,wx,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}",\
     "${userInfo.registertime}","${appList}","${userInfo.wx}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-68:",sql_3);
            mysql_exce(sql_3, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
        case 4:
            let sql_4=`insert into user(uid,openid,registertime,app,qq,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}",\
     "${userInfo.registertime}","${appList}","${userInfo.qq}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-126:",sql_4);
            mysql_exce(sql_4, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
        case 5://
            let sql_5=`insert into user(uid,openid,registertime,app,xl,platform,channel)\
     values("${userInfo.uid}","${userInfo.openid}",\
     "${userInfo.registertime}","${appList}","${userInfo.xl}",${userInfo.platform},${userInfo.channel})`;
            console.log("UserMysql-126:",sql_5);
            mysql_exce(sql_5, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
    }

};
exports.addUserRegister= function (userInfo,callback) {//邮箱
    let bindingType=userInfo.bindingType;
    let appList=[];
    appList.push(userInfo.app);
    appList.push("h1v2");
    bindingType=parseInt(bindingType);
    switch (bindingType){
        case 5:
            let sql_0=`insert into user(uid,openid,password,registertime,app,platform,channel,email)\
     values("${userInfo.uid}","${userInfo.openid}","${userInfo.password}","${userInfo.registertime}","${appList}",${userInfo.platform},${userInfo.channel},"${userInfo.bindingMsg.email}")`;
            console.log("UserMysql-68:",sql_0);
            mysql_exce(sql_0, function (err,sql_result,fields_desic) {
                if(err){
                    console.log(err);
                    callback(err,null);
                }else {
                    callback(null,sql_result);
                }
            });
            break;
    }

};
exports.getUserByOpenId=function (userInfo,callback) {////userInfo:{uname:,password（hex）:}
    var sql=disAmend(`select * from user where 1=1`,`openid="${userInfo.openId}"`) ;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,sql_result);
        }
    })
};
exports.getUserPwdByOpenId= function (userInfo,callback) {
    var sql=disAmend(`select password from user where 1=1`,`openid="${userInfo.openId}"`);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,sql_result);
        }
    })
};

//----------------------------------------------------------------邮箱--------------------------------------------------------------
exports.getUserByEmail= function (userInfo,callback) {////userInfo:{email:}
    let email=userInfo.email;
    var sql=disAmend(`select * from user where 1=1`,`email="${email}"`);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,sql_result);
        }
    })
};
exports.getUserByEmailAndPwd= function (userInfo,callback) {
    let email=userInfo.bindingMsg.email;
    let password=userInfo.bindingMsg.password;
    let sql=`select * from user where email="${email}" and password="${password}"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.updatePwdByOpenId=function (userInfo,callback) {
    let openId=userInfo.openId;
    let password=userInfo.password;
    let sql=`update user set password="${password}" where openid="${openId}"`;
    console.log("UserMysql-197:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.updateEmailByOpenId= function (userInfo,callback) {
    let openId=userInfo.openId;
    let email=userInfo.bindingMsg.email;
    let sql=`update user set email="${email}" where openid="${openId}"`;
    console.log("UserMysql-197:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.dropUserByEmail=function (userInfo,callback) {
    let email=userInfo.bindingMsg.email;
    let sql=`delete from user where email="${email}"`;
    console.log("UserMysql-197:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
//--------------------------------------------------------------普通用户---------------------------------------------------------
//根据用户名获取用户信息
exports.getUserByName= function (userInfo,callback) {////userInfo:{uname:,password（hex）:}
    let uname=userInfo.uname;
    let password=userInfo.password;
    var sql="select * from user where uname=\""+uname+"\"";
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,sql_result);
        }
    })
};
exports.getUserByNameAndPassWord= function (userInfo,callback) {////userInfo:{uname:,password（hex）:}
    let uname=userInfo.uname;
    let password=userInfo.password;
    console.log("==========================156:",password);
    var sql="select * from user where uname=\""+uname+"\" and password=\""+password+"\"";
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,sql_result);
        }
    })
};
exports.updateApp= function (userInfo,callback) {
    let appList=userInfo.app;
    let sql=`update user set app="${appList}" where uname="${userInfo.bindingMsg.uname}"`;
    console.log("UserMysql-68:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
//--------------------------------------------------------------手机号用户------------------------------------------------------
exports.getUserByPhone= function (userInfo,callback) {
    let phone=userInfo.bindingMsg.phone;
    let sql=`select * from user where phone="${phone}"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.getUserByPhoneAndPwd= function (userInfo,callback) {
    let phone=userInfo.bindingMsg.phone;
    let password=userInfo.bindingMsg.password;
    let sql=`select * from user where phone="${phone}" and password="${password}"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.updatePhoneByOpenId= function (userInfo,callback) {
    let openId=userInfo.openId;
    let phone=userInfo.bindingMsg.phone;
    let sql=`update user set phone="${phone}" where openid="${openId}"`;
    console.log("UserMysql-197:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
//----------------------------------------------------------------微博----------------------------------------------------------------
exports.getUserByWb=function (userInfo,callback) {
    let xl=isAvailableData(userInfo.xl).data;
    console.log(typeof xl);
    let idstr=xl.idstr;
    console.log("UserMysql-143:",idstr);
    var sql=`select * from user where xl like "%${idstr}%"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
//--------------------------------------------------------------qq用户--------------------------------
exports.getUserByQQ= function (userInfo,callback) {
    let openId=userInfo.qq.split(",")[1].split(":")[1];
    console.log("UserMysql-143:",openId);
    var sql=`select * from user where qq like "%${openId}%"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
//--------------------------------------------------------------微信用户--------------------------------------------------------------
exports.getUserByWx= function (userInfo,callback) {
    let wx=isAvailableData(userInfo.wx).data;
    console.log(typeof wx);
    let openId=wx.openId;
    console.log("UserMysql-143:",openId);
    var sql=`select * from user where wx like "%${openId}%"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.updateWxByOpenId=function (userInfo,callback) {
    let openId=userInfo.openId;
    let wx=userInfo.wx;
    let sql=`update user set wx="${wx}" where openid="${openId}"`;
    console.log("UserMysql-226:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
};
exports.updateAppByOpenId= function (userInfo,callback) {
    let appList=userInfo.app;
    let sql=`update user set app="${appList}" where openid="${userInfo.openid}"`;
    console.log("UserMysql-68:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        if(err){
            console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }
    });
}


























//根据用户名获取用户信息
exports.getPlayerByName= function (name,callback) {
    console.log("mysql_user.js/getUserByName");
    var sql="select * from player where name=\""+name+"\"";
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            //console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }

    })
};
//根据用户名获取用户信息(微信小游戏版本)
exports.getPlayerByOpenId= function (openid,callback) {
    console.log("mysql_user.js/getUserByOpenid");
    console.log("UserMysql-75:",openid);
    var sql="select * from player where openid=\""+openid+"\"";
    console.log("UserMysql-77:",sql);
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            //console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }

    })
};

//获取所有玩家的所有数据
exports.getAllPlayer= function (callback) {
    var sql="select * from player";
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            //console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }

    })
};
//根据用户的pid获取信息
exports.getPlayerByPid= function (pid,callback) {
    var sql="select * from player where pid="+pid;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            //console.log(err);
            callback(err,null);
        }else {
            callback(null,sql_result);
        }

    })
};

//修改用户的信息
exports.updatePlayer= function (pid,name,integral,universal,time,logintype,level,exper,callback) {
    console.log("universal:",universal);
    console.log((JSON.parse(universal)).victory);
    universal=JSON.parse(universal);
    console.log("pid:",pid);
    //var sql="update player set name=\""+name+"\",integral="+integral+",universal=\"\""+universal+"\"\",time=\""+time+"\",logintype="+logintype+",level="+level+",exper="+exper+" where pid="+pid;
    var sql=`update player set name="${name}",universal="{\\\"victory\\\":${universal.victory},\\\"games\\\":${universal.games}}",integral=${integral},time=${time},logintype=${logintype},level=${level},exper=${exper} where pid=${pid}`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            //console.log(err);
            callback(err,null);
        }else {
            callback(null,{msg:1});
        }

    });
};
//修改用户的信息(微信小游戏版本)
exports.updatePlayerName= function (openid,name,callback) {
    //var sql="update player set name=\""+name+"\",integral="+integral+",universal=\"\""+universal+"\"\",time=\""+time+"\",logintype="+logintype+",level="+level+",exper="+exper+" where pid="+pid;
    var sql=`update player set name="${name}" where openid="${openid}"`;
    mysql_exce(sql, function (err,sql_result,fields_desic) {
        console.log("sql_result:",sql_result);
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            callback(null,{msg:1});
        }

    });
};
//更新胜利用户的积分以及场数
exports.updateIntegral_victory= function (name,integral,victory,games,callback) {
    var sql1=`update player set integral=${integral},universal="{\\\"victory\\\":${victory},\\\"games\\\":${games}}" where name="${name}"`;
    console.log(sql1);
    // var sql="update player set integral="+integral+",universal=json_set('{\"victory\":0,\"games\":0}','$.victory',"+victory+",'$.games',"+games+")"+" where name=\""+name+"\"";
    mysql_exce(sql1, function (err,sql_result,fields_desic) {
        if(err){
            callback(err,null);
        }
        callback(null,sql_result);
    });
};
//更新失败用户的积分以及场数
exports.updateIntegral_loser= function (name,integral,victory,games,callback) {
    var sql2=`update player set integral=${integral},universal="{\\\"victory\\\":${victory},\\\"games\\\":${games}}" where name="${name}"`;
    console.log(sql2);
    //var sql="update player set integral="+integral+",universal=json_set('{\"victory\":0,\"games\":0}','$.victory',"+victory+",'$.games',"+games+")"+" where name=\""+name+"\"";
    mysql_exce(sql2, function (err,sql_result,fields_desic) {
        console.log("^^^^^^^^^^^^^^^^^:",sql_result);
        if(err){
            callback(err,null);
        }
        callback(null,sql_result);
    });
};

