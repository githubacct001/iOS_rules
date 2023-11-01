/************************************

scriptName: 知乎去相关推荐
version: v1.0.0
feature: 去除相关推荐//去除banner广告//去除热门推荐广告//去除app文章底部广告//去除盐选推荐广告
Author: lbqmy2022 & ChatGPT
updateTime: 2023/10/15 21:20
versionHistory: v1.0.0 - 去广告

************************************

[rewrite local]
# > 知乎去相关推荐
^https?:\/\/www\.zhihu\.com\/api\/v4\/(answers|questions)\/\d+\/related-readings url script-response-body /adblock/zhihu.js
# > 知乎去banner广告
^https?:\/\/www\.zhihu\.com\/commercial_api\/banners_v3\/mobile_banner url reject
# > 知乎去热门推荐广告
^https?:\/\/www\.zhihu\.com\/api\/v4\/hot_recommendation\?show_ad=true url 302 https://www.zhihu.com/api/v4/hot_recommendation?show_ad=false
# > 知乎app文章底部广告
^https?:\/\/www\.zhihu\.com\/api\/v4\/answers\/\d+\/recommendations\?omni=mix\&load_new_ad=2 url reject
# > 知乎盐选推荐广告
^https?:\/\/api\.zhihu\.com\/distribute\/rhea\/qa_ad_card url reject

[mitm]
hostname = www.zhihu.com, api.zhihu.com

************************************/



let obj = JSON.parse($response.body);

obj.data[2] = {};
  
$done({body: JSON.stringify(obj)});
