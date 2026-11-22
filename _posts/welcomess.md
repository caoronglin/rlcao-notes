---
title: 为你的网站添加欢迎提示
date: '2022-07-26T07:48:07+00:00'
updated: '2022-08-26T06:14:42'
abbrlink: welcomess
categories: []
tags:
  - 源码
active_menu: post
article:
  style: tech
footer:
  license: true
---

{% toc %}

一个纯JS的小功能，代码也十分的简单，主要是调用`snackbar`功能，输出浏览器，IP，来源等一些信息，和看板娘的部分功能相同

# 步骤

## 获取浏览器版本

### 思路

通过获取用户的UA，用JS自带的函数MATCH检测UA中所包含的特有字符，区分浏览器名称，这一块需要注意判断顺序

### 代码

```javascript
if(navigator.userAgent.match(/edg/i)){ var we_mes = 'Edge';}
/**社交软件检测 */
else if(navigator.userAgent.match(/weixin/i)){ var we_mes = '微信';}
else if(navigator.userAgent.match(/ks/i)){ var we_mes = '快手';}
else if(navigator.userAgent.match(/weibo/i)){ var we_mes = '微博';}
else if(navigator.userAgent.match(/dy/i)){ var we_mes = '抖音';}
/**手机厂商浏览器检测区域 */
else if(navigator.userAgent.match(/heytapbrowser/i)){ var we_mes = 'OPPO浏览器';}
else if(navigator.userAgent.match(/vivobrowser/i)){ var we_mes = 'VIVO浏览器';}
else if(navigator.userAgent.match(/HBPC/i) || navigator.userAgent.match(/huaweibrowser/i)){ var we_mes = '华为浏览器';}
else if(navigator.userAgent.match(/iphone/i) && navigator.userAgent.match(/mac/i)){ var we_mes = '苹果设备';}

/**第三方浏览器检测区域 */
else if(navigator.userAgent.match(/quark/i)){ var we_mes = '夸克浏览器';}
else if(navigator.userAgent.match(/firefox/i)){ var we_mes = '火狐浏览器';}
else if(navigator.userAgent.match(/ucbrowser/i)){ var we_mes = 'UC浏览器';}
else if(navigator.userAgent.match(/baidubox/i)){ var we_mes = '百度浏览器';}
else if(navigator.userAgent.match(/opr/i)){ var we_mes = 'Opera浏览器';}
/**else if(navigator.userAgent.match(/360/i)){ var we_mes = '360浏览器';}因多次查证，360浏览器并不包含特有信息，无法查证*/

else if(navigator.userAgent.match(/qq/i)){ var we_mes = 'QQ浏览器';}
  else if(navigator.userAgent.match(/chrome/i)){ var we_mes = 'Chrome浏览器';}
```

### 已实验部分

- [x] 华为浏览器
- [x] 快手
- [x] OPPO浏览器
- [x] 微信
- [x] QQ浏览器
- [x] EDGE浏览器
- [x] 夸克浏览器

## 获取来源地址

### 思路

通过referrer识别访问来源

### 代码

```javascript
 /**来源检测 */
  var we_link = document.referrer;
  if(we_link.match(/baidu/i)){
    var welcome_link = '百度'
  }
  else if(we_link.match(/sougou/i)){
    var welcome_link = '搜狗'
  }
  else if(we_link.match(/weixin/i)){
    var welcome_link = '微信'
  }
  else if(we_link.match(/qq/i)){
    var welcome_link = 'qq'
  }
  else if(we_link.match(/zhihu/i)){
    var welcome_link = '知乎'
  }
  else if(we_link.match(/google/i)){
    var welcome_link = '谷歌'
  }
  else if(we_link.match(/bing/i)){
    var welcome_link = '必应'
  }
  else if(we_link.match(/so/i)){
    var welcome_link = '360'
  }
  else if(we_link.match(/weibo/i)){
    var welcome_link = '微博'
  }
  else if(we_link.match(/t.co/i)){
    var welcome_link = '推特'
  }
  else if(we_link.match(/sougou/i)){
    var welcome_link = '搜狗'
  }
  else if(we_link.match(/toutiao/i)){
    var welcome_link = '今日头条'
  }
  else{
    var welcome_link = '远方'
  }
```

如果referrer为空，将会显示远方

## IP部分

### api

相信API建立过程，请参考

 ​

{% link 自建IP查询, http://www.cnortles.top/posts/9aff0b88.html/,https://source.cnortles.top/img/%E9%93%BE%E6%8E%A5.png  %}

​

#### 为什么自建

因为用本站的API，一秒只能请求一次，对于访客过多的时候，信息会有误差

### 步骤

#### 引入API

在主题配置文件中，在`inject`加入以下代码

```plain
- <script type="text/javascript" src="https://api.cnortles.top/ip/"></script>
```

{% image ../../assets/yuque/blog/c14013111ba01816.png image.png %}

#### 代码

·

```plain
  /**IP部分 */
  if(ip_mes["nation"] == '中国'){
    var ip_mess = ip_mes["city"];
  }else if(ip_mes["city"].match(/台湾/i)){
    var ip_mess = "中国台湾";
  }
  else{
    var ip_mess = ip_mes["nation"]+ip_mes["province"]+ip_mes["city"];
  }
  
  
```

这是我的代码逻辑，本来一开始是打算输出 国家+省份+城市+地区，但考虑了一些事情以后，决定当国家是 中国时，只输出市

## 弹窗显示

这里默认调用了butterfly主题的snackbarShow函数，其余可参考[SnackBar](https://www.polonel.com/snackbar/)

```javascript
btf.snackbarShow("你好啊，来自"+ip_mess+"的朋友，您使用"+we_mes+"从"+welcome_link+"赶来", !1, 3e3);}
```

# 效果

{% image ../../assets/yuque/blog/d76a2d2ed088160a.png image.png %}

# 利用COOKIE只在第一次打开时显示（完整代码）

```javascript
/*功能实现区*/
function setCookie(name, value, hours, path) {
  var name = escape(name);
  var value = escape(value);
  var expires = new Date();
  expires.setTime(expires.getTime() + hours * 3600000);
  path = path == "" ? "" : ";path=" + path;
  _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
  document.cookie = name + "=" + value + _expires + path;
}

//读取cookie
function getCookie(name){
var arrStr=document.cookie.split('; ');
//alert(arrStr)
for(var i=0;i<arrStr.length;i++){
  var arr=arrStr[i].split('=')
  if(arr[0]==name){return decodeURIComponent(arr[1]) }
}
return ''
}
/**网站提示区 */
function welcome_mes(){
  if(navigator.userAgent.match(/edg/i)){ var we_mes = 'Edge';}
    /**社交软件检测 */
    else if(navigator.userAgent.match(/weixin/i)){ var we_mes = '微信';}
    else if(navigator.userAgent.match(/ks/i)){ var we_mes = '快手';}
    else if(navigator.userAgent.match(/weibo/i)){ var we_mes = '微博';}
    else if(navigator.userAgent.match(/dy/i)){ var we_mes = '抖音';}
  /**手机厂商浏览器检测区域 */
  else if(navigator.userAgent.match(/heytapbrowser/i)){ var we_mes = 'OPPO浏览器';}
  else if(navigator.userAgent.match(/vivobrowser/i)){ var we_mes = 'VIVO浏览器';}
  else if(navigator.userAgent.match(/HBPC/i) || navigator.userAgent.match(/huaweibrowser/i)){ var we_mes = '华为浏览器';}
  else if(navigator.userAgent.match(/iphone/i) && navigator.userAgent.match(/mac/i)){ var we_mes = '苹果设备';}
  
  /**第三方浏览器检测区域 */
  else if(navigator.userAgent.match(/quark/i)){ var we_mes = '夸克浏览器';}
  else if(navigator.userAgent.match(/firefox/i)){ var we_mes = '火狐浏览器';}
  else if(navigator.userAgent.match(/ucbrowser/i)){ var we_mes = 'UC浏览器';}
  else if(navigator.userAgent.match(/baidubox/i)){ var we_mes = '百度浏览器';}
  else if(navigator.userAgent.match(/opr/i)){ var we_mes = 'Opera浏览器';}
  /**else if(navigator.userAgent.match(/360/i)){ var we_mes = '360浏览器';}因多次查证，360浏览器并不包含特有信息，无法查证*/

  else if(navigator.userAgent.match(/qq/i)){ var we_mes = 'QQ浏览器';}
  else if(navigator.userAgent.match(/chrome/i)){ var we_mes = 'Chrome浏览器';}

  /**IP部分 */
  if(ip_mes["nation"] == '中国'){
    var ip_mess = ip_mes["city"];
  }else if(ip_mes["city"].match(/台湾/i)){
    var ip_mess = "中国台湾";
  }
  else{
    var ip_mess = ip_mes["nation"]+ip_mes["province"]+ip_mes["city"];
  }
  
  /**来源检测 */
  var we_link = document.referrer;
  if(we_link.match(/baidu/i)){
    var welcome_link = '百度'
  }
  else if(we_link.match(/sougou/i)){
    var welcome_link = '搜狗'
  }
  else if(we_link.match(/weixin/i)){
    var welcome_link = '微信'
  }
  else if(we_link.match(/qq/i)){
    var welcome_link = 'qq'
  }
  else if(we_link.match(/zhihu/i)){
    var welcome_link = '知乎'
  }
  else if(we_link.match(/google/i)){
    var welcome_link = '谷歌'
  }
  else if(we_link.match(/bing/i)){
    var welcome_link = '必应'
  }
  else if(we_link.match(/so/i)){
    var welcome_link = '360'
  }
  else if(we_link.match(/weibo/i)){
    var welcome_link = '微博'
  }
  else if(we_link.match(/t.co/i)){
    var welcome_link = '推特'
  }
  else if(we_link.match(/sougou/i)){
    var welcome_link = '搜狗'
  }
  else if(we_link.match(/toutiao/i)){
    var welcome_link = '今日头条'
  }
  else{
    var welcome_link = '远方'
  }
  if (getCookie("welcome")==''){
  btf.snackbarShow("你好啊，来自"+ip_mess+"的朋友，您使用"+we_mes+"从"+welcome_link+"赶来", !1, 3e3);}
  setCookie("welcome",1,"/");
}welcome_mes();
```

# 其他主题/网站使用方法

## 利用NPM

```bash
 npm install node-snackbar
```

## 引入文件

```bash
https://cdn.jsdelivr.net/npm/snackbar@1.1.0/dist/snackbar.min.css
https://cdn.jsdelivr.net/npm/snackbar@1.1.0/dist/snackbar.min.js
```

## 使用

```bash
Snackbar.show(
{pos: 'top-center',text: "你好啊，来自"+ip_mess+"的朋友，您使用"+we_mes+"从"+welcome_link+"赶来"}
);
```

# TODO

- [ ] 优化代码逻辑
