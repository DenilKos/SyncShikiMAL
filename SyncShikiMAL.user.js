// ==UserScript==
// @name         ShikiSyncMAL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://shikimori.one/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      myanimelist.net
// ==/UserScript==

function ready() {
    'use strict';
    var ep;
    let elements = document.querySelectorAll(".current-episodes");
 elements.forEach(function(elem, i) {
     ep = elem.textContent;
  //console.log('Просмотренно: ', ep);
});
let elements1 = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(6)");
var score;
elements1.forEach(function(elem) {
    score = elem.value;
});
//console.log ("Оценка: ", score);

let la = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(3)");
let animeid;
la.forEach(function(elem){animeid = elem.value});
console.log(animeid);
let status = document.querySelectorAll('#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(5)');
let statusdata;
status.forEach(function(elem){statusdata = elem.value});
if (statusdata == "planned") {statusdata = "plan_to_watch"};
console.log(statusdata);


GM_xmlhttpRequest({
method: "GET",
url: "https://api.myanimelist.net/v2/users/@me",
headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZiNTIxNWI4MzYzMDZkYzc1ZmQyNjRiZWVjYzJiOGZkZmE2NWM1NzY4N2M5NDQzNGY2NThkYjVmNTAwOWI4NTA1MzQyMDdlYzBlZTY0NjgyIn0.eyJhdWQiOiIyODY1YzIyOGQ0NDFkMDc2ZDg5ZDRjNjdjM2M1YTE1MyIsImp0aSI6IjZiNTIxNWI4MzYzMDZkYzc1ZmQyNjRiZWVjYzJiOGZkZmE2NWM1NzY4N2M5NDQzNGY2NThkYjVmNTAwOWI4NTA1MzQyMDdlYzBlZTY0NjgyIiwiaWF0IjoxNjczODY0MjYxLCJuYmYiOjE2NzM4NjQyNjEsImV4cCI6MTY3NjU0MjY2MSwic3ViIjoiODI4NzY2NSIsInNjb3BlcyI6W119.rADZLtE1Wboc_a_a4crvjboRB0kMNTKvoO_yiTx5j6uptXcS6x8zOskI_mq51x_LNMjrYwChoaPgqYnEX9VD2KeDHgXY6_g2olFWPqD9Pfek8cImQccUbOSAmABmxzxxIUHc5tt3GNDSqF0k3Gi3KeXiukby5RnJtPQQ2P8cZi29RlR_w67FkwflcTIMOxkHuG73e0OsKkk5T1gNRsw1Au4X3C0EY19OLzdaZahoFEH8rqN7LIw8Y8UUkBXyymfxmiEjbSXPj87IAqmHYpRsBL7UvEG17fZ3FTgBSSZJTfgpxoDCmTFlgYZyP6km2pzl2FUCVkNkfdzSsqcd0NZ--Q"

  },


//data: "client_id=2865c228d441d076d89d4c67c3c5a153&client_secret=b2333ba933726682ba123cf7ab0078d30f86e489e65b0542e68d133870ff9197&code=def502008f19ac9400c93c43c343fea1b728d7a299982e2a5ee2110d9f623098ca356879bce33a2620bac2e4b078c4f1f339120f69783f6a796597c345decc8f0f6259931f9450ef219bddc59dce5320f284e094e3b1ee6d37d5fec89c02ffdded0cc51d409553fdb201943e4ab830c0d471c3ebdb494cb1067378744dc3881dfe1388021d1e601f06531269ed3f99978834a2dda206262ca6d52ba9d155e336dbf1bd25441e3e64283591cb1f74e37c50b0f7130bbbcef8f42ee0f68d730818550ae3741c93cd8fd17524d223de846819574479bcbb9a2e7aebacd9fbe40d9f2c13603f5d37adf6c3933afe11e5f41313eebc38e0747070e4b15aff25eb42fe57bac1d957c1d8797cc559115ded338f1987b5a6b70883cd2e71d1011ba95e721a8ed010b776ac26bebd5dfe2ef9f6397e38d9dff8c656e8235bbb57b128a4f9da431ac67799e160f422e47efbc1de34102f8c58a38bbc47f6539234422a2f1b39e48f3a83ac64c3b9ddb60c93be27386299abb374dfe42d14740a49b1af7cf8c6484377173cce77ca916ba24c02a374a7eb78a5b1baea68e059427c7a00992754027fd199aa4f4f69dde4d8c8583870b1cfb8bf85de2614f1db0bcead247e2f3d27e61cac2bcee760254d7c60e804d160cba84e9f234a03a4308166eaaa03a3e2db30c7cee46080cc&code_verifier=_Qxqsm3UOZojOA_acsOr_6H0kP4ZxCFS8Jh-g6VSdkVsSnZtZZ0ApvDWBDpaXlSL-7MD0BxhRosWV1MEBF24X9HIvIrvQ7q0kP_LzJahhc2LVo7Qf_aC0TeJ-SblCP2B&grant_type=authorization_code",
onload: function(response) {




//console.log(json.match(/"id":(.*?),/m)[1]);

}});
let url = 'https://api.myanimelist.net/v2/anime/'+animeid+'/my_list_status';
let data ='status='+statusdata+'&'+'is_rewatching=false&'+'score='+score+'&'+'num_watched_episodes='+ep;
GM_xmlhttpRequest({

method: "PUT",
url: url,
headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZiNTIxNWI4MzYzMDZkYzc1ZmQyNjRiZWVjYzJiOGZkZmE2NWM1NzY4N2M5NDQzNGY2NThkYjVmNTAwOWI4NTA1MzQyMDdlYzBlZTY0NjgyIn0.eyJhdWQiOiIyODY1YzIyOGQ0NDFkMDc2ZDg5ZDRjNjdjM2M1YTE1MyIsImp0aSI6IjZiNTIxNWI4MzYzMDZkYzc1ZmQyNjRiZWVjYzJiOGZkZmE2NWM1NzY4N2M5NDQzNGY2NThkYjVmNTAwOWI4NTA1MzQyMDdlYzBlZTY0NjgyIiwiaWF0IjoxNjczODY0MjYxLCJuYmYiOjE2NzM4NjQyNjEsImV4cCI6MTY3NjU0MjY2MSwic3ViIjoiODI4NzY2NSIsInNjb3BlcyI6W119.rADZLtE1Wboc_a_a4crvjboRB0kMNTKvoO_yiTx5j6uptXcS6x8zOskI_mq51x_LNMjrYwChoaPgqYnEX9VD2KeDHgXY6_g2olFWPqD9Pfek8cImQccUbOSAmABmxzxxIUHc5tt3GNDSqF0k3Gi3KeXiukby5RnJtPQQ2P8cZi29RlR_w67FkwflcTIMOxkHuG73e0OsKkk5T1gNRsw1Au4X3C0EY19OLzdaZahoFEH8rqN7LIw8Y8UUkBXyymfxmiEjbSXPj87IAqmHYpRsBL7UvEG17fZ3FTgBSSZJTfgpxoDCmTFlgYZyP6km2pzl2FUCVkNkfdzSsqcd0NZ--Q"
},

data: data,
onload: function(response){console.log(response.responseText, response.status, data)}
})
}

 ready();

document.addEventListener('page:load', ready);
document.addEventListener('turbolinks:load', ready);
