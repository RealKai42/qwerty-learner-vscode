<h1 align="center">
 Qwerty Learner VSCode
</h1>

<p align="center">
  为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件  VSCode 摸🐟版
</p>
<div align=center>
<img  src="https://imgur.com/YozF2Tw.png"/>
</div>

## 💡 演示

<div align=center>
<img  src="https://imgur.com/CBxwOnz.png"/>
</div>

## 📸 安装

[VSCode Plugin Market](https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner)

<br/>

本项目为 [Qwerty Learner](https://github.com/Kaiyiwing/qwerty-learner) 的 VSCode 插件版本，访问原始项目获得更好的体验。

## ✨ 实现原理

因为 VSC 没有提供对 Keypress 的回调，所以实现上使用了较为取巧的方式，监听用户当前输入文档的改变，然后删除用户输入。 用户可以在任意代码、文档页面开启软件进行英语打字练习，插件会自动删除用户输入的问题，不会对文档内容造成影响。

目前存在的 Bug，在用户输入速度较快(特别是同时按下多个键)时，可能会导致删除不完全，用户自行删除输入即可。

## 🎛 使用说明

### 一键启动

**Mac** `Ctrl + Shift + Q`

**Win** `Shift + Alt + Q`

可以在任意文档中使用快捷键启动，启动后插件将屏蔽用户对文档的输入，只需关注状态栏上的单词即可。

**⚠️ 切记需关闭中文输入法**，目前插件在开启中文输入法会有 Bug，待修复

### 章节、词典选择

打开 VSCode 命令面板，通过 “Qwerty” 前缀过滤，即可发现插件内置的命令。

<div align=center>
<img  src="https://imgur.com/9O4hb6S.png"/>
</div>

- Change Chapter 可以切换章节
- Change Dictionary 可以切换字典
- Start/Pause 可以开关插件，功能等价于一键启动快捷键

## 📕 词库列表

- CET-4
- CET-6

其他词库陆续添加中
