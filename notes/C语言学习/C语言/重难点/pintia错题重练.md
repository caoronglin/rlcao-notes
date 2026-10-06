---
title: "pintia错题重练"
origin: yuque
book: "C语言学习"
yuque_id: 222015005
yuque_slug: hf6bvt612chkltwt
updated: 2025-06-05T10:58:39
url: https://www.yuque.com/docs-crl/dqr79t/hf6bvt612chkltwt
catalog: "C语言/重难点"
tags: [yuque]
---

# pintia错题重练

## （1）给定 N 个非 0 的个位数字，用其中任意 2 个数字都可以组合成 1 个 2 位的数字。要求所有可能组合出来的 2 位数字的和。例如给定 2、5、8，则可以组合出：25、28、52、58、82、85，它们的和为330。[原题](https://pintia.cn/problem-sets/1904361242722484224/exam/problems/type/7?problemSetProblemId=1904361242940575745&page=0)

```c
#include <stdio.h>
int main(){
    int n;
    scanf("%d",&n);
    int ns[n];
    for(int i=0;i<n;i++){
        scanf("%d",&ns[i]);
    }
    int sum=0;
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(i==j) continue;
            else sum+=ns[i]*10+ns[j];
        }
    }
    printf("%d",sum);
    return 0;
}
```

## （2）校工会正计划举行一场全校教职员工的乒乓球赛。在每一轮比赛中，参赛者都是两两比赛，输者淘汰，赢者将进入下一轮。比赛一直进行到只剩下一个人为止，这个人就是冠军。在每一轮比赛中，如果比赛人数不是偶数，那么将随机选择一个参赛者自动晋级到下一轮比赛中，而其他人则还是捉对厮杀。主办方想知道产生冠军总共需要安排多少轮比赛？

```c
#include<stdio.h>
int main(){
    int n;
    scanf("%d",&n);
    int ns[n];
     for(int i=0;i<n;i++){
        scanf("%d",&ns[i]);
    }
    for(int i=0;i<n;i++){
        if(ns[i]%2) ns[i]=ns[i];
        else ns[i]=ns[i]-1;
          int j=0;
            do{
                ns[i]/=2;
                j++;
            }while(ns[i]>1);
        if(ns[i]==1) j++;
        printf("%d\n",j);
    }
    return 0;
}
```

## （3）乌龟与兔子进行赛跑，跑场是一个矩型跑道，跑道边可以随地进行休息。乌龟每分钟可以前进3米，兔子每分钟前进9米；兔子嫌乌龟跑得慢，觉得肯定能跑赢乌龟，于是，每跑10分钟回头看一下乌龟，若发现自己超过乌龟，就在路边休息，每次休息30分钟，否则继续跑10分钟；而乌龟非常努力，一直跑，不休息。假定乌龟与兔子在同一起点同一时刻开始起跑，请问T分钟后乌龟和兔子谁跑得快？

```c
#include<stdio.h>
 
int main()
{
    int time,time2,a=0,b=0,i=0,k=0,j=0;
    scanf("%d",&time);
    //跑步
    for(time;time>0;time--)
    {
        if(i==10)
        {
            if(b>a)
            {
                for(time;time>0;time--)
               {
                   a+=3;
                   k++;
                   if(k==30)
                   {
                       k=0;
                       i=0;
                       break;
                   }
               }
            }
            else
            {
                for(time;time>0;time--)
                {
                    a+=3;
                    b+=9;
                    j++;
                    if(j==10)
                    {
                        j=0;
                        break;
                    }
                }
            }
        }
        else
        {
            a+=3;
            b+=9;
            i++;
        }
    }
//输出
    if(a>b)
        printf("@_@ %d",a);//a==乌龟所跑的距离
    if(a<b)
        printf("^_^ %d",b);//b==兔子所跑的距离
    if(a==b)
        printf("-_- %d",b);//平局
    return 0;
}
```

## （4）在中国数学史上，广泛流传着一个“韩信点兵”的故事：韩信是汉高祖刘邦手下的大将，他英勇善战，智谋超群，为汉朝建立了卓越的功劳。据说韩信的数学水平也非常高超，他在点兵的时候，为了知道有多少兵，同时又能保住军事机密，便让士兵排队报数：

- 按从1至5报数，记下最末一个士兵报的数为1；
- 再按从1至6报数，记下最末一个士兵报的数为5；
- 再按从1至7报数，记下最末一个士兵报的数为4；
- 最后按从1至11报数，最末一个士兵报的数为10；

```c

#include<stdio.h>
int main(){
	int i=1;
	int flag=1;
	while(flag){
		if((i%5==1)&&(i%6==5)&&(i%7==4)&&(i%11==10)){
			flag=0;
		}
		else i++;
	}
	printf("%d",i);
	return 0;
}
```

## （5）某工地需要搬运砖块，已知男人一人搬`3`块，女人一人搬`2`块，小孩两人搬`1`块。如果想用`n`人正好搬`n`块砖，问有多少种搬法？

```c
/*某工地需要搬运砖块，已知男人一人搬3块，女人一人搬2块，小孩两人搬1块。如果想用n人正好搬n块砖，问有多少种搬法？ */
#include<stdio.h>
int main(){
	int n;
	scanf("%d",&n);
	int z=0;
	for(int i=0;i<=n/3;i++){
		for(int j=0;j<=n/2;j++){
			int w=n-i-j;
				z=3*i+2*j+w/2;
				if(z==n&&w%2==0){
					printf("men = %d, women = %d, child = %d\n",i,j,w);
				}
				else continue;
		}
	}
	return 0;
}
```

🔗 [https://player.bilibili.com/player.html?aid=55895675&autoplay=0](https://player.bilibili.com/player.html?aid=55895675&autoplay=0)

给定N个学生的基本信息，每个学生基本信息包括学号（由10个数字组成的字符串）、姓名（长度小于10的不包含空白字符的非空字符串）和2门课程的成绩（[0,100]区间内的整数），按照总分从高到低进行排序，并将排序后的结果写入文件test.txt。

```c
#include<studio.h>
struct STU{
    char n[20];
    char name[20];
    int s[2];
    int sum;
};
int main(){
    int a;
    scanf
}
```
