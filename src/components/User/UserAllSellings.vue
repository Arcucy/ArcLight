<template>
  <div class="songs">
    <div class="songs-header">
      <router-link :to="{ name: 'User', params: { id: $route.params.id } }">
        <v-icon class="header-icon">mdi-chevron-left</v-icon>
        ALL {{ label }} Sellings
      </router-link>
    </div>
    <!-- Default list -->
    <div v-if="type !== 'album'" class="songs-list">
      <getAudioInfo
        v-for="(item, index) in paginatedAddressList"
        :key="index"
        :txid="item"
      >
        <template v-slot="{ card }">
          <singleCard v-if="!flash" :card="card" />
        </template>
      </getAudioInfo>
      <loadCard
        v-if="loading || addressList.length === 0"
        :message="!loading && addressList.length === 0 ? 'No data' : ''"
      />
    </div>
    <!-- Album list -->
    <div v-else class="songs-list album-mode">
      <getAudioInfo
        v-for="(item, index) in paginatedAddressList"
        :key="index"
        :txid="item"
      >
        <template v-slot="{ card }">
          <albumCard v-if="!flash" :card="card" />
        </template>
      </getAudioInfo>
      <loadCard
        v-if="loading || addressList.length === 0"
        :message="!loading && addressList.length === 0 ? 'No data' : ''"
        width="188px"
      />
    </div>
    <div v-if="maxPage > 1" class="songs-pagination">
      <v-pagination
        v-model="page"
        :length="maxPage"
        :total-visible="10"
        color="#E56D9B"
        dark
      />
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'
import getAudioInfo from '@/components/Song/GetAudioInfo'
import loadCard from '@/components/Song/LoadCard'

export default {
  components: {
    spaceLayout,
    singleCard,
    albumCard,
    getAudioInfo,
    loadCard
  },
  props: {
    type: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    /** 每页数量 */
    pagesize: {
      type: Number,
      default: 16
    }
  },
  data () {
    return {
      loading: true,
      addressList: [],
      page: 1, // 页码
      flash: false
    }
  },
  computed: {
    paginatedAddressList () {
      return this.addressList.slice((this.page - 1) * this.pagesize, this.page * this.pagesize)
    },
    maxPage () {
      return Math.ceil(this.addressList.length / this.pagesize)
    }
  },
  watch: {
    page () {
      this.flash = true
      setTimeout(() => { this.flash = false })
    }
  },
  mounted () {
    document.title = `Browse All ${this.label} Singles - ArcLight`
    this.getUserAudioList(this.type)
  },
  methods: {
    async getUserAudioList (type) {
      try {
        let res = await api.arweave.getUserAudioList(this.$route.params.id, type)
        // 循环一些数据方便测试
        // let res2 = []
        // for (let i = 0; i < 20; i++) {
        //   res2.push(...res)
        // }
        // console.log(res2.length)
        this.addressList = res || []
      } catch (e) {
        console.error(`[Failed to get ${type} list]`, e)
        this.$message.error(`Failed to get ${type} list`)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.songs {
  &-header {
    margin: 0 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 22px;
      text-decoration: none;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      &:hover {
        .header-icon {
          transform: translateX(-5px);
        }
      }
      .header-icon {
        color: #E56D9B;
        font-size: 22px;
      }
    }
  }
  &-list {
    margin: 16px 20px 32px;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(128px,1fr));
    grid-gap: 48px 16px;
    justify-content: space-between;
    min-height: 510px;
    &.album-mode {
      grid-template-columns: repeat(auto-fill,minmax(188px,1fr));
      grid-gap: 48px 42px;
    }
  }
  &-pagination {
    margin: 16px 20px 0;
  }
}
@media screen and (max-width: 992px) {
  .songs-list {
    grid-template-columns: repeat(auto-fill,minmax(100px,1fr));
    min-height: 454px;
    grid-gap: 20px 16px;
    &.album-mode {
      grid-template-columns: repeat(auto-fill,minmax(146px,1fr));
      min-height: 454px;
      grid-gap: 20px 20px;
    }
  }
}
</style>
