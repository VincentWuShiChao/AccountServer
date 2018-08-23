/**
 * Created by Administrator on 2018/8/13.
 */
var nodemailer=require('nodemailer');

//创建一个SMTP客户端配置
var config={
    host:'smtp.126.com',
    port:25,
    auth:{
        user:'vincent_wsc@126.com',
        pass:'03251222yxn'
    }
};

//创建一个SMTP客户端对象
var transporter=nodemailer.createTransport(config);
//发送邮件
module.exports= function (mail) {
    transporter.sendMail(mail, function (error,info) {
        if(error){
            return console.log(error);
        }
        console.log("mail sent:",info.response);
    });
};