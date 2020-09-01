<template>
  <spaceLayout>
    <div class="songs">
      <div class="songs-header">
        <h4>
          Singles Sellings
        </h4>
        <router-link :to="{ name: 'SongsSingles' }">
          All Sellings
          <v-icon class="header-icon">keyboard_arrow_right</v-icon>
        </router-link>
      </div>
      <div class="songs-list">
        <singleCard
          class="single-card"
          v-for="(item, index) in singles"
          :key="index"
          :card="item"
        />
      </div>
    </div>
    <div class="songs">
      <div class="songs-header">
        <h4>
          Albums Sellings
        </h4>
        <router-link :to="{ name: 'SongsAlbums' }">
          All Sellings
          <v-icon class="header-icon">keyboard_arrow_right</v-icon>
        </router-link>
      </div>
      <div class="songs-list">
        <albumCard
          class="album-card"
          v-for="(item, index) in singles"
          :key="index"
          :card="item"
        />
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'

export default {
  components: {
    spaceLayout,
    singleCard,
    albumCard
  },
  data () {
    return {
      singles: [
        {
          title: 'RED',
          artist: 'Taylor Swift',
          price: 4.3,
          time: '2020-09-01 10:22'
        },
        {
          title: 'ALL OFF',
          artist: 'ONE',
          price: 5.2,
          time: '2020-08-31 12:32'
        },
        {
          title: 'HEART BEAT',
          artist: 'GEM',
          price: 10.1,
          time: '2020-08-31 10:22'
        },
        {
          title: 'RELOADED',
          artist: '鹿晗',
          price: 10.1,
          time: '2020-08-30 10:22'
        },
        {
          title: 'B v S soundtrack',
          artist: 'Warner Brosaaaaa',
          price: 4.3,
          time: '2020-08-23 10:22'
        },
        {
          title: '东风破',
          artist: '周杰伦',
          price: 14.6,
          time: '2020-08-01 10:22'
        },
        {
          title: 'YOUTH BLOOD',
          artist: 'JINDER',
          price: 10.1,
          time: '2020-07-01 10:22'
        },
        {
          title: 'THE SEVENTH SEVENTH',
          artist: '张靓颖',
          price: 10.1,
          time: '2019-06-01 10:22'
        },
        {
          title: 'RED',
          artist: 'Tayl',
          price: 8888,
          time: '2020-05-01 10:22'
        },
        {
          title: 'HEART BEAT',
          artist: 'GEM',
          price: 10.1,
          time: '2000-08-31 10:22'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.songs {
  margin: 20px auto;
  max-width: 1240px;
  width: 100%;
  &-header {
    margin: 0 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 22px;
    }
    a {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 20px;
      .header-icon {
        color: #FFFFFF;
        font-size: 18px;
      }
    }
  }
  &-list {
    margin: 0 20px 0;
    display: flex;
    overflow: hidden;
    .single-card {
      margin-right: 16px;
    }
    .album-card {
      margin-right: 42px;
    }
  }

}
</style>
