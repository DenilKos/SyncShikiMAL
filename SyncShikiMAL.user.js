// ==UserScript==
// @name         ShikiSyncMAL
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  try to take over the world!
// @author       Reiki
// @match        https://shikimori.me/*
// @match        https://myanimelist.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      myanimelist.net
// @updateURL    https://github.com/DenilKos/SyncShikiMAL/releases/latest/download/SyncShikiMAL.user.js
// @downloadURL  https://github.com/DenilKos/SyncShikiMAL/releases/latest/download/SyncShikiMAL.user.js
// ==/UserScript==
let atoken = GM_getValue('AToken');
let rtoken = GM_getValue('RToken');
let datatoken = "client_id=2865c228d441d076d89d4c67c3c5a153&client_secret=b2333ba933726682ba123cf7ab0078d30f86e489e65b0542e68d133870ff9197&grant_type=refresh_token&refresh_token="+rtoken;
if (atoken == undefined && window.location.href == 'https://shikimori.me/') {
    function dec2hex(dec) {
        return ("0" + dec.toString(16)).substr(-2);
    }

    function generateCodeVerifier() {
        var array = new Uint32Array(56 / 2);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec2hex).join("");
    }

    function sha256(plain) {
        // returns promise ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest("SHA-256", data);
    }

    function base64urlencode(a) {
        var str = generateCodeVerifier();
        var bytes = new Uint8Array(a);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            str += String.fromCharCode(bytes[i]);
        }
        return btoa(str)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    async function generateCodeChallengeFromVerifier(v) {
        var hashed = await sha256(v);
        var base64encoded = base64urlencode(hashed);
        return base64encoded;

    }
    GM_setValue('CF', await generateCodeChallengeFromVerifier(base64urlencode(generateCodeVerifier())));
    let urla = "https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=2865c228d441d076d89d4c67c3c5a153&code_challenge="+GM_getValue('CF');
    window.location.replace(urla);
}
if(window.location.host == 'shikimori.me' && atoken == undefined){
    let urlfirst = window.location.href;
    let code = urlfirst.split('=')[1];
    GM_setValue("Code", urlfirst.split('=')[1]);


    GM_xmlhttpRequest({
        method: "POST",
        url: "https://myanimelist.net/v1/oauth2/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"},
        data: "client_id=2865c228d441d076d89d4c67c3c5a153&client_secret=b2333ba933726682ba123cf7ab0078d30f86e489e65b0542e68d133870ff9197&code="+code+'&code_verifier='+GM_getValue('CF')+"&grant_type=authorization_code",
        onload:function(response) { let a = JSON.parse(response.responseText); console.log(response.responseText);
                                   GM_setValue("AToken", a.access_token);
                                   GM_setValue("RToken", a.refresh_token);
                                   if (GM_getValue("AToken") != undefined){
                                       alert("Токены успешно получены и сохранены");
                                       window.location.replace('https://shikimori.me/')}


                                  }


    });
}

let animeid;
let statusdata;
let ep;
let score;
let url;
let auth;
function sync(){


    let elements = document.querySelectorAll(".current-episodes");
    elements.forEach(function(elem, i) {
        ep = elem.textContent;
        //console.log('Просмотренно: ', ep);
    });
    let elements1 = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(6)");

    elements1.forEach(function(elem) {
        score = elem.value;
    });
    //console.log ("Оценка: ", score);




    //console.log(Atoken, Rtoken);
    auth = 'Bearer '+atoken;
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.myanimelist.net/v2/users/@me",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":  auth,

        },
        onload: function(response) {if(response.status == 401) {
            alert('Обновленны токены, поставьте оценку повторно')
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://myanimelist.net/v1/oauth2/token",
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",

                },
                data: datatoken,
                onload: function(response) {let token1; console.log(token1 = JSON.parse(response.responseText));
                                            GM_setValue("AToken", token1.access_token);
                                            GM_setValue("RToken", token1.refresh_token);
                                            //console.log(token1.access_token)
                                           }
            })
        }}
    })

    url = 'https://api.myanimelist.net/v2/anime/'+animeid+'/my_list_status';
    let data ='status='+statusdata+'&'+'is_rewatching=false&'+'score='+score+'&'+'num_watched_episodes='+ep;

    GM_xmlhttpRequest({

        method: "PUT",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":  auth,
        },

        data: data,
        onload: function(response){console.log(response.responseText, response.status); }
    })
}

$(document).on('click', '.hoverable-trigger', function(event) {
    event.preventDefault();
    let la = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(3)");

    la.forEach(function(elem){animeid = elem.value});
    //console.log(animeid);

    statusdata = document.querySelector("#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(5)").value;

    if (statusdata == "planned") {statusdata = "plan_to_watch"};

    sync();
})

$(document).on('click', '.option.add-trigger', function(event) {
    event.preventDefault();
    animeid = (event.target.parentElement.parentElement.parentElement.childNodes[2]).value;
    score = 0;
    ep = 0;
    statusdata = (event.target.parentElement.parentElement.parentElement.childNodes[4]).value;
    if (statusdata == "planned") {statusdata = "plan_to_watch"};
    sync();})

// document.addEventListener("click", function (event) {
// console.log((event.target.parentElement.parentElement.parentElement.childNodes[2]).value);
// });

$(document).on('click', '.text.add-trigger', function(event) {
    event.preventDefault();
    animeid = (event.target.parentElement.parentElement.parentElement.childNodes[2]).value;
    score = 0;
    ep = 0;
    statusdata = (event.target.parentElement.parentElement.parentElement.childNodes[4]).value;
    if (statusdata == "planned") {statusdata = "plan_to_watch"};
    sync();})
$(document).on('click', '.option.remove-trigger', function(event) {
    event.preventDefault();
    animeid = (event.target.parentElement.parentElement.parentElement.childNodes[2]).value;
    auth = 'Bearer '+atoken;
    GM_xmlhttpRequest({

        method: "DELETE",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization":  auth,
        },


        onload: function(response){console.log(response.responseText, response.status); }
    })})
$(document).ready(function() {
let la = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(3)");

    la.forEach(function(elem){animeid = elem.value});
    //console.log(animeid);

    statusdata = document.querySelector("#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(5)").value;

    if (statusdata == "planned") {statusdata = "plan_to_watch"};

    sync();

});
 $(document).on('turbolinks:load', function(){
let la = document.querySelectorAll("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(3)");

    la.forEach(function(elem){animeid = elem.value});
    //console.log(animeid);

    statusdata = document.querySelector("#animes_show > section > div > div.menu-slide-outer.x199 > div > div > div:nth-child(1) > div.b-db_entry > div.c-image > div.b-user_rate > div > div.b-add_to_list > form > input[type=hidden]:nth-child(5)").value;

    if (statusdata == "planned") {statusdata = "plan_to_watch"};

    sync();
});
