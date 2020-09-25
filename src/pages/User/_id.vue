<template>
  <spaceLayout>
    <div class="user">
      <userInfo class="user-info" :user="user" />
      <!-- Singles Sellings -->
      <div v-if="single.loading || single.list.length > 0" class="songs">
        <div class="songs-header">
          <h4>
            New Singles Sellings
          </h4>
          <a>
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
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
          <a>
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
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
      <!-- Favourite Singers -->
      <!-- <div class="songs">
        <div class="songs-header">
          <h4>
            Favourite Singers
          </h4>
          <a>
            All Singers
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
        </div>
        <scrollXBox list-id="singers" card-id="singers-card">
          <userCard
            id="singers-card"
            class="album-card"
            v-for="(follower, index) in followers"
            :key="index"
            :user="follower"
          />
        </scrollXBox>
      </div> -->
    </div>
  </spaceLayout>
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
    ...mapState(['wallet', 'isMe', 'username', 'userAvatar', 'userIntroduction', 'userType', 'userPage'])
  },
  watch: {
    async $route (val) {
      window.location.reload()
      await this.setUserPage({ wallet: val.params.id })
      let introduction = ''
      if (this.userPage.introduction === '') {
        introduction = 'No Introduction Yet'
      } else {
        introduction = this.userPage.introduction
      }
      introduction = introduction.replace(/<br>/gm, '\\n')
      introduction = introduction.replace(/<[^>]*>/gmu, '')
      introduction = introduction.replace(/\\n/gmu, '<br>')
      this.user = { nickname: this.userPage.nickname, avatar: this.userPage.avatar, introduction: introduction, type: this.userPage.type }
    },
    username (val) {
      if (this.wallet === this.$route.params.id) {
        this.setIsMe(true)
        document.title = val + '\'s Profile - ArcLight'
      } else {
        document.title = this.userPage.nickname + '\'s Profile - ArcLight'
      }
    },
    userPage (val) {
      document.title = val.nickname + '\'s Profile - ArcLight'
      let introduction = ''
      if (this.userPage.introduction === false) {
        introduction = 'No Introduction Yet'
      } else {
        introduction = this.userPage.introduction
      }

      introduction = introduction.replace(/<br>/gm, '\\n')
      introduction = introduction.replace(/<[^>]*>/gmu, '')
      introduction = introduction.replace(/\\n/gmu, '<br>')

      this.user = {
        nickname: this.userPage.nickname,
        avatar: this.userPage.avatar,
        introduction: introduction,
        location: this.userPage.location,
        website: this.userPage.website,
        neteaseId: this.userPage.neteaseId,
        soundcloudId: this.userPage.soundcloudId,
        bandcampId: this.userPage.bandcampId,
        type: this.userPage.type
      }
    }
  },
  mounted () {
    if (this.wallet === this.$route.params.id) {
      this.setIsMe(true)
    }
    this.setUserPage({ wallet: this.$route.params.id })
    document.title = 'Profile - ArcLight'
    this.getAllAudioList('single', this.single)
    this.getAllAudioList('album', this.album)
  },
  methods: {
    ...mapActions(['setUserPage', 'setIsMe']),
    async getAllAudioList (type, aObject) {
      try {
        const res = await api.arweave.getAllAudioList(type)
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
.user {
  margin: 48px auto;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;
  &-info {
    margin-bottom: 48px;
  }
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
  .user {
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
  .user {
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
  .user {
    .songs {
      .album-card {
        margin-right: 16px;
      }
    }
  }
}
</style>
