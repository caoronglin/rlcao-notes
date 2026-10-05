---
collection:
  profile: wiki
  id: Linux
title: 第九章、vim 程序编辑器
date: 2024-01-01
updated: 2024-01-01
tags:
  - Linux
  - vim
  - 编辑器
---

# 第九章、vim 程序编辑器

## 9.1 vi 与 vim

### vi 编辑器简介

**vi**（Visual Editor）是 Unix/Linux 系统中最经典的文本编辑器，由 Bill Joy 于 1976 年开发。

**vi 的特点：**
- 所有 Unix/Linux 系统都预装
- 轻量级，启动快速
- 不需要图形界面，适合远程编辑
- 功能强大，效率高（掌握后）

**vi 的缺点：**
- 学习曲线陡峭
- 没有语法高亮（原始版本）
- 操作不够直观

### vim 编辑器简介

**vim**（Vi IMproved）是 Bram Moolenaar 于 1991 年开发的 vi 改进版本。

**vim 相比 vi 的改进：**

| 特性 | 说明 |
|------|------|
| **语法高亮** | 支持数百种编程语言的语法高亮 |
| **多窗口** | 支持水平、垂直分割窗口 |
| **多标签** | 支持标签页编辑 |
| **折叠** | 代码折叠功能 |
| **自动缩进** | 智能缩进和对齐 |
| **代码补全** | 单词、行、文件名补全 |
| **宏录制** | 录制和回放键盘操作 |
| **插件系统** | 强大的插件扩展机制 |
| **图形界面** | gvim 提供 GUI 版本 |
| **跨平台** | 支持 Linux、Windows、macOS |

### 检查 vim 安装

```bash
# 检查是否安装 vim
which vim
vim --version

# 如果没有安装（CentOS/RHEL）
sudo yum install vim
# 或安装完整版
sudo yum install vim-enhanced

# 如果没有安装（Debian/Ubuntu）
sudo apt-get install vim

# 安装图形界面版本
sudo yum install gvim        # CentOS
sudo apt-get install vim-gtk  # Debian/Ubuntu

# 查看 vim 版本和功能
vim --version | head -20
```

### vi/vim 的三种模式

vim 有三种基本工作模式：

```
┌─────────────────┐
│   正常模式       │ ←── 默认模式，用于移动光标、删除、复制等
│  (Normal Mode)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌─────────┐ ┌─────────┐
│ 插入模式  │ │ 命令行模式│
│(Insert  │ │(Command │
│ Mode)   │ │ Mode)   │
└─────────┘ └─────────┘
   i,a,o      :,/,?
```

**1. 正常模式（Normal Mode）**
- 默认进入的模式
- 用于浏览、移动光标、删除、复制、粘贴等
- 按 `i`、`a`、`o` 等进入插入模式
- 按 `:` 进入命令行模式

**2. 插入模式（Insert Mode）**
- 用于输入和编辑文本
- 左下角显示 "-- INSERT --"
- 按 `Esc` 返回正常模式

**3. 命令行模式（Command Mode / Ex Mode）**
- 用于执行保存、退出、搜索、替换等命令
- 左下角显示 `:` 或 `/` 或 `?`
- 按 `Esc` 或 `Enter` 执行后返回正常模式

## 9.2 vi 的使用

### 启动和退出 vim

**启动 vim：**

```bash
# 打开新文件
vim
vim newfile.txt

# 打开现有文件
vim existingfile.txt

# 打开多个文件
vim file1.txt file2.txt file3.txt

# 从指定行开始
vim +10 file.txt        # 打开后光标在第10行
vim + file.txt          # 打开后光标在最后一行

# 从指定匹配位置开始
vim +/pattern file.txt  # 打开后光标在第一个匹配位置

# 以只读模式打开
vim -R file.txt
view file.txt          # 等同于 vim -R

# 恢复异常退出的交换文件
vim -r file.txt
vim -r                  # 列出所有可恢复的交换文件
```

**退出 vim：**

```bash
# 在命令行模式下（按 : 进入）
:w                      # 保存（写入）
:w filename             # 另存为 filename
:q                      # 退出（前提是没有修改）
:q!                     # 强制退出，不保存修改
:wq                     # 保存并退出
:x                      # 保存并退出（与 :wq 类似，但有细微差别）
ZZ                      # 正常模式下，保存并退出（不需要 :）
ZQ                      # 正常模式下，不保存退出
:wqa                    # 保存所有打开的文件并退出
:qa!                    # 放弃所有修改并退出
```

### 正常模式基本操作

**移动光标：**

```bash
# 基本移动
h        # 左
j        # 下
k        # 上
l        # 右

# 快速移动
w        # 下一个单词的开头
b        # 上一个单词的开头
e        # 当前单词/下一个单词的结尾
ge       # 上一个单词的结尾

W        # 下一个 WORD 的开头（以空格分隔）
B        # 上一个 WORD 的开头
E        # WORD 的结尾

# 行内移动
0        # 行首
^        # 第一个非空白字符
$        # 行尾
g_       # 最后一个非空白字符

|        # 第 N 列（例如 10| 跳到第10列）

# 行间移动
gg       # 文件第一行
G        # 文件最后一行
10G      # 第 10 行
:10      # 第 10 行（命令行模式）

%        # 跳转到匹配的括号 ()[]{}

# 屏幕移动
H        # 屏幕顶部（High）
M        # 屏幕中间（Middle）
L        # 屏幕底部（Low）

Ctrl+f   # 向下翻一页（Page Down）
Ctrl+b   # 向上翻一页（Page Up）
Ctrl+d   # 向下翻半页
Ctrl+u   # 向上翻半页

zz       # 将当前行移到屏幕中央
e zt       # 将当前行移到屏幕顶部
zb       # 将当前行移到屏幕底部

# 搜索移动
/pattern # 向下搜索 pattern
?pattern # 向上搜索 pattern
n        # 下一个匹配
N        # 上一个匹配
*        # 向下搜索当前单词
#        # 向上搜索当前单词

# 标记移动
ma       # 在当前位置设置标记 a
`a       # 跳转到标记 a 的位置（精确位置）
'a       # 跳转到标记 a 所在行的行首
``.      # 跳转到上次编辑的位置
''       # 跳转到上次跳转的位置开头
:marks   # 列出所有标记
```

**编辑操作：**

```bash
# 删除操作（实际是剪切，可以粘贴）
x        # 删除光标下的字符
X        # 删除光标前的字符
dd       # 删除当前行
5dd      # 删除5行
dw       # 删除到单词结尾
d$       # 删除到行尾
d0       # 删除到行首
dgg      # 删除到文件开头
dG       # 删除到文件结尾
di"      # 删除引号内的内容（包括引号内的所有内容）
di(      # 删除括号内的内容
di{      # 删除大括号内的内容
dit      # 删除 HTML/XML 标签内的内容

# 复制（yank）
yy       # 复制当前行
5yy      # 复制5行
yw       # 复制到单词结尾
y$       # 复制到行尾
y0       # 复制到行首
ggVG     # 选择全部并复制（gg=到开头，V=行选择，G=到结尾）

# 粘贴
p        # 在光标后/下方粘贴
P        # 在光标前/上方粘贴
]p       # 粘贴并调整缩进（适合代码）
[p       # 在上方粘贴并调整缩进

# 修改（删除并进入插入模式）
cc       # 修改当前行（删除并进入插入模式）
cw       # 修改到单词结尾
c$       # 修改到行尾
c0       # 修改到行首
ct"      # 修改到引号（不包括引号）

# 替换
r        # 替换光标下的单个字符，然后返回正常模式
R        # 进入替换模式（类似插入模式，但会覆盖原有内容）
~        # 切换光标下字符的大小写

# 撤销和重做
u        # 撤销上一步操作
U        # 撤销对当前行的所有修改
Ctrl+r   # 重做（撤销的反向操作）

# 重复操作
.        # 重复上一个修改操作（非常强大的功能）
```

**进入插入模式：**

```bash
i        # 在光标前插入
I        # 在行首插入
a        # 在光标后插入
A        # 在行尾插入
o        # 在下方插入新行
O        # 在上方插入新行

s        # 删除光标下的字符并插入
S        # 删除当前行并插入

C        # 删除到行尾并插入
cw       # 删除单词并插入

# 退出插入模式
Esc      # 返回正常模式
Ctrl+[   # 等同于 Esc
Ctrl+c   # 等同于 Esc（某些环境下）
```

### 可视模式（Visual Mode）

```bash
# 进入可视模式
v        # 字符可视模式（选择单个字符）
V        # 行可视模式（选择整行）
Ctrl+v   # 块可视模式（选择矩形区域，列选择）

# 可视模式下的操作
h/j/k/l  # 扩展选择范围
w/b/e    # 按单词扩展
$/0/^    # 到行首/尾
gg/G     # 到文件开头/结尾

o        # 切换选择的锚点（从另一端扩展）
O        # 块可视模式下，切换到另一个角落

# 对选中内容执行操作
d        # 删除
y        # 复制
>        # 增加缩进（代码）
<        # 减少缩进（代码）
=        # 自动缩进
~        # 切换大小写
u        # 转为小写
U        # 转为大写
J        # 合并行
gq       # 格式化文本（自动换行）
r        # 替换为指定字符
I        # 在所有选中行前插入
A        # 在所有选中行后追加
Esc      # 退出可视模式
```

### 命令行模式（Command Mode/Ex Mode）

```bash
# 进入命令行模式（按 : 进入）

# 文件操作
:w                      # 保存
:w filename             # 另存为
:q                      # 退出
:q!                     # 强制退出，不保存
:wq                     # 保存并退出
:x                      # 保存并退出（与 :wq 类似）
ZZ                      # 保存并退出（正常模式下，不需要 :）
:saveas filename        # 另存为并切换到新文件

# 编辑操作
:e filename             # 编辑另一个文件
:e!                     # 放弃修改，重新加载文件
:enew                   # 新建文件

# 缓冲区操作
:ls                     # 列出所有缓冲区
:buffers                # 同上
:files                  # 同上
:b 2                    # 切换到缓冲区 2
:bnext                  # 下一个缓冲区
:bprevious              # 上一个缓冲区
:bfirst                 # 第一个缓冲区
:blast                  # 最后一个缓冲区
:bdelete 2              # 删除缓冲区 2
:bwipeout 2             # 彻底删除缓冲区 2

# 窗口操作
:split                  # 水平分割窗口
:split filename         # 水平分割并打开文件
:vsplit                 # 垂直分割窗口
:vsplit filename        # 垂直分割并打开文件
:new                    # 水平分割新窗口
:vnew                   # 垂直分割新窗口
:close                  # 关闭当前窗口
:only                   # 只保留当前窗口，关闭其他
:qa                     # 关闭所有窗口并退出
:qa!                    # 强制关闭所有窗口并退出
:windo cmd              # 对所有窗口执行命令

# 标签页操作
:tabnew                 # 新建标签页
:tabnew filename        # 新建标签页并打开文件
:tabs                   # 列出所有标签页
:tabnext                # 下一个标签页（gt）
:tabprevious            # 上一个标签页（gT）
:tabfirst               # 第一个标签页
:tablast                # 最后一个标签页
:tabmove 2              # 移动标签页到位置 2
:tabmove +1             # 向右移动一个位置
:tabmove -1             # 向左移动一个位置
:tabclose               # 关闭当前标签页
:tabonly                # 只保留当前标签页
:tabdo cmd              # 对所有标签页执行命令

# 搜索和替换
/pattern                # 向下搜索 pattern（后按 Enter）
?pattern                # 向上搜索 pattern
n                       # 下一个匹配
N                       # 上一个匹配
*                       # 搜索当前单词（向下）
#                       # 搜索当前单词（向上）
:%s/old/new/            # 替换当前行第一个匹配
:%s/old/new/g           # 替换当前行所有匹配
:%s/old/new/gc          # 替换所有匹配，每次确认
:1,10s/old/new/g        # 替换 1-10 行
:%s/old/new/gi          # 忽略大小写替换
:%s//new/g              # 使用上次搜索模式替换

# 设置选项
:set number             # 显示行号（:set nu）
:set nonumber           # 隐藏行号（:set nonu）
:set relativenumber     # 显示相对行号
:set norelativenumber   # 隐藏相对行号
:set cursorline         # 高亮当前行
:set nocursorline       # 取消高亮当前行
:set cursorcolumn       # 高亮当前列
:set wrap               # 自动换行
:set nowrap             # 不换行
:set ignorecase         # 搜索忽略大小写（:set ic）
:set smartcase          # 智能大小写（有大写时区分）
:set hlsearch           # 高亮搜索结果（:set hls）
:set nohlsearch         # 取消高亮（:noh 临时取消）
:set incsearch          # 增量搜索（实时显示）
:set tabstop=4          # Tab 宽度为 4
:set shiftwidth=4       # 自动缩进宽度为 4
:set expandtab          # Tab 转换为空格
:set autoindent         # 自动缩进
:set smartindent        # 智能缩进
:set cindent            # C 风格缩进
:set fileformat=unix    # 文件格式为 Unix
:set fileencoding=utf-8 # 文件编码为 UTF-8
:set backup             # 创建备份文件
:set nobackup           # 不创建备份
:set swapfile           # 创建交换文件
:set noswapfile         # 不创建交换文件
:set history=1000       # 命令历史记录数
:set undolevels=1000    # 撤销级别数
:set laststatus=2       # 总是显示状态栏
:set ruler              # 显示光标位置
:set showcmd            # 显示部分命令
:set showmatch          # 显示匹配的括号
:set wildmenu           # 命令行补全菜单
:set paste              # 粘贴模式（防止格式错乱）
:set nopaste            # 取消粘贴模式

# 查看当前设置
:set all                # 显示所有选项
:set number?            # 查看 number 选项的值
:set                    # 显示修改过的选项

# 保存设置到配置文件
:mkvimrc ~/.myvimrc     # 保存当前设置到文件
```

### vim 高级技巧

**1. 寄存器使用：**

```bash
# 命名寄存器（a-z）
"ayy      # 复制当前行到寄存器 a
"ap       # 粘贴寄存器 a 的内容

"byw      # 复制单词到寄存器 b
"b3p      # 粘贴 3 次

# 特殊寄存器
""        # 默认寄存器
"0        # 上次复制的内容（y 命令）
"1-"9     # 删除历史（d 命令）
"-        # 小删除（少于一行）
"+        # 系统剪贴板（可能需要 +clipboard 特性）
"*        # 主剪贴板（X11）
"%        # 当前文件名
"#        # 备用文件名
"=        # 表达式寄存器
"_        # 黑洞寄存器（删除不保存）
"/        # 上次搜索模式
":        # 上次命令行命令
".        # 上次插入的文本

# 使用系统剪贴板（跨应用复制粘贴）
"+yy      # 复制到系统剪贴板
"+p       # 从系统剪贴板粘贴

# 表达式寄存器
"=5*5"p   # 计算 5*5 并粘贴结果
"=strftime("%Y-%m-%d")"p  # 插入当前日期
```

**2. 宏录制：**

```bash
# 录制宏到寄存器 q（可以是任意字母）
qq       # 开始录制到寄存器 q
...      # 执行一系列操作
q        # 停止录制

# 播放宏
@q       # 播放寄存器 q 的宏
@@       # 再次播放上次使用的宏
5@q      # 播放宏 5 次

# 应用到多行
# 方法1：在行上使用宏
10@q     # 在当前行及下面9行上应用宏

# 方法2：配合可视模式
Vjjjj    # 选择多行
:'<,'>normal @q   # 对每一行应用宏

# 编辑宏
"qp      # 将宏粘贴出来
# 编辑内容
"qyy     # 重新保存到寄存器 q

# 追加到宏
qQ       # 追加录制到寄存器 q
...      # 执行额外操作
q        # 停止

# 保存宏到文件
"qyy      # 复制宏内容
:new ~/.vim/macros.vim
p         # 粘贴
:w        # 保存

# 从文件加载宏
:r ~/.vim/macros.vim
"qyy      # 保存到寄存器 q
```

**3. 多窗口操作：**

```bash
# 创建分割窗口
Ctrl+w s        # 水平分割当前窗口（split）
Ctrl+w v        # 垂直分割当前窗口（vsplit）
:sp filename    # 水平分割并打开文件
:vsp filename   # 垂直分割并打开文件
:new            # 水平分割新窗口
:vnew           # 垂直分割新窗口

# 在窗口间移动
Ctrl+w w        # 在窗口间循环移动
Ctrl+w h        # 移到左边窗口
Ctrl+w j        # 移到下边窗口
Ctrl+w k        # 移到上边窗口
Ctrl+w l        # 移到右边窗口
Ctrl+w t        # 移到顶部窗口
Ctrl+w b        # 移到底部窗口
Ctrl+w p        # 移到上一个窗口

# 移动窗口位置
Ctrl+w r        # 向下/向右旋转窗口
Ctrl+w R        # 向上/向左旋转窗口
Ctrl+w x        # 与下一个窗口交换
Ctrl+w K        # 将窗口移到最上（大写K）
Ctrl+w J        # 将窗口移到最下（大写J）
Ctrl+w H        # 将窗口移到最左（大写H）
Ctrl+w L        # 将窗口移到最右（大写L）
Ctrl+w T        # 将窗口移到新的标签页

# 调整窗口大小
Ctrl+w =        # 所有窗口等宽等高
Ctrl+w _        # 最大化当前窗口高度
Ctrl+w |        # 最大化当前窗口宽度
Ctrl+w +        # 增加窗口高度
Ctrl+w -        # 减少窗口高度
Ctrl+w >        # 增加窗口宽度
Ctrl+w <        # 减少窗口宽度
Ctrl+w n+       # 增加 n 行高度（例如：Ctrl+w 5+）
:resize 20      # 设置当前窗口高度为20
:resize +5      # 增加5行
:vertical resize 80  # 设置宽度为80

# 关闭窗口
Ctrl+w c        # 关闭当前窗口（close）
Ctrl+w q        # 关闭当前窗口并退出（quit）
:q              # 关闭当前窗口
:q!             # 强制关闭
:on             # 只保留当前窗口，关闭其他（only）
:only           # 同上

# 打开新窗口
Ctrl+w n        # 水平分割新窗口
Ctrl+w ^        # 水平分割并打开文件（与#相同）
Ctrl+w f        # 水平分割并打开光标下的文件
Ctrl+w i        # 水平分割并跳转到光标下单词的定义
Ctrl+w d        # 水平分割并跳转到光标下单词的定义（查找）

# 多窗口编辑技巧
# 1. 对比两个文件
vim -d file1 file2       # 启动时进入 diff 模式
vim file1
:vertical diffsplit file2

# 2. 同时查看文件的不同部分
Ctrl+w s                 # 分割窗口
Ctrl+w w                 # 在窗口间切换
:G                       # 一个窗口到文件末尾，另一个在开头

# 3. 编辑同一文件的不同位置
Ctrl+w v                 # 垂直分割
Ctrl+w l                 # 移到右窗口
100G                     # 跳到第100行
Ctrl+w h                 # 移回左窗口
50G                      # 跳到第50行
# 现在可以同时看到文件的两个不同位置

# 4. 参考模式
# 在一个窗口查看参考代码，在另一个窗口编写代码
Ctrl+w v
Ctrl+w l
:e reference.txt
Ctrl+w h
# 现在左边是工作文件，右边是参考文件
```

**4. 多标签页操作：**

```bash
# 创建标签页
:tabnew                 # 新建标签页
:tabnew filename        # 新建标签页并打开文件
:tabe filename          # 同上（tabedit）
:tabf filename          # 查找文件并在新标签打开
:tabs                   # 列出所有标签页

# 在标签页间切换
gt                      # 下一个标签页（正常模式）
gT                      # 上一个标签页（正常模式）
:tabnext                # 下一个标签页
:tabprevious            # 上一个标签页
:tabn                   # 简写
:tabp                   # 简写
:tabfirst               # 第一个标签页
:tablast                # 最后一个标签页
:tabm 0                 # 移到第一个位置
:tabm                   # 移到最后
:tabm 2                 # 移到位置 2

# 关闭标签页
:tabc                   # 关闭当前标签页（tabclose）
:tabo                   # 只保留当前标签页（tabonly）
:tabs                   # 显示所有标签页

# 标签页快捷键配置（可添加到 .vimrc）
" 使用 Alt+数字 切换标签页
map <A-1> 1gt
map <A-2> 2gt
map <A-3> 3gt
map <A-4> 4gt
map <A-5> 5gt
map <A-6> 6gt
map <A-7> 7gt
map <A-8> 8gt
map <A-9> 9gt
map <A-0> :tablast<CR>

" 使用 Ctrl+t 新建标签页
nnoremap <C-t> :tabnew<CR>
" 使用 Ctrl+w 关闭标签页
nnoremap <C-w> :tabclose<CR>

# 实用标签页技巧
# 1. 在标签页间复制内容
# 在标签页1复制：yy
# 切换到标签页2：gt
# 粘贴：p

# 2. 对比不同版本的文件
vim file.txt
:vsplit file.txt.backup
# 或者在两个标签页中打开
:tabe file.txt
:tabe file.txt.backup

# 3. 工作流程示例
vim main.c
:tabnew utils.c          # 创建新标签编辑工具函数
:tabnew header.h         # 创建新标签编辑头文件
# 现在可以用 gt/gT 在三个文件间快速切换

# 4. 保存所有标签页的会话
:mksession ~/.vim/session/work.vim
# 下次恢复
vim -S ~/.vim/session/work.vim
```

**5. 搜索和替换：**

```bash
# 基础搜索
/pattern                # 向下搜索 pattern
?pattern                # 向上搜索 pattern
n                       # 下一个匹配
N                       # 上一个匹配

# 搜索设置
:set ignorecase         # 忽略大小写
:set smartcase          # 智能大小写（有大写字母时区分）
:set noignorecase       # 区分大小写
:set hlsearch           # 高亮搜索结果
:set nohlsearch         # 取消高亮
:noh                    # 临时取消高亮（下次搜索恢复）
:set incsearch          # 增量搜索（实时显示）

# 特殊搜索
/pattern\c              # 临时忽略大小写
/pattern\C              # 临时区分大小写
/^pattern              # 匹配行首
/pattern$              # 匹配行尾
/\<word\>               # 匹配整个单词
/pattern1.*pattern2    # 匹配两个模式之间

# 替换命令
:s/old/new/             # 替换当前行第一个匹配
:s/old/new/g            # 替换当前行所有匹配
:5s/old/new/g           # 替换第5行所有匹配
:1,10s/old/new/g        # 替换1-10行所有匹配
:%s/old/new/g           # 替换整个文件所有匹配
:%s/old/new/gc          # 替换所有匹配，每次确认
:%s/old/new/gi          # 忽略大小写替换所有
:%s/old/new/gI          # 区分大小写替换所有

# 高级替换
:%s/\s\+$//g            # 删除行尾空白
:%s/^\s\+//g            # 删除行首空白
:%s/^\n\+//g            # 删除空行
:%s/old//g              # 删除所有匹配而不替换
:%s/old/\U&/g           # 替换为大写
:%s/old/\L&/g           # 替换为小写
:%s/old/\u&/g           # 替换为首字母大写
:%s/\(.*\)/\1\1/g       # 复制整行

# 使用上次搜索模式
:%s//new/g              # 使用上次的搜索模式

# 使用正则表达式捕获组
:%s/\(foo\)\(bar\)/\2\1/g   # 交换 foo 和 bar
:%s/\d\+/\=submatch(0)+1/g # 将数字加1

# 确认替换选项
y                       # 替换当前
n                       # 跳过当前
a                       # 替换所有剩余
q                       # 退出替换
l                       # 替换当前并退出
Ctrl+e                  # 向下滚动
Ctrl+y                  # 向上滚动
```

**6. 书签和标记：**

```bash
# 设置标记（a-z 局部标记，A-Z 全局标记）
ma                      # 在当前位置设置标记 a
mb                      # 在当前位置设置标记 b
mA                      # 设置全局标记 A（跨文件）

# 跳转到标记
`a                      # 跳转到标记 a 的精确位置（光标位置）
'a                      # 跳转到标记 a 所在行的行首

# 特殊标记
``.                     # 跳转到上次编辑的位置
`.                      # 跳转到上次修改的位置
`^                      # 跳转到上次插入模式的位置
`[                      # 跳转到上次修改的开始位置
`]                      # 跳转到上次修改的结束位置
`<                      # 跳转到上次可视选择的开始
`>                      # 跳转到上次可视选择的结束

# 列出标记
:marks                  # 列出所有标记
:marks aAbBcC           # 列出指定标记

# 删除标记
:delmarks a             # 删除标记 a
:delmarks a-d           # 删除标记 a 到 d
:delmarks!              # 删除所有小写标记（a-z）

# 实用技巧
# 在代码中设置标记快速导航
ma                      # 在函数开始处设置标记 a
# ... 编辑其他部分 ...
'a                      # 快速跳回函数开始

# 使用全局标记跨文件导航
# 在文件1中：mA
# 在文件2中：mB
# 随时可以用 `A 和 `B 在文件间跳转

# 结合使用
ma                      # 设置临时标记
# 进行一系列编辑...
`a                      # 快速回到标记位置
```

**7. 折叠代码：**

```bash
# 设置折叠方法
:set foldmethod=syntax    # 基于语法折叠
:set foldmethod=indent    # 基于缩进折叠
:set foldmethod=marker    # 基于标记折叠
:set foldmethod=expr      # 基于表达式折叠
:set foldmethod=manual    # 手动折叠（默认）

# 标记折叠
# 在代码中添加标记：
# {{{ 开始折叠
# 要折叠的代码
# }}} 结束折叠

# 折叠操作（在 normal 模式下）
zo                      # 打开当前折叠（open）
zc                      # 关闭当前折叠（close）
za                      # 切换当前折叠（toggle）
zO                      # 递归打开所有嵌套折叠
zC                      # 递归关闭所有嵌套折叠
zA                      # 递归切换所有嵌套折叠

zv                      # 展开足够的折叠使光标行可见
zx                      # 更新折叠（撤销手动打开/关闭）
zX                      # 完全更新折叠

zm                      # 增加 foldlevel（关闭更多折叠）
zM                      # 关闭所有折叠（foldlevel=0）
zr                      # 减少 foldlevel（打开更多折叠）
zR                      # 打开所有折叠（foldlevel=最大）

zn                      # 禁用折叠（foldenable=0）
zN                      # 启用折叠（foldenable=1）
zi                      # 切换 foldenable

# 显示折叠信息
:set foldcolumn=4       # 显示折叠列（显示折叠层次）
:set foldlevel=2        # 设置初始折叠级别
:set foldminlines=3     # 设置最小折叠行数
:set foldnestmax=3      # 设置最大折叠嵌套深度

# 查看折叠信息
[Count]zk              # 移动到上一个折叠开始
[Count]zj              # 移动到下一个折叠开始
[Count]zk              # 移动到当前折叠开始（如果在折叠内）

# 示例配置（添加到 .vimrc）
set foldmethod=syntax
set foldlevel=99        " 默认打开所有折叠
set foldcolumn=3        " 显示折叠列
set foldopen=all        " 自动打开折叠（当跳转时）

" 使用空格键切换折叠
nnoremap <space> za

" 使用大括号导航折叠
map [[ zc
map ]] zo
```

**8. vim 配置文件（.vimrc）：**

```bash
" ~/.vimrc - vim 配置文件
" ======================

" 基本设置
set nocompatible          " 不与 Vi 兼容（使用 vim 的扩展功能）
set encoding=utf-8        " 使用 UTF-8 编码
set fileencoding=utf-8    " 文件使用 UTF-8 编码
set termencoding=utf-8    " 终端使用 UTF-8

" 显示设置
set number                " 显示行号
set relativenumber        " 显示相对行号（可选）
set cursorline            " 高亮当前行
set colorcolumn=80        " 在 80 列处显示标记线
set laststatus=2          " 总是显示状态栏
set showcmd               " 显示部分命令
set showmode              " 显示当前模式
set ruler                 " 显示光标位置

" 搜索设置
set hlsearch              " 高亮搜索结果
set incsearch             " 增量搜索
set ignorecase            " 忽略大小写
set smartcase             " 智能大小写（有大写字母时区分）
set wrapscan              " 搜索到文件末尾后从头开始

" 缩进和制表符
set autoindent            " 自动缩进
set smartindent           " 智能缩进
set cindent               " C 风格缩进
set expandtab             " Tab 转换为空格
set tabstop=4             " Tab 宽度为 4
set shiftwidth=4          " 自动缩进宽度为 4
set softtabstop=4         " 软 Tab 宽度为 4

" 折叠设置
set foldenable            " 启用折叠
set foldmethod=syntax     " 基于语法折叠
set foldlevel=99          " 默认打开所有折叠
set foldcolumn=3          " 显示折叠列

" 备份和交换文件
set backup                " 启用备份
set backupdir=~/.vim/backup//  " 备份文件目录
set backupext=.bak        " 备份文件扩展名
set swapfile              " 启用交换文件
set directory=~/.vim/swap//    " 交换文件目录
set undofile              " 启用持久撤销
set undodir=~/.vim/undo//      " 撤销文件目录

" 性能优化
set lazyredraw            " 减少重绘
set ttyfast               " 快速终端连接
set updatetime=300        " 更新时间间隔
set timeoutlen=500        " 键序列超时时间

" 自动命令
if has("autocmd")
    " 文件类型检测
    filetype on
    filetype plugin on
    filetype indent on

    " 针对文件类型的设置
    autocmd FileType python setlocal et sta sw=4 sts=4
    autocmd FileType c,cpp setlocal cindent
    autocmd FileType html,xhtml,css,xml setlocal sw=2 sts=2
    autocmd FileType javascript setlocal sw=2 sts=2

    " 自动移除行尾空格
    autocmd BufWritePre * :%s/\s\+$//e

    " 记住光标位置
    autocmd BufReadPost *
      \ if line("'\"") > 1 && line("'\"") <= line("$") |
      \   exe "normal! g`\"" |
      \ endif
endif

" 配色方案
try
    colorscheme desert      " 使用 desert 配色
    " colorscheme molokai   " 或其他配色方案
    " colorscheme solarized
catch
    colorscheme default
endtry
set background=dark         " 使用深色背景

" 快捷键映射
let mapleader = ","       " 设置 leader 键为逗号

" 快速保存
nmap <leader>w :w!<CR>
nmap <leader>q :q!<CR>
nmap <leader>x :x!<CR>

" 快速切换窗口
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" 使用空格键切换折叠
nnoremap <space> za

" 快速编辑 .vimrc
nnoremap <leader>v :e $MYVIMRC<CR>
nnoremap <leader>s :source $MYVIMRC<CR>

" 在当前行上下插入空行（不进入插入模式）
nnoremap <Leader>o o<Esc>
nnoremap <Leader>O O<Esc>

" 快速移动
nnoremap H ^
nnoremap L $
nnoremap J 5j
nnoremap K 5k

" 视觉模式下保持缩进
vnoremap < < gv
vnoremap > > gv

" 系统剪贴板
nnoremap <leader>y "+y
vnoremap <leader>y "+y
nnoremap <leader>Y "+Y
nnoremap <leader>p "+p
nnoremap <leader>P "+P

" 插件管理（vim-plug）示例
" 先安装 vim-plug:
" curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
"   https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

call plug#begin('~/.vim/plugged')

" 常用插件示例
Plug 'tpope/vim-sensible'          " 合理的默认设置
Plug 'tpope/vim-surround'          " 快速操作包围符号
Plug 'tpope/vim-commentary'        " 快速注释
Plug 'tpope/vim-fugitive'          " Git 集成
Plug 'preservim/nerdtree'          " 文件浏览器
Plug 'vim-airline/vim-airline'     " 状态栏增强
Plug 'vim-airline/vim-airline-themes'
Plug 'sheerun/vim-polyglot'        " 语法高亮包
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'            " 模糊查找

call plug#end()

" 安装插件: :PlugInstall
" 更新插件: :PlugUpdate
" 清理插件: :PlugClean
```

这是一个非常全面的 `.vimrc` 配置文件，涵盖了 vim 的各个方面。以下是使用这个配置的方法：

1. **安装 vim-plug**（如果你需要使用插件部分）：
```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

2. **创建配置文件**：
```bash
cp ~/.vimrc ~/.vimrc.backup  # 备份原有配置（如果有）
vim ~/.vimrc
# 粘贴上面的配置内容
```

3. **创建必要的目录**：
```bash
mkdir -p ~/.vim/backup ~/.vim/swap ~/.vim/undo ~/.vim/plugged
```

4. **安装插件**（如果使用插件部分）：
```bash
vim
:PlugInstall
```

这个配置包含了以下主要功能：
- 基本设置（编码、行号、搜索等）
- 缩进和制表符设置
- 折叠和语法高亮
- 备份和撤销文件管理
- 自动命令（文件类型检测、自动格式化等）
- 配色方案
- 键盘映射和快捷键
- 插件管理（vim-plug）
- 完整的插件配置示例

你可以根据自己的需要启用或禁用某些功能，或者修改某些设置以适应你的工作环境。这个文件中的注释非常详细，可以帮助你了解每个设置的作用。好的，我将继续完成这个全面的 `.vimrc` 配置文件。我已经添加了插件管理部分，现在让我继续添加更多实用功能和插件配置。好的，我来继续完成这个 vim 配置文件。接下来需要添加更多实用的插件配置和自定义功能。我会重点完善以下几个部分：1. 添加 NERDTree 文件浏览器的配置；2. 配置代码补全和语法检查；3. 添加更多快捷键映射；4. 完善状态栏和主题设置。这些配置将让 vim 更加强大易用。</think>好的，让我继续完成这个 vim 配置文件：<|tool_calls_section_begin|><|tool_call_begin|>functions.Read:55<|tool_call_argument_begin|>{