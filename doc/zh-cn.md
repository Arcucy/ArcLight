<p align="center">
   <img src="https://i.loli.net/2020/10/09/BJeO3aLY6lHqs7z.png" />
</p>
<h1 align="center">ArcLight</h1>
<p align="center">
  一个 Arweave 音乐和播客分发应用程序，供用户发布，收听和支付加密音乐<br>
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


## 为什么选择 ArcLight ?
> ArcLight (弧光) 计划

Project ArcLight（弧光计划）最初是以 Arweave 平台的存储系统来设计和构建的，在 [Gitcoin bounty](https://gitcoin.co/issue/ArweaveTeam/Bounties/32/100023546) 公布之后，我们把目光放在了打造一个真正开放和自由的音乐分发平台来完成这个 GitCoin Bounty 所需的要求。

为什么选择 ArcLight？我们使用 Arweave 的永存网作为我们的储存空间来存放你的精美作品，我们尽全力去保护你对你作品的版权所有信息，这当然就包括把你的音乐作品加密为在开放的区块链浏览器中无法被直接解码的数据，这样一来，用户必须支付你所指定的价格来获取下载信息，当然你也可以设置试听时长来防止音乐录制盗用。   

## 所有你能想到的声音
> 我们支持单曲音乐, 专辑发布, 播客电台，以及音效

我们支持各种类型的作品可供你上传，就如同标题内容所述，你可以上传单曲、专辑、播客、音效到 ArcLight 平台上，有了强大的知识库，您可以使用多达 913 种不同类型的音乐和专辑的流派类别，并且播客的类别与 Apple Podcast 类别完全一致。   
   
发挥你所有的创造力，创作你能想到的任何东西，ArcLight 能帮你把它们都储存起来。

## Encryption and Profit
> 安全的策略 来储存和共享你的作品

一次不错的机会来介绍我们的技术是如何来确保您的艺术品安全的   
   
与 DRM 系统不同的是，我们只是在您上传到浏览器内部后对您的音频进行简单的加密，经过我们自己的加密后，Arweave API 会再次加密后再上传到 Permaweb（永存网）。您的听众只有在向您付费后才能获得源文件，否则只能获得少量的音乐试听或完整的试用版（如果您想关闭试听功能）。客户决定为你的作品付费后，会使用官方代币 AR 支付到你的账户。   

## 确保 你的 收益
> 验证 所有支付交易

当客户向您的帐户支付 AR 时，我们将向客户方生成收据交易，包括 UNIX 时间戳信息，支付给您的价格，购买的目标音乐或专辑以及您的地址。所有信息将被保存到收据交易中。   
   
我们会为用户找回交易，以防止未经授权的官方签名进行交易，检查时间戳是否正确，检查价格和所需价格是否正确，在所有过程都经过验证之后，音乐源文件将能够交付给客户。您也会收到交易所支付的帐额。   

**感谢你选择 ArcLight！!**

### 与 Arweave 互动
```
yarn dev
```

### 使用 钱包密钥 来部署一个实例
```
arweave deploy-dir ./dist --key-file ./secrets/key.json
```

### 参考
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

