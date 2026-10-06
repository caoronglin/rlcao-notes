---
title: "利用PHP+图床搭建随机API"
origin: yuque
book: "blog"
yuque_id: 65917732
yuque_slug: sywvk3
updated: 2022-07-21T06:15:15
url: https://www.yuque.com/docs-crl/blogs/sywvk3
categories: [源码]
katex: false
copyright: true
cover: https://s2.loli.net/2022/07/21/ZUoiAgRMwP7Tmqk.png
tags: [yuque, PHP, API]
---

# 利用PHP+图床搭建随机API

# 前言

网上有很多随机图片的教程，本文主要使用PHP读取txt文件中记录的图片链接达到随机图片的效果

# 开始

1. 准备PHP环境（推荐PHP版本≥7.4）
2. 新建项目目录
3. 获取图片链接，并保存在*.txt文件中（一行一个链接）

{% folding open:true  %}
如果只需要代码，可通过右侧的目录跳转至[完整代码](762d4b0f#完整代码)获取

2-4日更新：修改判断机制
{% endfolding %}

# 步骤讲解

## 主体函数

```php
//打开一个名为*.txt的文件，此处使用$filename代替
$str = explode("\n", file_get_contents($filename));
		// 2.得到的一个String的数组，然后获取随机索引
$rand_index = rand(0,count($str)-1);
		// 根据生成的随机数选取index为$rand_index的图片链接
$url = $str[$rand_index];
		// 3.重定向到目标url,返回302码,然后浏览器就会跳转到图片url的地址
die(header("Location:".$url)); 
```

## 实现判断设备类型功能

```php
//获取USER AGENT
		$agent = strtolower($_SERVER['HTTP_USER_AGENT']);
		//分析数据	
		$is_pc = (stripos($agent, 'windows nt')) ? true : false;	
		$is_iphone = (stripos($agent, 'iphone')) ? true : false;	
		$is_ipad = (stripos($agent, 'ipad')) ? true : false;	
		$is_android = (stripos($agent, 'android')) ? true : false;
		$is_linux = (stripos($agent, 'linux')) ? true : false;	
		$is_harmonyOS = (stripos($agent, 'harmonyOS')) ? true : false;
		//输出数据	
		if($is_linux && $is_android){
			img($img_type."/mobile.txt");	
		}
		if($is_linux && $is_harmonyOS){
			img($img_type."/mobile.txt");	
		}		
		if($is_linux && !$is_android && !$is_harmonyOS){
			img($img_type."/pc.txt");	
		}	
		if($is_pc){
			img($img_type."/pc.txt");	
		}	
		if($is_iphone){	
			img($img_type."/mobile.txt");	
		}	
		if($is_ipad){
			img($img_type."/mobile.txt");
		}	
		if($is_android){	
			img($img_type."/mobile.txt");	
		}
	
```

在此代码中，img()函数即为上一部的主体函数（最后会有完全体的代码），这一步通过读取UA后利用strpos进行下一步的判断，此处用的stripos函数（不用区分大小写）

如果需要自定义不同设备使用的图片源，请替换mobile.txt/pc.txt

## 增加客户端请求图片类型功能

```php
$img_type = $_GET['type'];
```

示范链接https://api.cnortles.top/img/?type=wallpaper 

这一步的原理为通过get向PHP提交参数

# 完整代码

## 只具备随机图片功能

```php
<?php
$str = explode("\n", file_get_contents($filename));
$rand_index = rand(0,count($str)-1);
$url = $str[$rand_index];
$img_url = str_re($url);
die(header("Location:".$img_url)); 
function str_re($str){
	$str = str_replace(' ', "", $str);
	$str = str_replace("\n", "", $str);
  $str = str_replace("\t", "", $str);
	$str = str_replace("\r", "", $str);
	return $str;
	 }
?>
```

其中$filename修改为你的TXT文件地址，如果失败，请删除第五行，并修改第六行$img_url为$url

## 支持判断客户端请求的图片类型

```php
<?php 
echo '<meta name="referrer" content="never">';
$img_type = $_GET['type'];
$url_404='https://pan.cnortles.top/';
if (isset($img_type)) {//判断$img_type是否初始化
		img($img_type."/pc.txt");	
}
else {
	echo '您的参数有问题！';
}

function img($filename){
	if (file_exists($filename)) {//判断请求文件是否存在
		$str = explode("\n", file_get_contents($filename));
		$rand_index = rand(0,count($str)-1);
		$url = $str[$rand_index];
			die(header("Location:".$url)); 
	else {
		echo '您所请求'.$img_type.'类型的图片我们暂未收录';//文件不存在，报错
	}
}
function str_re($str){
	$str = str_replace(' ', "", $str);
	$str = str_replace("\n", "", $str);
  $str = str_replace("\t", "", $str);
	$str = str_replace("\r", "", $str);
	return $str;
	 }
?>
```

{% note orange  如果使用此功能，请在项目目录下创建与$img_type同名的目录，并将txt放在此目录下！！！ %}

示例目录结构

![Screenshot_20220131_155256.jpg](../../assets/yuque/blog/4c51f56fc6ab09ee.jpeg)

```plain
项目文件
	--index.php
  --wallpaper
  	--pc.txt
    --mobile.txt
    --iphone.txt
	--二次元
  	--pc.txt
    --mobile.txt
......
```

## 本站使用代码

```php
<?php 
echo '<meta name="referrer" content="never">';
$img_type = $_GET['type'];
$url_404='https://pan.cnortles.top/';
if (isset($img_type)) {
		//获取USER AGENT
		$agent = strtolower($_SERVER['HTTP_USER_AGENT']);
		//分析数据	
		$is_pc = (stripos($agent, 'windows nt')) ? true : false;	
		$is_iphone = (stripos($agent, 'iphone')) ? true : false;	
		$is_ipad = (stripos($agent, 'ipad')) ? true : false;	
		$is_android = (stripos($agent, 'android')) ? true : false;
		$is_linux = (stripos($agent, 'linux')) ? true : false;	
		$is_harmonyOS = (stripos($agent, 'harmonyOS')) ? true : false;
		//输出数据	
		if($is_linux && $is_android){
			img($img_type."/mobile.txt");	
		}
		if($is_linux && $is_harmonyOS){
			img($img_type."/mobile.txt");	
		}		
		if($is_linux && !$is_android && !$is_harmonyOS){
			img($img_type."/pc.txt");	
		}	
		if($is_pc){
			img($img_type."/pc.txt");	
		}	
		if($is_iphone){	
			img($img_type."/mobile.txt");	
		}	
		if($is_ipad){
			img($img_type."/mobile.txt");
		}	
		if($is_android){	
			img($img_type."/mobile.txt");	
		}
	
}
else {
	echo '您的参数有问题！';
}

function img($filename){
	if (file_exists($filename)) {
		$str = explode("\n", file_get_contents($filename));
		// 2.得到的$str是一个String的数组，然后获取随机数index
		$rand_index = rand(0,count($str)-1);
		// 根据生成的随机数选取index为$rand_index的图片链接
		$url = $str[$rand_index];
		// 3.重定向到目标url,返回302码,然后浏览器就会跳转到图片url的地址
			die(header("Location:".$url)); 
		// 替换掉一些换行、制表符等转义
	}
	else {
		echo '您所请求'.$img_type.'类型的图片我们暂未收录';
		die(header("Location:".$url_404));
	}
}
function str_re($str){
	$str = str_replace(' ', "", $str);
	$str = str_replace("\n", "", $str);
    $str = str_replace("\t", "", $str);
	$str = str_replace("\r", "", $str);
	return $str;
	 }
?>
```

项目目录结构

```plain
项目文件
	--index.php
  --wallpaper
  	--pc.txt
    --mobile.txt
    --iphone.txt
	--二次元
  	--pc.txt
    --mobile.txt
......
```

## 减少目录创建（补充一）

```php
<?php 
echo '<meta name="referrer" content="never">';
$img_type = $_GET['type'];
$url_404='https://pan.cnortles.top/';
if (isset($img_type)) {
		//获取USER AGENT
		$agent = strtolower($_SERVER['HTTP_USER_AGENT']);
		//分析数据	
		$is_pc = (stripos($agent, 'windows nt')) ? true : false;	
		$is_iphone = (stripos($agent, 'iphone')) ? true : false;	
		$is_ipad = (stripos($agent, 'ipad')) ? true : false;	
		$is_android = (stripos($agent, 'android')) ? true : false;
		$is_linux = (stripos($agent, 'linux')) ? true : false;	
		$is_harmonyOS = (stripos($agent, 'harmonyOS')) ? true : false;
		//输出数据	
		if($is_linux && $is_android){
			img($img_type."mobile.txt");	
		}
		if($is_linux && $is_harmonyOS){
			img($img_type."mobile.txt");	
		}		
		if($is_linux && !$is_android && !$is_harmonyOS){
			img($img_type."pc.txt");	
		}	
		if($is_pc){
			img($img_type."pc.txt");	
		}	
		if($is_iphone){	
			img($img_type."mobile.txt");	
		}	
		if($is_ipad){
			img($img_type."mobile.txt");
		}	
		if($is_android){	
			img($img_type."mobile.txt");	
		}
	
}
else {
	echo '您的参数有问题！';
}

function img($filename){
	if (file_exists($filename)) {
		$str = explode("\n", file_get_contents($filename));
		// 2.得到的$str是一个String的数组，然后获取随机数index
		$rand_index = rand(0,count($str)-1);
		// 根据生成的随机数选取index为$rand_index的图片链接
		$url = $str[$rand_index];
		// 3.重定向到目标url,返回302码,然后浏览器就会跳转到图片url的地址
			die(header("Location:".$url)); 
		// 替换掉一些换行、制表符等转义
	}
	else {
		echo '您所请求'.$img_type.'类型的图片我们暂未收录';
		die(header("Location:".$url_404));
	}
}
function str_re($str){
	$str = str_replace(' ', "", $str);
	$str = str_replace("\n", "", $str);
    $str = str_replace("\t", "", $str);
	$str = str_replace("\r", "", $str);
	return $str;
	 }
?>
```

如果使用这种函数，请在PHP文件所在目录创建与$filenamepc/mobile同名的TXT文件将链接放置于此

```plain
项目文件
	--index.php
  --wallpaperpc.txt
  --wallpapermobile.txt
  --wallpaperiphone.txt
```

# 总结

这样的，一个拥有不同设备使用不同图片，通过get参数读取不同类型图片功能的随机图片API建造完毕

> 本站有提供免费API使用(现在只支持壁纸，更多类型的图片正在收集中)
>
> https://api.cnortles.top/img/?type=wallpaper

- [x] 函数实现原理
- [x] 判断设备机制
- [x] 图片类型选择机制

​
