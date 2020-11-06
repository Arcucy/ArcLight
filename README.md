<p align="center">
   <img src="https://i.loli.net/2020/10/09/BJeO3aLY6lHqs7z.png" />
</p>
<h1 align="center">ArcLight</h1>
<p align="center">
  An Arweave Music and Podcast Distribution App for users to publish, listen and pay to the encrypted music<br>
  Great Thanks to ❤️ <a href="https://github.com/LittleSound">@LittleSound</a> ❤️ for contributing this project
</p>
<p align="center">
  <a href="https://arweave.net/CUdQRumObOi5zDefzLzsdz6U_LTcM5EMRzjemiiIJ_U">Live Permaweb</a> for ArcLight<br>
  <strong>Now 1.0.4 Online</strong>
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


## Why ArcLight ?
> about Project ArcLight

Project ArcLight first started as an Arweave storage solution dapp, after the [Gitcoin bounty](https://gitcoin.co/issue/ArweaveTeam/Bounties/32/100023546) was announced, we transferred our objective to make a truly free music distribution platform for the Hackathon project.    

Why choose ArcLight? We use Arweave's Permaweb as our storage for your wonderful artworks, we try everything to protect your copyright to your music, including encrypting your music to an unreadable source on Arweave network explorer, so the people must pay to you as your price defined for your project to get the download source of your music.    

## All different Sound
> we support single music, albums, podcasts, and sound effects

We support many types of artworks to upload, same as the title has been said, you can upload single music, album, podcast, sound effect to the ArcLight platform, with the powerful knowledge base we could get, you can have up to 913 different genres for single music and album to use, and the category for the podcast is same as the Apple Podcast category.    

Express all your creativity to produce whatever you can think of, ArcLight helps you to store them up.    

## Encryption and Profit
> a secure way to store your artworks

A great chance we can introduce our technic to have your artwork safe.    

Different from the DRM system, we simply encrypt your audio after you upload it into the broswer, after the encryption of our own, Arweave API will encrypt it again before uploading it to the Permaweb. Your listener can only get the source file after they pay to you, otherwise, they can only get a small amount of music demo or the full trial (if you wish to disable the demo function). After the customers decided to pay for your work, they will use the official token AR pay to your account.    

## Ensure your rewards
> validation of the payments

When customers paying the AR to your account, we will generate a receipt transaction to the customer side, including the UNIX timestamp information, the price paid to you, the target music or album custom bought, and your address. All the information will be saved into the receipt transaction.    

We will look back for the transactions for users, in order to prevent unauthorized official sign to the transactions, check the timestamp is correct to the payment, check the price and the price you required is right, after all the process is done and validated, the music source file will be able to deliver to the customers. And you will receive the transaction as well.    

**Thank you for choosing ArcLight!**

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

# run unit tests
yarn unit

# run all tests
yarn test
```

