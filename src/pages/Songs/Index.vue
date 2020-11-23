<template>
  <spaceLayout>
    <div class="songs-bg">
      <!-- Singles Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            {{ $t('newSingleSelling') }}
          </h4>
          <router-link :to="{ name: 'SongsSingles' }">
            {{ $t('allSelling') }}
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox class="songs-list" list-id="single" card-id="single-card" :list-update="single.list">
          <singleCard
            id="single-card"
            class="single-card"
            v-for="(item, index) in single.list"
            :key="index"
            :card="item"
          />
          <loadCard
            v-if="single.loading || single.list.length === 0"
            :message="!single.loading && single.list.length === 0 ? this.$t('noData') : ''"
          />
        </scrollXBox>
      </div>
      <!-- Albums Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            {{ $t('newAlbumSelling') }}
          </h4>
          <router-link :to="{ name: 'SongsAlbums' }">
            {{ $t('allSelling') }}
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox class="songs-list" list-id="albums" card-id="albums-card" :list-update="album.list">
          <albumCard
            id="albums-card"
            class="album-card"
            v-for="(item, index) in album.list"
            :key="index"
            :card="item"
          />
          <loadCard
            v-if="album.loading || album.list.length === 0"
            :message="!album.loading && album.list.length === 0 ? this.$t('noData') : ''"
            width="188px"
          />
        </scrollXBox>
      </div>
      <div class="come-down" />
      <categoryNav />
    </div>
  </spaceLayout>
</template>

<script>
import api from '@/api/api'
import decode from '@/util/decode'

import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'
import categoryNav from '@/components/CategoryNav'
import scrollXBox from '@/components/ScrollXBox'
import loadCard from '@/components/Song/LoadCard'

export default {
  components: {
    spaceLayout,
    singleCard,
    albumCard,
    categoryNav,
    scrollXBox,
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
      loadingCard: {
        txid: '',
        title: 'Loading...',
        price: '0000',
        authorUsername: 'Artist loading...'
      }
    }
  },
  created () {
  },
  mounted () {
    document.title = this.$t('browseAllMusic') + ' - ArcLight'
    this.getAllAudioList('single', this.single)
    this.getAllAudioList('album', this.album)
    this.$nextTick(() => {
      this.loadingCard.title = this.$t('loading')
      this.loadingCard.authorUsername = this.$t('artistLoading')
    })
  },
  methods: {
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
      aObject.list.push({ ...this.loadingCard, txid: txid })
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
.songs {
  margin: 48px auto;
  max-width: 1240px;
  width: 100%;
  &-header {
    margin: 0 20px 16px;
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
  &-list {
    margin: 0 20px 0;
    .single-card {
      margin-right: 16px;
    }
    .album-card {
      margin-right: 42px;
    }
  }
}
.songs-bg {
  display: flex;
  flex-direction: column;
  height: 100%;
  .come-down {
    flex: 1;
  }
}

@media screen and (max-width: 992px) {
  .songs-list {
    .single-card {
      margin-right: 16px;
    }
    .album-card {
      margin-right: 30px;
    }
  }
}
@media screen and (max-width: 768px) {
  .songs-list {
    .single-card {
      margin-right: 12px;
    }
    .album-card {
      margin-right: 20px;
    }
  }
}
@media screen and (max-width: 640px) {
}
@media screen and (max-width: 480px) {
  .songs-list {
    .album-card {
      margin-right: 16px;
    }
  }
}
</style>
