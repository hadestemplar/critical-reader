---
title: "Python制作进度条，原来有这么多方法！"
slug: python-progress-bar-methods
source_url: "https://mp.weixin.qq.com/s/cC3xhCTJthQmJyPORB4DoA"
account: "AI实力派"
platform: weixin
publish_date: "2021-02-21"
word_count: 647
char_count: 2164
images: 10
category: 教程型
tier: C
length_band: 短
collected_at: "2026-10-13T20:31:48+08:00"
collect_method: "anysearch 通用检索（查询词形如 \"mp.weixin.qq.com/s <主题>\"）→ mp.weixin.qq.com/s 分享短链 → Node.js 24 fetch（Chrome UA + Accept-Language zh-CN，OpenSSL 栈）→ 解析 HTML 中 id=\"js_content\" 容器，按 div 深度配对切片去标签，img 替换为 ![图N] 占位符，保留段落结构"
fetch_status: ok
---
‍

点击关注"Python学习与数据挖掘"

更多超级干货第一时间推送给你哦！！！

如果你之前没用过进度条，八成是觉得它会增加不必要的复杂性或者很难维护，其实不然。要加一个进度条其实只需要几行代码。在这几行代码中，我们可以看看如何在命令行脚本以及 PySimpleGUI UI 中添加进度条。

![图1]

下文将介绍 4 个常用的 Python 进度条库：

Progress

第一个要介绍的 Python 库是 Progress。

你只需要定义迭代的次数、进度条类型并在每次迭代时告知进度条。

import timefrom progress.bar
import IncrementalBarmylist = [1,2,3,4,5,6,7,8]
bar = IncrementalBar( Countdown , max = len(mylist))
for item in mylist:
  bar.next()
  time.sleep(1)
  bar.finish()
Progress 实现的进度条效果如下：

![图2]

Progressbar 的增量进度条

如果你不喜欢该进度条的格式，还可以从以下格式中挑选：

![图3]

ProgressBar 支持的进度条类型。

相关文档：https://pypi.org/project/progress/1.5/

tqdm

下面我们看一下 tqdm 库。

和之前见过的库差不多，这两行代码也非常相似，在设置方面有一点点不同：

import timefrom tqdm
import tqdmmylist = [1,2,3,4,5,6,7,8]
for i in tqdm(mylist):
  time.sleep(1)
tqdm 实现的进度条效果如下：

![图4]

这个进度条也提供了几种选项。

相关文档：https://tqdm.github.io/

Alive Progress

顾名思义，这个库可以使得进度条变得生动起来，它比原来我们见过的进度条多了一些动画效果。

![图5]

从代码角度来说比较相似：

from alive_progress import alive_barimport
timemylist = [1,2,3,4,5,6,7,8]
with alive_bar(len(mylist)) as bar:
  for i in mylist:
    bar()
    time.sleep(1)
进度条的外观和预期差不多：

![图6]

这种进度条有一些与众不同的功能，使用起来会比较有趣，功能详情可见项目：https://github.com/rsalmei/alive-progress

PySimpleGUI

用 PySimpleGUI 得到图形化进度条

我们可以加一行简单的代码，在命令行脚本中得到图形化进度条。

![图7]

为了实现上述内容，我们需要的代码是：

import PySimpleGUI as sgimport
timemylist = [1,2,3,4,5,6,7,8]
for i, item in enumerate(mylist):
  sg.one_line_progress_meter( This is my progress meter! , i+1, len(mylist),  -key- )
  time.sleep(1)

PySimpleGUI 应用程序中的进度条

项目作者之前曾经在 GitHub 上讨论过「如何快速启动 Python UI，然后使用 UI 创建比较工具」。在这个项目里，作者还讨论了一下如何集成进度条。

![图8]

代码如下：

import PySimpleGUI as sgimport
timemylist = [1,2,3,4,5,6,7,8]
progressbar = [ [sg.ProgressBar(len(mylist), orientation= h , size=(51, 10), key= progressbar )]]
outputwin = [ [sg.Output(size=(78,20))]]
layout = [ [sg.Frame( Progress ,layout= progressbar)], [sg.Frame( Output , layout = outputwin)], [sg.Submit( Start ),sg.Cancel()]]
window = sg.Window( Custom Progress Meter , layout)
progress_bar = window[ progressbar ] while True:
  event, values = window.read(timeout=10)
  if event ==  Cancel  or event is None:
    break
  elif event ==  Start :
    for i,item in enumerate(mylist):
      print(item)
      time.sleep(1)
      progress_bar.UpdateBar(i + 1)window.close()没错，在 Python 脚本中使用进度条只需要几行代码，一点也不复杂。有了进度条，以后也不用再猜测脚本运行地怎么样了。

![图9]

大家好，最后给大家免费分享 Python 三件套：《ThinkPython》、《简明Python教程》、《Python进阶》的PDF电子版。如果你是刚入门的小白，不用想了，这是最好的学习教材。

现在免费分享出来，有需要的读者可以下载学习，在下面的公众号里回复关键字：三件套，就行。

领取方式：

长按下方扫码，关注后发消息 [三件套]

![图10]
