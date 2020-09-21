<template>
  <div>
    <spaceLayout>
      <div class="about-container">
        <div class="about-title">
          Why <span class="pink-text">ArcLight</span> ?
        </div>
        <div class="about-subtitle">
          about Project <span class="pink-text">ArcLight</span>
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            Project ArcLight first started as a Arweave storage solution dapp, after the <a href="https://gitcoin.co/issue/ArweaveTeam/Bounties/32/100023546">Gitcoin bounty</a> was announced,
            we transferred our objective to make a truely free music distribution platform for the Hackthon project.
          </p>
          <p id="p2" class="about-p">
            Why choose ArcLight? We use Arweave's Permaweb as our storage for your wonderful artworks, we try everything to protect your copyright to your music, including encrypting your music
            to unreadable source on Arweave network explorer, so the people must pay to you as your price defined for your project to get the download source of your music.
          </p>
        </div><div class="about-title">
          All different <span class="pink-text">Sound</span>
        </div>
        <div class="about-subtitle">
          we support <span class="pink-text">single musics</span>, <span class="pink-text">albums</span>, <span class="pink-text">podcasts</span>, and <span class="pink-text">sound effects</span>
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            We support many types of artworks to upload, same as the title has been said, you can upload single music, album, podcast, sound effect to the ArcLight platform,
            with the powerful knowledge base we could get, you can have up to <strong>913</strong> different genres for single music and album to use, and the category for podcast is same as the Apple Podcast category.
          </p>
          <p id="p2" class="about-p">
            Express all your creativity to produce whatever you can think of, ArcLight helps you to store them up.
          </p>
        </div>
        <div class="about-title">
          <span class="pink-text">Encryption</span> and <span class="pink-text">Profit</span>
        </div>
        <div class="about-subtitle">
          a <span class="pink-text">secure way</span> to store your artworks
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            A great chance we can introduce our technic to have your artwork safe.
          </p>
          <p id="p2" class="about-p">
            Different to the DRM system, we simply encrypt your audio after you upload it into the broswer, after the encryption of our own, Arweave API will encrypt it again before upload to the
            Permaweb. Your listener can only get the source file after them pay to you, otherwise they can only get a small amount of music demo or the full trial (if you wish to disable the demo function).
            After the customers decided to pay for your work, they will use the official token <strong>AR</strong> pay to your account.
          </p>
        </div>
        <div class="about-title">
          <span class="pink-text">Ensure</span> your <span class="pink-text">rewards</span>
        </div>
        <div class="about-subtitle">
          <span class="pink-text">validation</span> of the payments
        </div>
        <div class="about-content">
          <p id="p1" class="about-p">
            When customers paying the AR to your account, we will generate a reciept transanction to the customer side, including the unix timestamp information, price paid to you,
            the target music or album custom bought, and your address. All the information will be saved into the reciept transanction with encryption.
          </p>
          <p id="p2" class="about-p">
            We will look back for the transactions for users, in order to prevent unofficail sign to the transactions, check the timestamp is correct to the payment, check the price and
            the price you required is right, after all the process is done and validated, the music source file will be able to deliver to the customers. And you will recieve the transaction as well.
          </p>
        </div>
        <div class="about-subtitle">
          <span class="pink-text">Thank you for choosing ArcLight!</span>
        </div>
      </div>
    </spaceLayout>
  </div>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

export default {
  components: {
    spaceLayout
  },
  mounted () {
    document.title = 'Why Choose ArcLight - ArcLight Music Distribution Platform'
  }
}
</script>

<style lang="less" scoped>
.about-container {
  margin: 80px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
  text-align: start;
}

.about-title {
  font-size: 32px;
  color: white;
}

.about-subtitle {
  font-size: 20px;
  color: white;
}

.about-content {
  color: white;
  margin-top: 20px;
  line-height: 28px;
  font-size: 18px;
}

.about-p {
  a {
    color: #EA6290;
    text-decoration: none;
  }
}

.pink-text {
  color: #EA6290;
}
</style>
