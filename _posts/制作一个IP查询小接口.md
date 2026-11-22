---
title: 制作一个IP查询小接口
date: '2022-07-10T18:04:16+00:00'
updated: '2022-07-21T06:24:38'
categories: []
tags:
  - API
  - PHP
  - IP
cover: 'https://s2.loli.net/2022/07/21/7brtIHduqPQ5ieD.png'
active_menu: post
article:
  style: tech
footer:
  license: true
abbrlink: 9aff0b88
---

{% toc %}

## 前言

喜欢上网冲浪的同学们应该发现了，最近越来越多的平台开始支持IP地址显示了，咱也要紧跟时代的步伐，于是有了今天的文章，为网站加入IP显示

## 自建IP地址查询接口

`10000次`**依据腾讯地图服务自建接口**

## 准备

1. 前往[腾讯地图官网](https://lbs.qq.com/)注册账号（推荐使用微信登录）

2. 完成基础认证成为个人开发者（个人开发者拥有一天10000次调用）

3. 可选择是否认证企业（免费额度更大，可购买套餐包）

## 创建一个应用

1. 前往[开发控制台](https://lbs.qq.com/dev/console/application/mine)创建一个应用![202205020259214da6456ec860971](https://cos.cnortles.top/uploads/2022/05/202205020259214da6456ec860971.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_18%2Ctext_Q1JM%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)信息自己填

2. 在应用中添加一个KEY（注意：这个KEY关乎接口调用，请保存好，避免额度被盗用，`类型选择webService`）![202205020301003a722b3c67b4151](https://cos.cnortles.top/uploads/2022/05/202205020301003a722b3c67b4151.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_24%2Ctext_Q1JM%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

3. 创建好后可前往[文档](https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp)查看（官方接口为：<https://apis.map.qq.com/ws/location/v1/ip>）

## 创建api

### php案例

```plain
<?php
    $ip_user=$_GET['ip'];
    if (empty($ip_user))
        {$ip_user = $_SERVER["REMOTE_ADDR"];}
    $ip_seekurl='https://apis.map.qq.com/ws/location/v1/ip?ip='.$ip_user.'&key='添加的KEY'; 
    $ip_mes = file_get_contents($ip_seekurl,true);
    $data = json_decode($ip_mes,true); 
    $var_ip = $data['result']['ad_info'];
    $nation = $var_ip['nation'];
    $province = $var_ip['province'];
    $district=$var_ip['district'];
    $city = $var_ip['city'];
    $ip = array(
        'nation' => $nation,
        'province' => $province,
        'city'=>$city,
        'district' => $district,);
    $ip_js = 'var ip_mes = '.json_encode($ip,JSON_UNESCAPED_UNICODE).';';
    print($ip_js);
    return $ip_js;
?>
```

因为淘宝IP库在2022年3月31日永久停止服务后，站长就开始找寻可替代方案，一开始的计划是自建数据库，但一想到更新问题就头疼的厉害，在~~网上冲浪了一波~~认真查询了一番后决定用腾讯地图提供的服务自建接口

## 接入本站接口

<https://api.cnortles.top/ip>

### 介入方法

| 参数 | 值 |
| --- | --- |
| ip | 查询地址IP采用GET方式传输，如果缺省，本站会自动获取客户端IP查询！ |

#### 使用示例(GET)

```plain
https://api.cnortles.top/ip?ip=223.5.5.5
```

### 参数返回说明

本站默认返回JS元组（已定义好变量），精度最大可到区，下面是一段示例

```plain
var ip_mes={"nation":"中国","province":"陕西省","city":"西安市","district":"莲湖区"};
```

| 返回参数 | 值（value） |
| --- | --- |
| nation | IP所属国家 |
| province | IP所属省份 |
| city | IP所属城市 |
| district | IP所属区域 |

### 调用接口

```plain
<script type="text/javascript" src="//api.cnortles.top/ip/"></script>
```

### 使用案列

```plain
<span id='ip'></span>
<script type="text/javascript" src="https://api.cnortles.top/ip/"></script> 
<script>    
      document.getElementById("ip").innerHTML =  ip_mes["nation"]+','+ ip_mes["city"];
</script>
```

因为返回数据是JS元组所以只需要使用`ip_mes["返回参数值"]即可调用`在配合JS输出即可

#### 案例

```plain
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/custom/img/favicon.png">
    <title>ERROR:对不起，你的内核不支持！</title>
    <style>
        .container {
            width: 60%;
            margin: 10% auto 0;
            background-color: #f0f0f0;
            padding: 2% 5%;
            border-radius: 25px;
            opacity: 0.5;
          
        }
        footer{
          text-align: center;
        }
        body{
          background: url(https://api.cnortles.top/img?type=wallpaper);
        }
        ul {
            padding-left: 20px;
        }

            ul li {
                line-height: 2.3
            }

        a {
            color: #20a53a
        }
    </style>
<link rel="stylesheet" href="/custom/css/gongji.css">   
<script async src="/custom/js/grayscale.js"></script>
</head>
<body>
    <div class="container">
        <h1>您所使用的浏览器我们无法提供服务！</h1>
        <h3>以下信息由系统自动生成</h3>
        <ul>
            <li>UA: <span id='ua'></span></li>
            <li>版本号: <span id='version'></span></li>
            <li>当前IP：<span id='ip'></span></li>
        </ul>
    </div>
</body>
<script type="text/javascript" src="https://api.cnortles.top/ip/"></script> 
<script>    
      /*document.getElementById("name").innerHTML=navigator.appName; */
      document.getElementById("version").innerHTML=navigator.appVersion;  
      document.getElementById("ua").innerHTML=navigator.userAgent; 
      document.getElementById("ip").innerHTML =  ip_mes["nation"]+','+ ip_mes["city"];
      console.log('browser kernel is not to bd supported!');
      console.log('拒绝IE，从你我开始');
      /*alert('拒绝IE，从你我做起,来自'+returnCitySN["cname"]+'的朋友');*/
</script> 
</html>
```

## TO DO

- [ ] 增加多种返回值参数
- [ ] 增加境外IP查询
- [ ] 增加token授权（暂定）
- [ ] 自建IP查询库（开发中）
