/**
 * Created by Administrator on 2018/8/8.
 */
/*
 const fs = require('fs')
 const async_hooks = require('async_hooks');

 async_hooks.createHook({
 init (asyncId, type, triggerAsyncId, resource) {
 fs.writeSync(1, `${type}(${asyncId}): trigger: ${triggerAsyncId}\n`)
 },
 destroy (asyncId) {
 fs.writeSync(1, `destroy: ${asyncId}\n`);
 }
 }).enable()

 async function A () {
 fs.writeSync(1, `A -> ${async_hooks.executionAsyncId()}\n`)
 setTimeout(() => {
 fs.writeSync(1, `A in setTimeout -> ${async_hooks.executionAsyncId()}\n`)
 B()
 })
 }

 async function B () {
 fs.writeSync(1, `B -> ${async_hooks.executionAsyncId()}\n`)
 process.nextTick(() => {
 fs.writeSync(1, `B in process.nextTick -> ${async_hooks.executionAsyncId()}\n`)
 C()
 C()
 })
 }

 function C () {
 fs.writeSync(1, `C -> ${async_hooks.executionAsyncId()}\n`)
 Promise.resolve().then(() => {
 fs.writeSync(1, `C in promise.then -> ${async_hooks.executionAsyncId()}\n`)
 })
 }

 fs.writeSync(1, `top level -> ${async_hooks.executionAsyncId()}\n`)
 A()*/
/*
var https=require('https');
var qs=require('querystring');

var apikey='e83880957cfab23509a4c64a53d04b9a';

var mobile='16622157524';



// 指定发送的模板编号
//var tpl_id = 1;
var newCode="";
for(let i=0;i<4;i++){
    newCode=newCode+Math.floor(Math.random()*10);
}
console.log(newCode);
// 修改为您要发送的短信内容
var text = `【吴世超】您的验证码是${newCode}。如非本人操作，请忽略本短信`;
// 指定发送模板的内容
//var tpl_value =  {'#code#':newCode};
// 语音短信的内容
var code = newCode;
// 查询账户信息https地址
var get_user_info_uri = '/v2/user/get.json';
// 智能匹配模板发送https地址
var sms_host = 'sms.yunpian.com';
var voice_host = 'voice.yunpian.com';

send_sms_uri = '/v2/sms/single_send.json';
// 指定模板发送接口https地址
send_tpl_sms_uri = '/v2/sms/tpl_single_send.json';
// 发送语音验证码接口https地址
send_voice_uri = '/v2/voice/send.json';





query_user_info(get_user_info_uri,apikey);

send_sms(send_sms_uri,apikey,mobile,text);

//send_tpl_sms(send_tpl_sms_uri,apikey,mobile,tpl_id,tpl_value);//短信模板模式

//send_voice_sms(send_voice_uri,apikey,mobile,code);//
function query_user_info(uri,apikey){
    var post_data = {
        'apikey': apikey,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    post(uri,content,sms_host);
}

function send_sms(uri,apikey,mobile,text){
    var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'text':text,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    post(uri,content,sms_host);
}

function send_tpl_sms(uri,apikey,mobile,tpl_id,tpl_value){
    var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'tpl_id':tpl_id,
        'tpl_value':qs.stringify(tpl_value),
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    post(uri,content,sms_host);
}
function send_voice_sms(uri,apikey,mobile,code){
    var post_data = {
        'apikey': apikey,
        'mobile':mobile,
        'code':code,
    };//这是需要提交的数据
    var content = qs.stringify(post_data);
    console.log(content);
    post(uri,content,voice_host);
}
function post(uri,content,host){
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
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            console.log("chunk typeof:",typeof chunk)
        });
    });
    //console.log(content);
    req.write(content);

    req.end();
}*/
/*var iconv = require("iconv-lite");
var URLSafeBase64=require('url-safe-base64');
let facebook_result='rBQJ-j-bqdp7DkIr60HvD7o38M_klVwssVSjHSTSIoE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTUzNDMyNjA5NSwicGxheWVyX2lkIjoiMjE1MDMwNjM3ODM0NDI2MiIsInJlcXVlc3RfcGF5bG9hZCI6bnVsbH0';
let result_list=facebook_result.split(".");
console.log(result_list[0].length%3);
//URLSafeBase64.trim(result_list[0]);
let base=URLSafeBase64.decode(result_list[0]);
console.log("base:",URLSafeBase64.isUrlSafeBase64(result_list[0]));
let buf=new Buffer(base,"base64");
let decode_firstPart=buf.toString("UCS2");

console.log(decode_firstPart);*/
/*
var everyauth = require('everyauth');

everyauth.facebook
    .appId('685324398548088')
    .appSecret('95a8a1d030f354a035c3ae2bebf28dbf')
    .handleAuthCallbackError( function (req, res) {
        // If a user denies your app, Facebook will redirect the user to
        // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
        // This configurable route handler defines how you want to respond to
        // that.
        // If you do not configure this, everyauth renders a default fallback
        // view notifying the user that their authentication failed and why.
    })
    .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
        // find or create user logic goes here
    })
    .redirectPath('https://m5.ykplay.com/facebook');

*/


/*var routes = function (app) {
    // Define your routes here
};

connect(
    connect.bodyParser()
    , connect.cookieParser()
    , connect.session({secret: 'whodunnit'})
    , everyauth.middleware()
    , connect.router(routes)
).listen(3000);*/

console.log(JSON.parse(`{\\"nickName\\":\\"e58e9ff09f9293e684bf\\",\\"openId\\":\\"7561AE716BD6A9413416271DB8A816E0\\",\\"avatarUrl\\":\\"http://qzapp.qlogo.cn/qzapp/1106774691/7561AE716BD6A9413416271DB8A816E0/30\\"}`))