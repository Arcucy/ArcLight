<template>
  <spaceLayout>
    <div class="songs-bg">
      <!-- Singles Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            Singles Sellings
            {{ single.addresses.length ? `(${single.list.length}/${single.addresses.length})` : '' }}
          </h4>
          <router-link :to="{ name: 'SongsSingles' }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox class="songs-list" list-id="single" card-id="single-card">
          <singleCard
            id="single-card"
            class="single-card"
            v-for="(item, index) in single.list"
            :key="index"
            :card="item"
          />
          <loadCard
            v-if="single.loading || single.addresses.length === 0"
            :message="!single.loading && single.addresses.length === 0 ? 'No data' : ''"
          />
        </scrollXBox>
      </div>
      <!-- Albums Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            Albums Sellings
            {{ album.addresses.length ? `(${album.list.length}/${album.addresses.length})` : '' }}
          </h4>
          <router-link :to="{ name: 'SongsAlbums' }">
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </router-link>
        </div>
        <scrollXBox class="songs-list" list-id="albums" card-id="albums-card">
          <albumCard
            id="albums-card"
            class="album-card"
            v-for="(item, index) in album.list"
            :key="index"
            :card="item"
          />
          <loadCard
            v-if="album.loading || album.addresses.length === 0"
            :message="!album.loading && album.addresses.length === 0 ? 'No data' : ''"
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

import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'
import categoryNav from '@/components/CategoryNav'
import scrollXBox from '@/components/ScrollXBox'
import loadCard from '@/components/Song/loadCard'

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
      singleAddresses: [],
      single: {
        list: [],
        addresses: [],
        loading: true
      },
      album: {
        list: [],
        addresses: [],
        loading: true
      }
    }
  },
  created () {
  },
  mounted () {
    document.title = 'Browse All Seling Music - ArcLight'
    this.getAllAudioList('single', this.single)
    this.getAllAudioList('album', this.album)
  },
  methods: {
    async getAllAudioList (type, aObject) {
      try {
        const res = await api.arweave.getAllAudioList(type)
        aObject.addresses = res
        await api.arweave.getAudioInfoByTxids(res, (item, index) => {
          console.log('单曲：', index, item)
          aObject.list.push(item)
        })
      } catch (e) {
        console.error(`[Failed to get ${type} list]`, e)
        this.$message.error(`Failed to get ${type} list`)
      }
      aObject.loading = false
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
</style>
