<template>
  <spaceLayout>
    <div class="music">
      <!-- Back Button -->
      <div class="music-header">
        <a @click="$router.go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="title">
            <span class="title-text">
              {{ audio.name }}
            </span>
            <span class="title-back">
              Back
            </span>
          </span>
        </a>
      </div>
      <!-- Player -->
      <aplayer id="aplayer123456" v-if="audio !== ''" :audio="audio" :lrcType="0" class="music-player" theme="#E56D9B" />
      <audio v-show="false" controls>
        <source :src="audio" type="audio/mp3">
      </audio>
      <!-- Download -->
      <div v-if="owned" class="music-download">
        <v-btn
          block
          large
          light
          outlined
          rounded
          color="#E56D9B"
          :height="44"
        >
          DOWNLOAD
        </v-btn>
      </div>
      <!-- Buy -->
      <div v-else class="music-download">
        <p>
          Sale for {{ price }} AR
        </p>
        <v-btn
          block
          large
          light
          outlined
          rounded
          color="#E56D9B"
          :height="44"
          @click.stop="buyClick"
        >
          BUY
        </v-btn>
      </div>
      <!-- Payed Users -->
      <div class="music-sold">
        <p class="music-sold-title">
          These users have already bought this song.
        </p>
        <div class="music-sold-users">
          <div
            class="user-card"
            v-for="(user, index) in users"
            :key="index"
            :style="'z-index:' + -index"
          >
            <miniAvatar :size="38" :src="user.avatar" />
          </div>
        </div>
      </div>
      <!-- Title -->
      <div id="title">{{ audio.name }}</div>
    </div>
    <!-- Pay Dialog -->
    <v-dialog
      v-model="showDialog"
      width="360"
    >
      <v-card dark>
        <div class="pay">
          <h3 class="pay-title">
            Payment of 「{{ audio.name }}」
          </h3>
          <div class="pay-icon">
            <img src="@/assets/image/paymentCompleted.png" alt="Completed" />
          </div>
          <p class="pay-intro">
            Succeed to unlock the music！
          </p>

          <v-btn class="pay-button" depressed color="#E56D9B" block @click="showDialog = false">
            BACK TO MUSIC PLAYER
            <v-icon class="pay-button-icon">mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </spaceLayout>
</template>

<script>

import spaceLayout from '@/components/Layout/Space'
import miniAvatar from '@/components/User/MiniAvatar'

import mp3 from '@/assets/music/FlowerDance.mp3'
import album from '@/assets/music/FlowerDance.jpg'
import api from '@/api/api'

export default {
  components: {
    spaceLayout,
    miniAvatar
  },
  data () {
    return {
      musicId: '',
      audio: '',
      price: 4.3,
      owned: false,
      showDialog: false,
      audioList: {
        flowerdance: {
          name: 'Flower Dance',
          artist: 'DJ OKAWARI',
          url: mp3,
          cover: album
        }
      },
      users: [
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        },
        {
          avatar: 'https://picsum.photos/510/300?random'
        }
      ]
    }
  },
  watch: {
    // $route (val) {
    //   if (this.audioList[val.params.id] !== undefined || this.audioList[val.params.id] !== '') this.audio = this.audioList[val.params.id]
    // }
  },
  mounted () {
    // if (this.audioList[this.$route.params.id] !== undefined || this.audioList[this.$route.params.id] !== '') this.audio = this.audioList[this.$route.params.id]
    // else this.$router.push({ name: 'Landing' })

    // this.audio = this.audioList.flowerdance

    this.getMusic(this.$route.params.id)
  },
  methods: {
    buyClick () {
      // 这里并没有真的付款代码，而是直接将参数设定为付款成功的状态。
      this.showDialog = true
      this.owned = true
    },
    async getMusic (id) {
      const audio = {
        name: '',
        artist: '',
        url: null,
        cover: null
      }
      // 根据 id 获取数据块对应的 Tag，指定作者
      const musicInfo = await api.arweave.getTransactionDetail(id)
      audio.artist = this.getTag(musicInfo, 'Author-Username')

      // 根据 id 获取数据内容
      const single = JSON.parse(await api.arweave.getTransactionDataDecodedString(id))
      // 歌曲名称
      audio.name = single.title
      // 获取封面和音频
      audio.cover = await api.arweave.getCover(single.cover)
      const music = await api.arweave.getMusic(single.music)

      // 挂载音频到一个 URL，并指定给 audio.url
      const reader = new FileReader()
      reader.readAsArrayBuffer(new Blob([music.data], { type: music.type }))
      reader.onload = (event) => {
        const url = window.webkitURL.createObjectURL(new Blob([event.target.result]))
        audio.url = url
        this.audio = audio
      }
    },
    getTag (data, key) {
      const tags = data.get('tags')
      for (let i = 0; i < tags.length; i++) {
        let newKey = tags[i].get('name', { decode: true, string: true })
        if (newKey === key) return tags[i].get('value', { decode: true, string: true })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.music {
  margin: 20px auto;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;

  &-header {
    text-align: left;
    a {
      cursor: pointer;
      font-size: 20px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 22px;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;

      &:hover {
        i {
          transform: translateX(-5px);
        }
        .title {
          &-text {
            transform: translateY(-22px);
          }
          &-back {
            transform: translateY(-22px);
          }
        }
      }

      i {
        color: #E56D9B;
      }

      .title {
        overflow: hidden;
        height: 22px;
        display: inline-flex;
        flex-direction: column;
        &-text {
          margin: 0;
        }
        &-back {
          margin: 0;
        }
      }
    }
  }

  &-player {
    max-width: 588px;
    margin: 0 auto;
    margin-top: 96px;
    border-radius: 5px;
    background: #7e7e7e4d;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
    overflow: hidden;
    &::before {
      transition: all 0.3s;
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      left: 0; right: 0;
      backdrop-filter: blur(2px);
      z-index: -1;
      margin: -30px;
    }
    /deep/ &.aplayer .aplayer-info {
      .aplayer-music {
        .aplayer-title {
          color: #E56D9B;
        }
        .aplayer-author {
          color: white;
        }
      }
      .aplayer-controller .aplayer-time .aplayer-icon {
        &:hover path {
          fill: #E56D9B;
        }
      }
    }
  }
  &-download {
    margin: 48px auto 0;
    max-width: 240px;
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 20px;
      margin: 0 0 8px;
    }
  }
  &-sold {
    margin-top: 24px;
    &-title {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #B2B2B2;
      line-height: 20px;
      margin-bottom: 15px;
    }
    &-users {
      display: flex;
      justify-content: center;
      .user-card {
        width: 38px;
        min-width: 38px;
        height: 38px;
        min-height: 38px;
        margin-left: -19px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}

.pay {
  padding: 24px;
  &-title {
    text-align: left;
    font-size: 20px;
    font-weight: 500;
    color: white;
    line-height: 28px;
    margin: 0 0 24px;
  }
  &-icon {
    text-align: center;
    margin-bottom: 16px;
    img {
      width: 128px;
      height: 128px;
      min-width: 128px;
      min-height: 128px;
    }
  }
  &-intro {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: white;
    line-height: 22px;
    margin: 0 0 54px;
  }
  &-button {
    &-icon {
      font-size: 16px;
    }
  }
}

#title {
  font-family: "lato", sans-serif;
  color: #FFF;
  margin-top: 90px;
  font-weight: 300;
  font-size: 120px;
  text-align: center;
  background: -webkit-linear-gradient(white, #dbdde0, #38495a);
  background-clip: text;
  -webkit-background-clip: text;
  animation-duration: 6s;
  animation-timing-function: ease-in-out;
  animation-name: animTitle;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  transition: all 0.3s;
}

@keyframes animTitle {
  0% {
    transform: translateY(-26px);
    opacity: 0;
  }

  30%,
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@media screen and (max-width: 1200px) {
  #title {
    font-size: 97px;
  }
}

@media screen and (max-width: 992px) {
  #title {
    font-size: 74px;
  }
}

@media screen and (max-width: 768px) {
  #title {
    font-size: 60px;
  }
}
@media screen and (max-width: 640px) {
  #title {
    font-size: 44px;
  }
}
@media screen and (max-width: 480px) {
  #title {
    font-size: 27px;
  }
}
</style>
