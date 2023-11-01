/*

Quantumult X 脚本:
薄荷壁纸解锁VIP （by lbqmy2022）
Download Link : https://apps.apple.com/us/app/%E8%96%84%E8%8D%B7%E5%A3%81%E7%BA%B8/id1633608640

[rewrite_local]
# > 薄荷壁纸解锁VIP （by lbqmy2022）
^https?:\/\/mars-prod\.whalean\.com\/hestia-service\/api\/wpUser\/getUserInfo url script-response-body /vip/whalean.js

[mitm]
hostname = mars-prod.whalean.com

*/

let obj = JSON.parse($response.body);

obj.data.memberEndTime = null;
obj.data.memberType = 2;
obj.data.isMember = 0;
obj.data.userAccount = {
      "memberEndTime" : null,
      "renewalMethod" : -1,
      "continueOpeningFee" : null,
      "userId" : 975510,
      "memberFirstTime" : "2023-10-12 07:01:40"
    };
  
$done({body: JSON.stringify(obj)});
