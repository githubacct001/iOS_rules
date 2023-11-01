/************************************

scriptName: 小米有品去开屏广告
version: v1.0.0
feature: null
Author: lbqmy2022 & ChatGPT
updateTime: 2023/10/15 21:20
versionHistory: v1.0.0 - 去广告

************************************

[rewrite local]
# > 小米有品开屏广告
^https?:\/\/shopapi\.io\.mi\.com\/mtop\/mf\/resource\/homePage\/pageConfig url script-response-body /adblock/youpin.js

[mitm]
hostname = shopapi.io.mi.com

************************************/



let obj = JSON.parse($response.body);

delete obj.data.splashConfigs;
  
$done({body: JSON.stringify(obj)});
