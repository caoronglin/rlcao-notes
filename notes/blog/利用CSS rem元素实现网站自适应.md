---
title: "利用CSS rem元素实现网站自适应"
origin: yuque
book: "blog"
yuque_id: 84307554
yuque_slug: cs7flx
updated: 2022-07-23T10:53:07
url: https://www.yuque.com/docs-crl/blogs/cs7flx
categories: [转载]
tags: [yuque, css, html]
---

# 利用CSS rem元素实现网站自适应

# 前言

## 什么是rem

> 这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。
>
> 除了IE8及更早版本外，所有浏览器均已支持rem。
>
>                                                 ——来自百度

## 用途

利用rem，我们就可以实现js自适应效果，可以很好的提升网页的多端效果，实现响应式布局

## 额外

- 定义rem基准值（rem与px之间的换算关系）
- rem的计算公式 ：设备视口宽度 / 设计稿宽度 * 100

# 使用方法

## 加入以下js代码

```javascript
(function(doc, win) {
  
  var docEl = doc.documentElement,
      
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      
      recalc = function() {
        
        var clientWidth = docEl.clientWidth;
        
        if(!clientWidth) return;
        
        if(clientWidth >= 750) {
          
          docEl.style.fontSize = '100px';
          
        } else {
          
          docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
          
        }
        
      };
  
  
  
  if(!doc.addEventListener) return;
  
  win.addEventListener(resizeEvt, recalc, false);
  
  doc.addEventListener('DOMContentLoaded', recalc, false);
  
})(document, window)
```

### 代码说明

1rem就相当于一个根元素font-size的大小，加入以上代码在css直接用1.5rem即可

## 在css里规定

```html
<!DOCTYPE html>

<html>

	<head>		<meta charset="utf-8">

		<title></title>

	</head>

	<style type="text/css">

		html{

			//在根元素中计算基准值字体大小，设备宽度 / 设计稿宽度 * 100

		    font-size: calc(100vw / 375 * 100);

		}

		body{

		    font-size: 16px;

		}

		//使用媒体查询监测设备视口宽度，当视口宽度大于最大移动设备宽度时，将内容的大小设置为固定值，不再随设备视口大小进行变化

		@media only screen and (min-width:769px){

			html{

				//将根元素字体大小设置为需求最大宽度的基准值大小

				font-size: calc(769px / 375 * 100);

			}

			body{

				//将内容宽度固定设置为需求最大宽度

				width: 769px;

				margin: auto;

			}

		}

		#box{

			width: 1rem;

			height: 1rem;

			background-color: aqua;

			font-size: 0.16rem;

		}

	</style>

	<body>

		<div id="box">

			测试rem

		</div>

	</body>

</html>
```

# 引用

🔗 [https://blog.csdn.net/weixin_46325225/article/details/124163613](https://blog.csdn.net/weixin_46325225/article/details/124163613)

🔗 [https://blog.csdn.net/z591102/article/details/108867994](https://blog.csdn.net/z591102/article/details/108867994)

TO DO

- [ ] dome示例
- [x] 引入文档地址
- [x] rem介绍
- [x] 使用rem的方法
