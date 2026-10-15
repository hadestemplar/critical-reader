---
title: "Pika1.0实用教程｜AIGC视频入门"
slug: pika-video-generation-tutorial
source_url: "https://mp.weixin.qq.com/s/maLCP_KLqZwuAxKd2US_RQ"
account: "知识共享计划"
platform: weixin
publish_date: "2023-12-13"
word_count: 2843
char_count: 5667
images: 20
category: 教程型
tier: C
length_band: 短
collected_at: "2026-10-13T20:31:49+08:00"
collect_method: "anysearch 通用检索（查询词形如 \"mp.weixin.qq.com/s <主题>\"）→ mp.weixin.qq.com/s 分享短链 → Node.js 24 fetch（Chrome UA + Accept-Language zh-CN，OpenSSL 栈）→ 解析 HTML 中 id=\"js_content\" 容器，按 div 深度配对切片去标签，img 替换为 ![图N] 占位符，保留段落结构"
fetch_status: ok
---
![图1]

- Pika1.0简介‍‍

- Pika1.0功能特点

- Pika1.0基本参数与摄影机镜头

- Pika1.0实践案例

- AIGC视频应用案例：数字人直播

如今AIGC视频生成领域已经进入到2.0时代，除了可以直接用文字生成视频，如今已经可以使用图片搭配提示词来稳定的生成视频，而在众多Ai视频软件当中，11月底发布的Pika1.0是其中的佼佼者。‍‍‍‍‍‍‍‍‍‍

仅仅半个月时间，不仅Ai视频彻底出圈，引起了广大舆论的关注。‍‍‍

我们还欣喜地发现，已经有动手速度快的团队，使用Ai视频进行快速迭代SOP，每天生产上百部视频，进行商业变现与盈利。‍‍‍

甚至有媒体放言，如今AI视频已经释放了一个真正的内容工业化信号，后期剪辑、建模CG等传统数字媒体从业人员将会迎来一大波洗牌。

我们在之前的文章，已经分享了Pika的注册入门与使用，以及机器人指令的拆解。同时我们也翻译了一篇Ai视频提示词的教程，如果你对Ai视频感兴趣，或者你是一名数字媒体从业者，希望这篇内容能帮助到你。‍‍‍‍‍‍‍‍‍‍‍‍

Pika1.0功能特点

1.  图生视频

Prompt：Cinematic, happy laughing girl in office, Pixar style

![图2]

二.  视频扩展

用PIKA1.0生成了皮克斯风格的女孩。

![图3]

点Edit编辑，选择尺寸，使用视频扩展功能扩充。‍

![图4]

然后

![图5]

![图6]

![图7]

文生视频、图生视频、视频转视频等基础功能做的也不错。‍

更多请参考➡️【全网首发】PIKA1.0上手评测 - 你就是传奇

皮卡基本参数介绍

｜计算机图形学和动画领域的一些专用词汇。

Frames per second 每秒视频帧数

参数: -fps##

-调整每秒画面帧数，视频帧数越高，视频越流畅。

→ 8-24 (默认值一般在 24)

"frames per second"（帧率）是指每秒显示的图像帧数。它表示在动画或视频中每秒连续播放的静止图像数量。

帧率是衡量动画或视频流畅度的重要指标。较高的帧率意味着每秒显示的图像更多，动画的运动会更加流畅和真实。常见的帧率包括24帧/秒、30帧/秒和60帧/秒等。

较低的帧率可能导致动画或视频出现卡顿或不连续的感觉，而较高的帧率可以提供更平滑的视觉效果。选择适当的帧率取决于应用场景、目标设备和所需的视觉真实性。

在电影制作中，常用的标准帧率是24帧/秒，这种帧率在传统影院中被广泛采用。对于电视广播和视频游戏等应用，常见的帧率为30帧/秒或60帧/秒，这可以提供更流畅和逼真的动画效果。

需要注意的是，帧率也会受到硬件性能和显示设备的限制。一些高刷新率显示器可以支持更高的帧率，例如120帧/秒或更高，以提供更加流畅和响应的图像。

Motion 动作

参数: -motion#

-表示动作的强度，数值越高，视频中的运动就越强烈。

→ set from 1 to 4 → 1 is default

"motion"（动作）是指物体在场景中移动或改变位置、姿态的过程。它涉及到对象在时间上的连续变化，从一个状态到另一个状态的过渡。

Motion可以应用于静态图像、2D动画和3D动画。它可以描述物体的平移（沿着直线移动）、旋转（围绕轴线旋转）和缩放（尺寸的变化）等变换。通过在连续的帧之间应用适当的变换，可以模拟物体的运动和动态效果。

在计算机图形和动画软件中，通常使用关键帧动画（Keyframe Animation）来实现Motion效果。关键帧是表示对象在时间轴上的特定时刻的状态，通过在关键帧之间插入中间帧，系统可以自动计算和生成平滑的动画过渡。

除了基本的平移、旋转和缩放之外，Motion还可以包括其他效果，如形状变形（morphing）、运动模糊（motion blur）和路径动画（path animation）等。这些技术和效果可以增加动画的真实感和视觉吸引力，使图像或物体看起来更加生动和流畅。

Guidance scale 指导系数

参数: -gs##

-数值越高与文本提示越相关

→ use between 8 and 24 Pika default is on 12

Negative prompt 负提示词

参数: -neg

-表示否定提示，表示不希望出现在视频中的内容，负提示词使用

-示例：-neg变形、运动波动不稳定、嘈杂、质量差、失真。

"Neg morphing"通常用于描述在计算机图形和动画领域中应用的一种技术或效果。它是由"neg"（缩写自"negative"，即负面的）和"morphing"（变形）两个词组合而成。

Neg morphing常用于数字艺术、视觉效果和动画制作中，可以为图像添加独特的风格和视觉吸引力。通过应用负面的变形效果，可以创造出非传统、奇特或幻觉般的图像效果，为艺术作品或特殊效果提供独特的外观和视觉冲击力。

Aspect ratio 长宽比

参数: -ar #:#

-这是用来调整长宽比的-视频的宽度：高度。

→16:9、9:16、1:1、4:5，如果你使用【图像生成视频】，则为图像的默认值。

Seed 种子值

参数: -seed ###

-用于更一致的生成。目前仅修复种子在提示和否定提示都不变时保证一致性→接受：数字（默认为随机）

→示例提示符： /create提示符：XXX-种子123456789

→注意：生成视频的种子号可以在其文件名的末尾找到。

"seed"指的是随机数生成中的种子值。种子值是一个输入参数，用于初始化随机数生成器的起始状态。随机数生成器根据种子值生成一系列看似随机的数字序列。

在图形领域中，种子值常用于生成随机图案、纹理或粒子效果。通过在每次运行时使用相同的种子值，可以确保生成的随机序列是可重复的。这对于需要在多个场景或动画帧之间保持一致性的情况非常有用。

通过调整种子值，可以改变生成的随机序列，从而产生不同的图案或效果。这使得种子值成为控制随机性的参数，可以在图形生成过程中进行调整和实验，以获得所需的结果。

相机运动设置

Camera movement 相机移动

控制视频剪辑中的相机移动。

您可以选择缩放、平移或旋转。

请记住，一次只能使用其中一个，且不能组合使用。

ZOOM IN 放大

调整相机与主体的距离。您可以根据自己的喜好放大或缩小。

参数:

-camera zoom in

相机放大

-camera zoom out

相机缩小

PAN 平移

调整相机以显示更多背景，保持主体固定。选择上、下、左、右，或使用左、右组合。

参数:

-camera pan up / -camera pan down

-相机平移向上/-相机平移向下

-camera pan left / -camera pan right

-相机平移左/-相机平移右

-camera pan up left / -camera pan up right

-相机向左平移/-相机向右平移

-camera pan down left / -camera pan down right

-相机平移向左/-相机平移向右

ROTATE 旋转

重新定位相机以绕物体运行，或将框架倾斜到荷兰角。选项包括旋转顺时针（cw）、逆时针（ccw）或逆时针（acw）。

参数:

-camera rotate clockwise / -camera rotate cw

-相机顺时针旋转/-相机顺时针旋转cw

-camera rotate counterclockwise / counterclockwise ccw

-相机逆时针旋转/逆时针ccw

-camera rotate anticlockwise / -camera rotate acw

-相机逆时针旋转/-相机旋转acw

调节相机运动参数技巧

创建常规视频后添加相机运动/参数，通常会导致运动发生重大变化。为了达到预期的效果，您可以使用the rerun（重新运行）按钮几次，或者在最初上传图像时简单地添加相机运动。

你必须欣赏一张好的镜头。如果你第一次看到它时感到兴奋，那就选择那个镜头。全片通常会有一些问题，所以你可能会尝试100个版本而没有成功。但是如果你立刻感觉到，“是的，就是这样”，那么就使用那个视频。

PIKA 文本到图像& 文本到视频基本提示

基本提示结构

![图8]

负提示词示例：

-neg morphing, erratic fluctuation in motion, noisy, bad quality, distorted, poorly drawn, blurry,

grainy, low resolution, oversaturated, lack of detail, inconsistent lighting

-neg变形，运动波动不稳定，嘈杂，质量差，失真，绘制不良，模糊，颗粒感、分辨率低、过饱和、缺乏细节、光照不一致

PIKA +MJ结合生成视频

在Midjourney中，用来创建以下镜头的提示：

![图9]

-cinematic, female with astronaut helmet, Eye Level Shot, menace coming, sand - storm,mars desert, peach light, movie still --ar 16:9 --style raw

-电影，戴着宇航员头盔的女性，眼睛水平拍摄，威胁来临，沙尘暴，火星沙漠，桃光，电影静止--ar 16:9--风格原始

![图10]

-cinematic, a walking female astronaut with helmet, establishing shot, menace coming,sand - storm, mars desert, peach light, movie still --ar 16:9 --style raw

![图11]

-cinematic, a highly detailed spaceship flying through the dessert on mars, imagecapturing the dynamic and implied movement, establishing shot, menace coming, sand -storm, mars desert, peach light, movie still, Phantom High-Speed Camera --ar 16:9 --styleraw

-电影，一艘高度详细的宇宙飞船飞越火星上的甜点，图像捕捉动态和暗示的运动，建立镜头，威胁来临，沙尘暴，火星沙漠，桃光，电影静止，幻影高速摄像机--ar 16:9--styleraw

![图12]

-cinematic, macro photography, extreme close up female eye, astronaut helmet, menacecoming, sand - storm, mars desert, peach light, movie still --ar 16:9 --style raw

![图13]

-cinematic, female with astronaut helmet, Eye Level Shot, menace coming, sand - storm,mars desert, peach light, movie still --ar 16:9 --style raw

✅视频可以通过访问此链接看作者视频

https://kh18s6uvdi.feishu.cn/docx/GzYRdznMKoRAbux29zycgWvinxf

AIGC视频生成

案例一：MJ生成美女穿搭图片+图片生成舞蹈视频+短视频直播‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍‍

特点：简单大量起号，门槛低，发展方向可以尝试‍‍‍‍‍

建议：单纯做美女直播门槛太低了，很快观众就厌倦了。但是可以做一些服装方向的探索，以及搭配AI语音导购，做直播带货。

![图14]

案例二：AI神话故事+MJ生成怪兽图片+图片生成视频+短视频

![图15]

![图16]

①选题分析，如何复制？

讲解山海经故事，shen 话故事类流量一直不错。

如何复制？

可以迁移到西游记，聊斋志异等，或者西方的神话故事，比如古希腊罗马神话，效果可能会更好。

②AI工具分析

图片用MIdjourney或SD制作，核心是奇异故事科普和场景配图。

故事由ChatGPT出文案，然后MJ配图，或者直接用ChatGPT完成作图，大概20分钟一篇笔记。

③赛道分析前期制作时间耗时比较长，图片风格会有点偏移自己想要的，大概一个作品可能需要20-30分钟，不如纯图文简单操作，效率低一些。核心﻿是训练GPT4.0确定图片的风格，以及批量列出故事主题，把文案生产快速压缩到5-10分钟。如何放大？

适合矩阵和全平台通铺操作。

如何变现？

蒲公英接商单或者开发周边IP。

案例三：Ai视频定制+MJ定制图片+图片生成视频‍‍‍‍‍‍‍‍

很多人会有定制视频的需求，比如把家里的宝宝生成电影人物，然后输出脚本生成专属的小视频。‍‍

流量还可以，简单适合大量复制，但是上限非常高。‍‍

卡兹卡使用AI生成《流浪地球3》，甚至吸引来了导演郭帆。‍‍‍

![图17]

围观地址

https://www.bilibili.com/video/BV1hF411f7rg/?spm_id_from=333.337.search-card.all.click&vd_source=afd3a23d4fd2fbdf71a9ef28677b3ee1

如果你想了解更多Pi ka相关内容，请参考此链接⬇️‍‍‍‍‍‍‍‍‍‍‍

🐹Pika 介绍及使用指北

https://kh18s6uvdi.feishu.cn/docx/FF1TdgHKUoEcDNxh5ECcTh1ynjh?from=from_copylink

最后，如果你对人工智能应用、知识管理、Web3感兴趣，欢迎加入我们的社群～‍

更多AIGC项目👏欢迎访问

![图18]

https://kh18s6uvdi.feishu.cn/docx/PxPkdSD24oczCsxSPW2cOesYnrf?from=from_copylink

更多项目

💜知识共享计划：全球中文圈优质知识共享平台

![图19]

｜有效利他的开源知识流动社区。

🦊AI生产力Plus项目企划：先进AIGC团体都在这。

![图20]

“善用AI，是未来通往知识世界的信息公民基本素养。”

——图灵奖获得者埃兰
