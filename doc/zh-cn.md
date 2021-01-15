<p align="center">
   <img src="https://i.loli.net/2020/12/23/dwGqcLs1vObkg6Y.png" />
</p>
<h1 align="center">ArcLight</h1>
<p align="center">
  一个艺术家可以获得所有权和合理收益的艺术品发布平台<br>
  感谢 ❤️ <a href="https://github.com/LittleSound">@LittleSound</a> ❤️ 为本项目作出的贡献
</p>
<p align="center">
  <a href="https://arweave.net/LTNJ2HFOM2n1n6xlppD-pzw5_ab9AAO7bphPtWLju-0">永存网在线演示 </a>ArcLight<br>
  <strong>现在 1.2.0 在线</strong>
</p>
<p align="center">
  <a href="https://t.me/ArclightMusic">
    <img src="https://img.shields.io/badge/Chat%20on-Telegram-%235AA9E6?logo=telegram" />
  </a>
  <a href="https://discord.gg/bGZ2ZQ">
    <img src="https://img.shields.io/discord/766689493435678770.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
  </a><br>
  <img src="https://github.com/AyakaLab/ArcLight/workflows/Node%20Build%20Test/badge.svg" />
  <img src="https://github.com/AyakaLab/ArcLight/workflows/Production%20CI%20Build%20Test/badge.svg">
</p>



---

[English](https://github.com/Arcucy/ArcLight/blob/master/README.md)

---

## **基于永存网的艺术品发布平台**
> ArcLight 的目标旨在创造一个完全公平自由的艺术品发布平台

我们使用的是 Arweave（区块纺）提供的永存网，这是一种采用区块链技术构建的永久性和分散式的数据存储类型。在您上传您的作品前，我们会对您提交到浏览器的作品进行加密，使其成为在区块链上不可直接读取的文件类型，您将获得知识产权的完全所有权。作为艺术家，您甚至可以自定义属于你的价格来鼓励用户通过购买来支持您。 

在 ArcLight 平台上，我们可以省去中间人和经纪人带来的抽成，以此来把收益的所有权还给作者。

## **多种作品类型的支持**
> 我们支持单曲、专辑、播客、音效，以及任意的绘画作品

上传多种不同格式的作品！ArcLight 支持从单曲到博客，甚至是您录制的音效，以及精美的电子绘画作品，只要是能够授予（不包含版权）用户拥有的电子媒体格式通通都可以被支持。在最适合您的媒体中表达您的创造力。ArcLight 将为您提供存储创作并从中获得收益的办法！    

## **数据安全与补偿**
> 储存作品的安全方案

通过加密和 Arweave 的分散储存机制，我们可以限制用户通过区块链数据访问来获得需要付费的项目，获得原文件的唯一方法是通过付费来完成。

交易都必须通过 AR 代币或是将来支持的内部代币进行，AR 代币是 Arweave 永存网的流通货币。在用户付款后，我们将生成一个特定的收据来证明你拥有这个作品，包括 UNIX 时间戳，已经支付给您的价格，购买的目标作品以及您的钱包地址。

**感谢您选择 ArcLight**

## 感谢

[@LittleSound](https://github.com/LittleSound) - 主要开发者

[@Garfield550](https://github.com/Garfield550) - 主要开发者

[@KagurazakaIzumi](https://github.com/KagurazakaIzumi) - 简体中文、繁体中文、日本語的本地化作者


### 与 Arweave 交互
```
yarn dev
```

### 使用钱包密钥进行部署操作
```
arweave deploy-dir ./dist --key-file ./secrets/key.json
```

### 引用
[arweave interface](https://www.arweave.org/build)    
[Arweave.js](https://github.com/ArweaveTeam/arweave-js): A library for interacting with the Arweave network from web applications and node.js programs.    
[Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy): A simple command line tool for deploying web apps, pages, and other files to the permaweb.    

## 构建步骤

``` bash
# 安装依赖
yarn

# 使用热加载来同步开发 localhost:8090
yarn dev

# 构建优化后的实例
yarn build

# 构建实例并查看构建分析
yarn build --report
```
