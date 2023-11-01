/************************************

scriptName: 微博国际版去广告
version: v1.0.0
feature: 去开屏广告//首页时间线广告//评论页广告//"我的"页面会员中心//发现页定制
Author: lbqmy2022 & ChatGPT
updateTime: 
versionHistory: v1.0.0 - 去开屏广告//首页时间线广告//评论页广告//"我的"页面会员中心//发现页定制

************************************

[rewrite local]
# > 微博广告
^https:\/\/weibointl\.api\.weibo\.cn\/portal\.php.*ads&c=ad.* url reject
# > 微博开屏广告
^https?:\/\/bootpreload\.uve\.weibo\.com\/v1\/ad url reject
# > 微博评论页广告
^https?:\/\/api\.weibo\.cn\/2\/statuses\/extend url reject
# > 微博国际版首页时间线广告
^https?:\/\/api\.weibo\.cn\/2\/ad url reject
# > 微博国际版"我的"页面去"会员中心"
^https?:\/\/weibointl\.api\.weibo\.cn\/portal\.php\?a=user_center url script-response-body /adblock/wbintl.js
# > 微博国际版feed页定制
^https?:\/\/weibointl\.api\.weibo\.cn\/portal\.php\?ct=feed\&a=trends url script-response-body /adblock/wbintl.js

[mitm]
hostname = weibointl.api.weibo.cn, bootpreload.uve.weibo.com, api.weibo.cn

************************************/



var url = $request.url;
let obj = JSON.parse($response.body);

if (url.indexOf('user_center') != -1) {
    delete obj.data.cards[1]; // 去除会员中心tab
} else if (url.indexOf('feed') != -1) {
    // "discover", 发现
    // "search_topic", 热搜
    // "treehole", 绿森
    // "topics", 话题
    // "native_content" 视频

    // 要删除的元素数组
    var elementsToRemove = ["treehole", "discover", "banner"];

    // 遍历要删除的元素数组，从原数组中删除它们
    for (var i = 0; i < elementsToRemove.length; i++) {
      var elementToRemove = elementsToRemove[i];
      var indexToRemove = obj.data.order.indexOf(elementToRemove);
      if (indexToRemove !== -1) {
        obj.data.order.splice(indexToRemove, 1);
      };
    };
};
  
$done({body: JSON.stringify(obj)});
