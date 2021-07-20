<p align="center">
   <img src="https://i.loli.net/2020/12/23/dwGqcLs1vObkg6Y.png" />
</p>
<h1 align="center">ArcLight</h1>
<p align="center">
  An artwork distribution platform where artists are given ownership and fair compensation<br>
  Great Thanks to ❤️ <a href="https://github.com/LittleSound">@LittleSound</a> ❤️ for contributing this project
</p>
<p align="center">
  <a href="https://arweave.net/LTNJ2HFOM2n1n6xlppD-pzw5_ab9AAO7bphPtWLju-0">Live Permaweb</a> for ArcLight<br>
  <strong>Now 1.2.0 Online</strong>
</p>
<p align="center">
  <a href="https://t.me/ArclightMusic">
    <img src="https://img.shields.io/badge/Chat%20on-Telegram-%235AA9E6?logo=telegram" />
  </a>
  <a href="https://discord.gg/bGZ2ZQ">
    <img src="https://img.shields.io/discord/766689493435678770.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
  </a><br>
  <img src="https://github.com/Arcucy/ArcLight/workflows/Node%20Build%20Test/badge.svg" />
  <img src="https://github.com/Arcucy/ArcLight/workflows/Production%20CI%20Build%20Test/badge.svg">
</p>


---

[简体中文](https://github.com/Arcucy/ArcLight/blob/master/doc/zh-cn.md)

---

## **A Peer-to-Peer Artwork Distribution Platform Built on the Permaweb**
> the goal of project ArcLight is to create a truly free artwork distribution platform.

We use __[Arweave’s](https://www.arweave.org/) permaweb__, a permanent and decentralized type of data storage built with blockchain technology. By encrypting your artworks to an unreadable source on the Arweave network, you are given full ownership of your intellectual property. Artists define the price for downloading their work, and users are able to support them directly. 

With ArcLight, we cut out the middleman so that we can give the power back to the artists.  

## **Wide Range of Content**
> we support singles, albums, podcasts, and sound effects, event paintings

Upload your artwork in multiple different formats! ArcLight supports singles, albums, podcasts, sound effects, and paintings in digital format
Express your creativity in whichever medium suits you best. ArcLight will give you the means to store and monetize your creations.    

## **Data Security and Compensation**
> a secure way to store your artwork

Through encryption and the decentralized storage mechanism of Arweave, the only way your follower has access to the source file is by payment. 
Payments are facilitated in Ar token, the native currency of the permaweb. Once the payment is made, we will generate a receipt including the UNIX timestamp, the price paid to you, the target artwork purchased, and your address. 

**Thank you for choosing ArcLight!**

## Credits

[@LittleSound](https://github.com/LittleSound) - Major Developer   

[@Garfield550](https://github.com/Garfield550) - Major Developer   

[@LemonNeko](https://github.com/LemonNekoGH) - Major Developer   

[@KagurazakaIzumi](https://github.com/KagurazakaIzumi) - Localization for Simplified/Traditional Chinese, Japanese   


### Interact with Arweave
```
yarn dev
```

### Deploy using a key
```
arweave deploy-dir ./dist --key-file ./secrets/key.json
```

### Reference
[arweave interface](https://www.arweave.org/build)    
[Arweave.js](https://github.com/ArweaveTeam/arweave-js): A library for interacting with the Arweave network from web applications and node.js programs.    
[Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy): A simple command line tool for deploying web apps, pages, and other files to the permaweb.    
## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report

# #FB5B9E
```
