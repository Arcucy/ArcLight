<template>
  <spaceLayout>
    <div class="music">
      <!-- Back Button -->
      <div class="music-header">
        <a @click="$router.go(-1)">
          <v-icon>mdi-chevron-left</v-icon>
          <span class="header-title">
            <span class="header-title-text">
              {{ info.name || 'Back' }}
            </span>
            <span class="header-title-back">
              Back
            </span>
          </span>
        </a>
      </div>
      <div class="music-playerbox">
        <div v-if="!loading && info.genre" class="music-playerbox-tag">
          {{ info.genre }}
        </div>
        <div v-if="loading && pct" class="music-playerbox-tag">
          {{ pct }}%
        </div>
        <!-- Player -->
        <aplayer v-if="audio !== ''" :music="audio" :lrcType="0" class="music-player" theme="#E56D9B" />
        <!-- Loading -->
        <div v-if="loading" class="music-loading">
          <v-progress-linear
            :indeterminate="!pct"
            v-model="pct"
            color="#E56D9B"
          />
          <p>
            Music loading...
          </p>
        </div>
      </div>
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
      <div id="title">{{ info.name }}</div>
      <!-- Artist -->
      <div class="music-artist">
        <router-link :to="{ name: 'User', params: { id: artist.id } }">
          <miniAvatar :size="64" color="#E56D9B" :src="artist.avatar" />
        </router-link>
        <router-link class="music-artist-username" :to="{ name: 'User', params: { id: artist.id } }">
          {{ artist.username }}
        </router-link>
      </div>
      <p class="music-desp" v-html="info.desp" />
    </div>
    <!-- Pay Dialog -->
    <v-dialog
      v-model="showDialog"
      width="360"
    >
      <v-card dark>
        <div class="pay">
          <h3 class="pay-title">
            Payment of 「{{ info.name }}」
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
import decode from '@/util/decode'

export default {
  components: {
    spaceLayout,
    miniAvatar
  },
  data () {
    return {
      musicId: '',
      audio: '',
      info: {
        name: '',
        artist: '',
        artistId: '',
        desp: '',
        genre: ''
      },
      artist: {
        id: '',
        avatar: 'loading',
        username: 'Artist loading...'
      },
      pct: 0,
      price: 4.3,
      owned: false,
      showDialog: false,
      loading: true,
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
  mounted () {
    this.getMusicInfo(this.$route.params.id)
  },
  destroyed () {
    // 释放 webkitURL
    if (this.audio && this.audio.url) window.webkitURL.revokeObjectURL(this.audio.url)
  },
  methods: {
    buyClick () {
      // 这里并没有真的付款代码，而是直接将参数设定为付款成功的状态。
      this.showDialog = true
      this.owned = true
    },
    /** 获取音乐信息 */
    async getMusicInfo (id) {
      this.loading = true
      try {
        const transaction = await api.arweave.getTransactionDetail(id)
        const tags = await api.arweave.getTagsByTransaction(transaction)
        const data = JSON.parse(decode.uint8ArrayToString(transaction.data))
        // 根据类型进行初始化
        switch (tags.Type) {
          case 'single-info': // 单曲
            await this.initSingle(tags, data)
            break
          case 'album-info': // 专辑
            await this.initAlbum(tags, data, this.$route.query.album)
            break
          case 'podcast-info': // 播客
            await this.initPodcast(tags, data)
            break
          case 'soundeffect-info':
            await this.initSoundeffect(tags, data)
            break
          default:
            console.error('[Wrong txid] tags / data:', tags, data)
            this.$message.error('Wrong txid')
            this.$router.replace({ name: 'Landing' })
            return
        }
      } catch (e) {
        console.error('[Failed to get music information]', e)
        this.$message.error('Failed to get music information')
      }
      this.loading = false
    },
    /** 初始化单曲 */
    async initSingle (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介、类型
      audio.title = data.title
      this.info.name = data.title
      this.info.desp = data.desp
      this.info.genre = tags['Genre']
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      audio.src = await this.getAudio(data.music)
      this.audio = audio
    },
    /** 初始化专辑 */
    async initAlbum (tags, data, albumNum = 1) {
      const index = albumNum - 1
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介、类型
      audio.title = data.music[index].title
      this.info.name = data.music[index].title
      this.info.desp = data.desp
      this.info.genre = tags['Genre']
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      audio.src = await this.getAudio(data.music[index].id)
      this.audio = audio
    },
    /** 初始化播客 */
    async initPodcast (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介
      audio.title = data.title
      this.info.name = data.title
      this.info.desp = data.desp
      this.info.genre = tags['Category']
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      audio.src = await this.getAudio(data.program)

      this.audio = audio
    },
    /** 初始化音效 */
    async initSoundeffect (tags, data) {
      const audio = {}
      // 作者信息
      this.initArtist(audio, tags)
      // 标题、简介
      audio.title = data.title
      this.info.name = data.title
      this.info.desp = data.desp
      // 获取封面和音频
      audio.pic = await this.getCover(data.cover)
      audio.src = await this.getAudio(data.audio)

      this.audio = audio
    },
    /** 初始化作者信息 */
    initArtist (audio, tags) {
      audio.artist = tags['Author-Username']
      this.info.artist = tags['Author-Username']
      this.info.artistId = tags['Author-Address']
      this.getArtist(tags['Author-Address'], audio)
    },
    getAudio (id) {
      return new Promise(async (resolve, reject) => {
        try {
          const music = await api.arweave.getMusic(id, pct => { this.pct = pct })
          // 挂载音频到一个 URL，并指定给 audio.pic
          const reader = new FileReader()
          reader.readAsArrayBuffer(new Blob([music.data], { type: music.type }))
          reader.onload = (event) => {
            const url = window.webkitURL.createObjectURL(new Blob([event.target.result]))
            resolve(url)
          }
        } catch (e) {
          console.error('[Failed to get audio data]', e)
          this.$message.error('Failed to get audio data')
          resolve('')
        }
      })
    },
    async getArtist (id, audio) {
      this.artist.id = id
      try {
        const user = await api.arweave.getIdFromAddress(id)
        if (user) {
          this.artist.username = user.data
          this.info.artist = user.data
          if (audio) audio.artist = user.data
        } else {
          this.artist.username = 'unknown'
          this.$message.error('Failed to get author information')
        }
      } catch (e) {
        console.error('[Failed to get author information]', e)
        this.$message.error('Failed to get author information')
      }
      try {
        const avatar = await api.arweave.getAvatarFromAddress(id)
        this.artist.avatar = avatar || ''
      } catch (e) {
        console.error('[Failed to get author avatar]', e)
        this.$message.error('Failed to get author avatar')
        this.artist.avatar = ''
      }
    },
    async getCover (id) {
      try {
        const cover = await api.arweave.getCover(id)
        return cover
      } catch (e) {
        console.error('[Failed to get cover]', e)
        this.$message.error('Failed to get cover')
        return ''
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
  margin: 48px auto 20px;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;

  &-header {
    text-align: left;
    a {
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      font-size: 20px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 25px;

      &:hover {
        i {
          transform: translateX(-5px);
        }
        .header-title {
          &-text {
            transform: translateY(-25px);
            white-space: nowrap;
          }
          &-back {
            transform: translateY(-25px);
          }
        }
      }

      i {
        color: #E56D9B;
      }

      .header-title {
        overflow: hidden;
        height: 25px;
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

  &-playerbox {
    height: 162px;
    margin: 0 auto;
    max-width: 588px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    &-tag {
      min-width: 60px;
      height: 30px;
      padding: 0 5px;
      margin-left: 5px;
      background: #F9C1D7;
      border-radius: 2px 2px 0px 0px;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 30px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
  }

  &-player {
    max-width: 588px;
    width: 100%;
    margin: 0;
    // margin: 96px auto 0;
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
      padding: 14px 7px 5px 10px;
      .aplayer-music {
        .aplayer-title {
          color: #E56D9B;
        }
        .aplayer-author {
          color: white;
        }
      }
      .aplayer-controller .aplayer-time {
        color: white;
        .aplayer-icon {
          path {
            fill: white;
          }
          &:hover path {
            fill: #E56D9B;
          }
          &.inactive {
            opacity: 0.5;
          }
          &.aplayer-icon-mode {
            display: none;
          }
        }
        .aplayer-volume-wrap .aplayer-volume-bar-wrap {
          &:after {
            background-color: #0000;
            box-shadow: none;
          }
        }
      }
    }
  }

  &-loading {
    max-width: 588px;
    width: 100%;
    height: 66px;
    // margin: 96px auto 0;
    border-radius: 5px;
    background: #7e7e7e4d;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
    overflow: hidden;
    backdrop-filter: blur(2px);
    p {
      color: white;
      margin: 21px 0 0;
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

  &-artist {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    a {
      text-decoration: none;
    }

    &-username {
      font-size: 14px;
      font-weight: 500;
      color: white;
      line-height: 20px;
      margin: 8px 0 0;
    }
  }

  &-desp {
    width: 720px;
    margin:60px 0 0;
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    color: white;
    line-height: 22px;
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
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
