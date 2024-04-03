/*

#!name = 科丝美诗小程序签到
#!desc = 脚本支持获取Cookie，兼容QX & Loon & Surge
#!author = lbqmy2022
#!icon = https://raw.githubusercontent.com/githubacct001/QuantumultX/master/icon/ksms.png
#!date = 2024/04/03 13:50

[Script]
# 定时脚本
cron "0 8 * * *" script-path=https://raw.githubusercontent.com/githubacct001/iOS_rules/main/script/checkin/ksms.js, timeout=300, tag=签到 - 科丝美诗, img-url=https://raw.githubusercontent.com/githubacct001/QuantumultX/master/icon/ksms.png
# 获取Cookie
http-response ^https?:\/\/h5\.youzan\.com\/wscump\/checkin\/get_activity_by_yzuid_v2\.json script-path=https://raw.githubusercontent.com/githubacct001/iOS_rules/main/script/checkin/ksms.js, timeout=300, tag=科丝美诗获取Cookieimg-url=https://raw.githubusercontent.com/githubacct001/QuantumultX/master/icon/ksms.png

[MITM]
hostname = h5.youzan.com

*/



const $ = API("科丝美诗小程序", false);

// 尝试获取参数
try {
    // 在匹配到链接时获取 access_token 和 sid，并写入持久化数据
    var url = $request.url;
    console.log(`科丝美诗小程序：获取Cookie开始`)

    console.log(`----------`)
	
    var params = url.match(/(?:\?|&)checkinId=(\d+)(?:&|$)/);
    var checkinId = params[1];
    console.log(`匹配到checkinId`)

    params = url.match(/(?:\?|&)app_id=([^&]+)(?:&|$)/);
    var app_id = params[1];
    console.log(`匹配到app_id`)

    params = url.match(/(?:\?|&)kdt_id=([^&]+)(?:&|$)/);
    var kdt_id = params[1];
    console.log(`匹配到kdt_id`)

    params = url.match(/(?:\?|&)access_token=([^&]+)(?:&|$)/);
    var access_token = params[1];
    console.log(`匹配到access_token`)

    var headers = $request.headers;
    var extraData = headers['extra-data'];
    console.log(`匹配到extraData`)

    console.log(`----------`)

    // 将获取到的参数保存到 Loon 数据持久化中
    $.write(checkinId, "checkinId");
    $.write(app_id, "app_id");
    $.write(kdt_id, "kdt_id");
    $.write(access_token, "access_token");
    $.write(extraData, "extraData");

    $.notify($.name, "", `🎉 Cookie写入成功`);
    console.log(`🎉 Cookie写入成功`);
    $.done();
} catch (e) {
	$.log(e)
}

// 签到
async function checkIn() {
    try {
        // 从持久化数据中读取参数
        var checkinId = $.read("checkinId");
        var app_id = $.read("app_id");
        var kdt_id = $.read("kdt_id");
        var access_token = $.read("access_token");
        var extraData = $.read("extraData");

        const url = `https://h5.youzan.com/wscump/checkin/checkinV2.json?checkinId=${checkinId}&app_id=${app_id}&kdt_id=${kdt_id}&access_token=${access_token}`;
        const headers = {
            'extra-data': `${extraData}`
        };

        // 发起POST请求
        const response = await $.http.get({ url, headers });

        const jsonData = JSON.parse(response.body);

        if (jsonData.msg == 'ok') {
            var credit = jsonData.data.list[0].infos.title;
            var times = jsonData.data.list[0].times;
            var notifyContent = `签到获得：${credit}，已连续签到${times}天`;
        } else {
            var notifyContent = jsonData.msg;
        };

        console.log(notifyContent);
        $.notify($.name, "", notifyContent);
    } catch (error) {
        $.log(`签到失败：${error}`);
    }
}

// 执行签到函数
!(async () => {
    await checkIn();
})().then(() => $.done());



// prettier-ignore
/*********************************** API *************************************/
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,i="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!i,isJSBox:i,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}function HTTP(e={baseURL:""}){const{isQX:t,isLoon:s,isSurge:i,isScriptable:n,isNode:o}=ENV(),r=/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;const u={};return["GET","POST","PUT","DELETE","HEAD","OPTIONS","PATCH"].forEach(l=>u[l.toLowerCase()]=(u=>(function(u,l){l="string"==typeof l?{url:l}:l;const h=e.baseURL;h&&!r.test(l.url||"")&&(l.url=h?h+l.url:l.url);const a=(l={...e,...l}).timeout,c={onRequest:()=>{},onResponse:e=>e,onTimeout:()=>{},...l.events};let f,d;if(c.onRequest(u,l),t)f=$task.fetch({method:u,...l});else if(s||i||o)f=new Promise((e,t)=>{(o?require("request"):$httpClient)[u.toLowerCase()](l,(s,i,n)=>{s?t(s):e({statusCode:i.status||i.statusCode,headers:i.headers,body:n})})});else if(n){const e=new Request(l.url);e.method=u,e.headers=l.headers,e.body=l.body,f=new Promise((t,s)=>{e.loadString().then(s=>{t({statusCode:e.response.statusCode,headers:e.response.headers,body:s})}).catch(e=>s(e))})}const p=a?new Promise((e,t)=>{d=setTimeout(()=>(c.onTimeout(),t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)),a)}):null;return(p?Promise.race([p,f]).then(e=>(clearTimeout(d),e)):f).then(e=>c.onResponse(e))})(l,u))),u}function API(e="untitled",t=!1){const{isQX:s,isLoon:i,isSurge:n,isNode:o,isJSBox:r,isScriptable:u}=ENV();return new class{constructor(e,t){this.name=e,this.debug=t,this.http=HTTP(),this.env=ENV(),this.node=(()=>{if(o){return{fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(e){return this.then(function(t){return((e,t)=>new Promise(function(s){setTimeout(s.bind(null,t),e)}))(e,t)})}}initCache(){if(s&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(i||n)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),o){let e="root.json";this.node.fs.existsSync(e)||this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.root={},e=`${this.name}.json`,this.node.fs.existsSync(e)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(e,JSON.stringify({}),{flag:"wx"},e=>console.log(e)),this.cache={})}}persistCache(){const e=JSON.stringify(this.cache,null,2);s&&$prefs.setValueForKey(e,this.name),(i||n)&&$persistentStore.write(e,this.name),o&&(this.node.fs.writeFileSync(`${this.name}.json`,e,{flag:"w"},e=>console.log(e)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root,null,2),{flag:"w"},e=>console.log(e)))}write(e,t){if(this.log(`SET ${t}`),-1!==t.indexOf("#")){if(t=t.substr(1),n||i)return $persistentStore.write(e,t);if(s)return $prefs.setValueForKey(e,t);o&&(this.root[t]=e)}else this.cache[t]=e;this.persistCache()}read(e){return this.log(`READ ${e}`),-1===e.indexOf("#")?this.cache[e]:(e=e.substr(1),n||i?$persistentStore.read(e):s?$prefs.valueForKey(e):o?this.root[e]:void 0)}delete(e){if(this.log(`DELETE ${e}`),-1!==e.indexOf("#")){if(e=e.substr(1),n||i)return $persistentStore.write(null,e);if(s)return $prefs.removeValueForKey(e);o&&delete this.root[e]}else delete this.cache[e];this.persistCache()}notify(e,t="",l="",h={}){const a=h["open-url"],c=h["media-url"];if(s&&$notify(e,t,l,h),n&&$notification.post(e,t,l+`${c?"\n多媒体:"+c:""}`,{url:a}),i){let s={};a&&(s.openUrl=a),c&&(s.mediaUrl=c),"{}"===JSON.stringify(s)?$notification.post(e,t,l):$notification.post(e,t,l,s)}if(o||u){const s=l+(a?`\n点击跳转: ${a}`:"")+(c?`\n多媒体: ${c}`:"");if(r){require("push").schedule({title:e,body:(t?t+"\n":"")+s})}else console.log(`${e}\n${t}\n${s}\n\n`)}}log(e){this.debug&&console.log(`[${this.name}] LOG: ${this.stringify(e)}`)}info(e){console.log(`[${this.name}] INFO: ${this.stringify(e)}`)}error(e){console.log(`[${this.name}] ERROR: ${this.stringify(e)}`)}wait(e){return new Promise(t=>setTimeout(t,e))}done(e={}){s||i||n?$done(e):o&&!r&&"undefined"!=typeof $context&&($context.headers=e.headers,$context.statusCode=e.statusCode,$context.body=e.body)}stringify(e){if("string"==typeof e||e instanceof String)return e;try{return JSON.stringify(e,null,2)}catch(e){return"[object Object]"}}}(e,t)}
/*****************************************************************************/
