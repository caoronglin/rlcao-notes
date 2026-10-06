---
title: 国内加速github
date: '2022-01-09T08:25:30+00:00'
updated: '2022-07-21T06:30:58'
categories: []
tags:
  - 反代
cover: 'https://s2.loli.net/2022/07/21/wZCsFhDzkPYM2qg.png'
active_menu: post
article:
  style: tech
abbrlink: 6dc3b8fe
---

{% toc %}

利用[cf](https://www.cloudflare.com)对Github进行代理，加快国内访问速度（cf免费计划一天有100000请求量）

# 步骤

## 1.登录 [cf worker](https://workers.cloudflare.com/)注册一个账号

## 2.回到主页，点击创建worker，![25f799bafb8546dfabaabbc0fcc6cd68](../../assets/yuque/blog/7b900e8473a20f33.png)

按照提示，完成worker创建

## 3.进入刚刚创建好的worker，点击快速编辑，部署js代码

{% image ../../assets/yuque/blog/b9d7b20f205f24a2.png 2c4fdcdb86cb4620a871f2747159278d %}

## 4.部署代码

### 1. 只加速git下载（[演示效果](https://gh.api.99988866.xyz/)）

```javascript
'use strict'
/**
 * static files (404.html, sw.js, conf.js)
 */
const ASSET_URL = 'https://hunshcn.github.io/gh-proxy/'
// 前缀，如果自定义路由为example.com/gh/*，将PREFIX改为 '/gh/'，注意，少一个杠都会错！
const PREFIX = '/'
// git使用cnpmjs镜像、分支文件使用jsDelivr镜像的开关，0为关闭，默认开启
const Config = {
 jsdelivr: 1,
 cnpmjs: 1
}
/** @type {RequestInit} */
const PREFLIGHT_INIT = {
 status: 204,
 headers: new Headers({
 'access-control-allow-origin': '*',
 'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
 'access-control-max-age': '1728000',
 }),
}
/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
 headers['access-control-allow-origin'] = '*'
 return new Response(body, {status, headers})
}
/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
 try {
 return new URL(urlStr)
 } catch (err) {
 return null
 }
}
addEventListener('fetch', e => {
 const ret = fetchHandler(e)
 .catch(err => makeRes('cfworker error:\n' + err.stack, 502))
 e.respondWith(ret)
})
/**
 * @param {FetchEvent} e
 */
async function fetchHandler(e) {
 const req = e.request
 const urlStr = req.url
 const urlObj = new URL(urlStr)
 let path = urlObj.searchParams.get('q')
 if (path) {
 return Response.redirect('https://' + urlObj.host + PREFIX + path, 301)
 }
 // cfworker 会把路径中的 `//` 合并成 `/`
 path = urlObj.href.substr(urlObj.origin.length + PREFIX.length).replace(/^https?:\/+/, 'https://')
 const exp1 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive|suites)\/.*$/i
 const exp2 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i
 const exp3 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i
 const exp4 = /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+?\/.+$/i
 const exp5 = /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i
 if (path.search(exp1) === 0 || path.search(exp5) === 0 || !Config.cnpmjs && (path.search(exp3) === 0 || path.search(exp4) === 0)) {
 return httpHandler(req, path)
 } else if (path.search(exp2) === 0) {
 if (Config.jsdelivr){
 const newUrl = path.replace('/blob/', '@').replace(/^(?:https?:\/\/)?github\.com/, 'https://cdn.jsdelivr.net/gh')
 return Response.redirect(newUrl, 302)
 }else{
 path = path.replace('/blob/', '/raw/')
 return httpHandler(req, path)
 }
 } else if (path.search(exp3) === 0) {
 const newUrl = path.replace(/^(?:https?:\/\/)?github\.com/, 'https://github.com.cnpmjs.org')
 return Response.redirect(newUrl, 302)
 } else if (path.search(exp4) === 0) {
 const newUrl = path.replace(/(?<=com\/.+?\/.+?)\/(.+?\/)/, '@$1').replace(/^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com/, 'https://cdn.jsdelivr.net/gh')
 return Response.redirect(newUrl, 302)
 } else {
 return fetch(ASSET_URL + path)
 }
}
/**
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
 const reqHdrRaw = req.headers
 // preflight
 if (req.method === 'OPTIONS' &&
 reqHdrRaw.has('access-control-request-headers')
 ) {
 return new Response(null, PREFLIGHT_INIT)
 }
 let rawLen = ''
 const reqHdrNew = new Headers(reqHdrRaw)
 let urlStr = pathname
 if (urlStr.startsWith('github')) {
 urlStr = 'https://' + urlStr
 }
 const urlObj = newUrl(urlStr)
 /** @type {RequestInit} */
 const reqInit = {
 method: req.method,
 headers: reqHdrNew,
 redirect: 'follow',
 body: req.body
 }
 return proxy(urlObj, reqInit, rawLen, 0)
}
/**
 *
 * @param {URL} urlObj
 * @param {RequestInit} reqInit
 */
async function proxy(urlObj, reqInit, rawLen) {
 const res = await fetch(urlObj.href, reqInit)
 const resHdrOld = res.headers
 const resHdrNew = new Headers(resHdrOld)
 // verify
 if (rawLen) {
 const newLen = resHdrOld.get('content-length') || ''
 const badLen = (rawLen !== newLen)
 if (badLen) {
 return makeRes(res.body, 400, {
 '--error': `bad len: ${newLen}, except: ${rawLen}`,
 'access-control-expose-headers': '--error',
 })
 }
 }
 const status = res.status
 resHdrNew.set('access-control-expose-headers', '*')
 resHdrNew.set('access-control-allow-origin', '*')
 resHdrNew.delete('content-security-policy')
 resHdrNew.delete('content-security-policy-report-only')
 resHdrNew.delete('clear-site-data')
 return new Response(res.body, {
 status,
 headers: resHdrNew,
 })
}
```

这代码是由[hunshcn大佬提供的](https://github.com/hunshcn/gh-proxy/)大佬还开源了python版本

### 2.另外一中就是直接镜像一个gituhb，跟我们熟知的[fastgit](https://hub.fastgit.org)一样(站长力推此方法)

```javascript
// 你要镜像的网站.
const upstream = 'www.github.com'
// 镜像网站的目录，比如你想镜像某个网站的二级目录则填写二级目录的目录名，镜像 google 用不到，默认即可.
const upstream_path = '/'
// 镜像站是否有手机访问专用网址，没有则填一样的.
const upstream_mobile = 'www.github.com'
// 屏蔽国家和地区.
const blocked_region = ['KP', 'SY', 'PK', 'CU']
// 屏蔽 IP 地址.
const blocked_ip_address = ['0.0.0.0', '127.0.0.1']
// 镜像站是否开启 HTTPS.
const https = true
// 文本替换.
const replace_dict = {
    '$upstream': '$custom_domain',
    '//github.com': ''
}
// 以下保持默认，不要动
addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})
async function fetchAndApply(request) {
    const region = request.headers.get('cf-ipcountry').toUpperCase();
    const ip_address = request.headers.get('cf-connecting-ip');
    const user_agent = request.headers.get('user-agent');
    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;
    if (https == true) {
        url.protocol = 'https:';
    } else {
        url.protocol = 'http:';
    }
    if (await device_status(user_agent)) {
        var upstream_domain = upstream;
    } else {
        var upstream_domain = upstream_mobile;
    }
    url.host = upstream_domain;
    if (url.pathname == '/') {
        url.pathname = upstream_path;
    } else {
        url.pathname = upstream_path + url.pathname;
    }
    if (blocked_region.includes(region)) {
        response = new Response('Access denied: WorkersProxy is not available in your region yet.', {
            status: 403
        });
    } else if (blocked_ip_address.includes(ip_address)) {
        response = new Response('Access denied: Your IP address is blocked by WorkersProxy.', {
            status: 403
        });
    } else {
        let method = request.method;
        let request_headers = request.headers;
        let new_request_headers = new Headers(request_headers);
        new_request_headers.set('Host', url.hostname);
        new_request_headers.set('Referer', url.hostname);
        let original_response = await fetch(url.href, {
            method: method,
            headers: new_request_headers
        })
        let original_response_clone = original_response.clone();
        let original_text = null;
        let response_headers = original_response.headers;
        let new_response_headers = new Headers(response_headers);
        let status = original_response.status;
        new_response_headers.set('access-control-allow-origin', '*');
        new_response_headers.set('access-control-allow-credentials', true);
        new_response_headers.delete('content-security-policy');
        new_response_headers.delete('content-security-policy-report-only');
        new_response_headers.delete('clear-site-data');
        const content_type = new_response_headers.get('content-type');
        if (content_type.includes('text/html') && content_type.includes('UTF-8')) {
            original_text = await replace_response_text(original_response_clone, upstream_domain, url_hostname);
        } else {
            original_text = original_response_clone.body
        }
        response = new Response(original_text, {
            status,
            headers: new_response_headers
        })
    }
    return response;
}
async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text()
    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        if (i == '$upstream') {
            i = upstream_domain
        } else if (i == '$custom_domain') {
            i = host_name
        }
        if (j == '$upstream') {
            j = upstream_domain
        } else if (j == '$custom_domain') {
            j = host_name
        }
        let re = new RegExp(i, 'g')
        text = text.replace(re, j);
    }
    return text;
}
async function device_status(user_agent_info) {
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < agents.length; v++) {
        if (user_agent_info.indexOf(agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
```

改动此代码还可以加速其他网站（谷歌已经屏蔽掉了cf的IP）

5.添加路由（需要将域名托管在cf上）

{% image ../../assets/yuque/blog/88b8c950494074e1.png 5c9794260004433d9a76117dd71cb242 %}

然后就可以美滋滋的使用了（一定要注意额度）

附送上本站的git镜像[点击访问](https://git.ypmsk.top)
