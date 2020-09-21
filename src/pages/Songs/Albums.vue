<template>
  <spaceLayout>
    <div class="songs-bg">
      <div class="songs">
        <div class="songs-header">
          <router-link :to="{ name: 'Songs' }">
            <v-icon class="header-icon">mdi-chevron-left</v-icon>
            ALL Albums Sellings
          </router-link>
        </div>
        <div class="songs-list">
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
      <div class="come-down" />
    </div>
  </spaceLayout>
</template>

<script>
import api from '@/api/api'

import spaceLayout from '@/components/Layout/Space'
import albumCard from '@/components/Song/AlbumCard'
import getAudioInfo from '@/components/Song/GetAudioInfo'
import loadCard from '@/components/Song/loadCard'

export default {
  components: {
    spaceLayout,
    albumCard,
    getAudioInfo,
    loadCard
  },
  data () {
    return {
      loading: true,
      addressList: [],
      page: 1, // 页码
      pagesize: 10, // 每页数量
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
    document.title = 'Browse all selling albums - ArcLight'
    this.getAllAudioList('album')
  },
  methods: {
    async getAllAudioList (type) {
      try {
        let res = await api.arweave.getAllAudioList(type)
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
  margin: 48px auto;
  max-width: 1240px;
  width: 100%;
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
    grid-template-columns: repeat(auto-fill,minmax(188px,1fr));
    grid-gap: 48px 42px;
    justify-content: space-between;
    min-height: 510px;
  }
  &-pagination {
    margin: 16px 20px 0;
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
    grid-template-columns: repeat(auto-fill,minmax(146px,1fr));
    min-height: 454px;
    grid-gap: 20px 20px;
  }
}
</style>
