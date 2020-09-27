<template>
    <div class="works">
      <!-- Singles Sellings -->
      <div v-if="single.loading || single.list.length > 0" class="songs">
        <div class="songs-header">
          <h4>
            New Singles Sellings
          </h4>
          <router-link :to="{ name: 'UserSingle', params: { id: $route.params.id } }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox list-id="single" card-id="single-card" :list-update="single.list">
          <singleCard
            id="single-card"
            class="single-card"
            v-for="(item, index) in single.list"
            :key="index"
            :card="item"
          />
          <loadCard v-if="single.loading" />
        </scrollXBox>
      </div>
      <!-- Albums Sellings -->
      <div v-if="album.loading || album.list.length > 0" class="songs">
        <div class="songs-header">
          <h4>
            New Albums Sellings
          </h4>
          <router-link :to="{ name: 'UserAlbum', params: { id: $route.params.id } }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox list-id="albums" card-id="albums-card" :list-update="album.list">
          <albumCard
            id="albums-card"
            class="album-card"
            v-for="(item, index) in album.list"
            :key="index"
            :card="item"
          />
          <loadCard v-if="album.loading" width="188px" />
        </scrollXBox>
      </div>
      <!-- Sound Sellings -->
      <div v-if="sound.loading || sound.list.length > 0" class="songs">
        <div class="songs-header">
          <h4>
            New Sound Sellings
          </h4>
          <router-link :to="{ name: 'UserSound', params: { id: $route.params.id } }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox list-id="sound" card-id="sound-card" :list-update="sound.list">
          <singleCard
            id="sound-card"
            class="single-card"
            v-for="(item, index) in sound.list"
            :key="index"
            :card="item"
          />
          <loadCard v-if="sound.loading" />
        </scrollXBox>
      </div>
      <!-- Podcast Sellings -->
      <div v-if="podcast.loading || podcast.list.length > 0" class="songs">
        <div class="songs-header">
          <h4>
            New Podcast Sellings
          </h4>
          <router-link :to="{ name: 'UserPodcast', params: { id: $route.params.id } }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox list-id="podcast" card-id="podcast-card" :list-update="podcast.list">
          <singleCard
            id="podcast-card"
            class="single-card"
            v-for="(item, index) in podcast.list"
            :key="index"
            :card="item"
          />
          <loadCard v-if="podcast.loading" />
        </scrollXBox>
      </div>
    </div>
</template>

<script>
import api from '@/api/api'
import decode from '@/util/decode'
import { mapActions, mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space'
import userInfo from '@/components/User/UserInfo'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'
import scrollXBox from '@/components/ScrollXBox'
import userCard from '@/components/User/UserCard'
import loadCard from '@/components/Song/LoadCard'

export default {
  components: {
    spaceLayout,
    userInfo,
    singleCard,
    albumCard,
    scrollXBox,
    userCard,
    loadCard
  },
  data () {
    return {
      single: {
        list: [],
        addresses: [],
        loading: true,
        size: 16
      },
      album: {
        list: [],
        addresses: [],
        loading: true,
        size: 10
      },
      sound: {
        list: [],
        addresses: [],
        loading: true,
        size: 16
      },
      podcast: {
        list: [],
        addresses: [],
        loading: true,
        size: 16
      },
      user: {
        nickname: '',
        avatar: 'undefined',
        introduction: '',
        location: '',
        website: '',
        neteaseId: '',
        soundcloudId: '',
        bandcampId: '',
        type: ''
      },
      loadingCard: {
        txid: '',
        title: 'Loading...',
        price: '0000',
        authorUsername: 'Artist loading...'
      }
    }
  },
  computed: {
    ...mapState(['wallet', 'isMe', 'username', 'userAvatar', 'userIntroduction', 'userType'])
  },
  watch: {
    username (val) {
      if (this.wallet === this.$route.params.id) {
        this.setIsMe(true)
        document.title = val + '\'s Profile - ArcLight'
      } else {
        document.title = 'Profile - ArcLight'
      }
    }
  },
  mounted () {
    if (this.wallet === this.$route.params.id) {
      this.setIsMe(true)
      document.title = this.username + '\'s Profile - ArcLight'
    } else {
      document.title = 'Profile - ArcLight'
    }
    this.getUserAudioList('single', this.single)
    this.getUserAudioList('album', this.album)
    this.getUserAudioList('soundEffect', this.sound)
    this.getUserAudioList('podcast', this.podcast)
  },
  methods: {
    ...mapActions(['setIsMe']),
    async getUserAudioList (type, aObject) {
      try {
        const res = await api.arweave.getUserAudioList(this.$route.params.id, type)
        aObject.addresses = res
        for (let i = 0; aObject.addresses.length !== 0 && i < aObject.size; i++) {
          this.getInfoByTxid(aObject, aObject.addresses.shift())
        }
      } catch (e) {
        console.error(`[Failed to get ${type} list]`, e)
        this.$message.error(`Failed to get ${type} list`)
      }
      aObject.loading = false
    },
    async getInfoByTxid (aObject, txid) {
      // 添加对应的卡片并进入加载状态
      aObject.list.push({...this.loadingCard, txid: txid})
      try {
        const transaction = await api.arweave.getTransactionDetail(txid)
        if (transaction) {
          const tags = api.arweave.getTagsByTransaction(transaction)
          const audioData = JSON.parse(decode.uint8ArrayToString(transaction.data))
          // 给 txid 相同的卡片赋予获取到的信息
          const cardIndex = aObject.list.findIndex(item => item.txid === txid)
          this.$set(aObject.list, cardIndex, {
            txid,
            authorAddress: tags['Author-Address'],
            authorUsername: tags['Author-Username'],
            type: tags.Type,
            unixTime: Number(tags['Unix-Time']),
            title: audioData.title,
            desp: audioData.desp,
            price: audioData.price,
            duration: audioData.duration,
            coverTxid: audioData.cover,
            musicTxid: audioData.music
          })
          // 成功的结束
          return
        }
      } catch (e) {
        console.error(txid, e)
      }
      // 失败处理：删掉这个卡片，并请求一个新的。
      aObject.list.splice(aObject.list.findIndex(item => item.txid === txid), 1)
      const addresse = aObject.addresses.shift()
      if (addresse) this.getInfoByTxid(aObject, addresse)
    }
  }
}
</script>

<style lang="less" scoped>
.works {
  .songs {
    width: 100%;
    margin-bottom: 48px;
    &-header {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #E56D9B;
        line-height: 22px;
      }
      a {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        &:hover {
          .header-icon {
            transform: translateX(5px);
          }
        }
        .header-icon {
          color: #FFFFFF;
          font-size: 18px;
        }
      }
    }

    .single-card {
      margin-right: 16px;
    }

    .album-card {
      margin-right: 42px;
    }

    .singers-card {
      margin-right: 24px;
    }
  }
}

@media screen and (max-width: 992px) {
  .works {
    .songs {
      .single-card {
        margin-right: 16px;
      }
      .album-card {
        margin-right: 30px;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .works {
    .songs {
      .single-card {
        margin-right: 12px;
      }
      .album-card {
        margin-right: 20px;
      }
    }
  }
}
@media screen and (max-width: 640px) {
}
@media screen and (max-width: 480px) {
  .works {
    .songs {
      .album-card {
        margin-right: 16px;
      }
    }
  }
}
</style>
