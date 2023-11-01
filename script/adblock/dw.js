/************************************

scriptName: 得物去广告
version: v1.0.0
feature: null
Author: lbqmy2022 & ChatGPT
updateTime: 2023/10/15 21:16
versionHistory: v1.0.0 - 去广告

************************************

[rewrite local]
^https?:\/\/app\.dewu\.com\/api\/v1\/app\/biz-aggregate\/me\/user-info url script-response-body /adblock/dw.js
^https://app\.dewu\.com/identify-discovery/v1/discovery/index url script-response-body /adblock/dw.js

[mitm]
hostname = app.dewu.com

************************************/



var url = $request.url;
var obj = JSON.parse($response.body);

if (url.indexOf('user-info') != -1) {
    delete obj.data.borrowMoneyDTO; // 删除20w借钱
    delete obj.data.bountyInfo;  // 删除50w贷款
    delete obj.data.entranceInfo;  // 删除20w现金额度
    delete obj.data.promotionResource;  // 删除促销
    delete obj.data.financeEntryInfoDTO;  // 删除轮播广告
    delete obj.data.proProductEntryDTO; // 删除轮播广告
    // 保留obj.data.features[0]
    var features = obj.data.features;
    obj.data.features = [features[0]];

} else if (url.indexOf('/discovery/index') != -1) {
    delete obj.data.groups[1];
    delete obj.data.groups[2];
    delete obj.data.groups[3];
};

  
$done({body: JSON.stringify(obj)});
