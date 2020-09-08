<template>
  <spaceLayout>
    <div class="songs-bg">
      <div class="songs">
        <div class="songs-header">
          <h4>
            Sounds Sellings
          </h4>
        </div>
        <div class="songs-list">
          <singleCard
            class="single-card"
            v-for="(item, index) in singles"
            :key="index"
            :card="item"
          />
        </div>
        <div class="songs-pagination">
          <v-pagination
            v-model="page"
            :length="20"
            :total-visible="10"
            color="#E56D9B"
            dark
          />
        </div>
      </div>
      <div class="come-down" />
      <categoryNav v-model="tab" />
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import categoryNav from '@/components/CategoryNav'

export default {
  components: {
    spaceLayout,
    singleCard,
    categoryNav
  },
  data () {
    return {
      tab: 'song',
      page: 1,
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
        },
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
        }
      ]
    }
  },
  mounted () {
    document.title = 'Browse All Selling Singles - ArcLight'
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
    h4 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 22px;
    }
  }
  &-list {
    margin: 0 20px 0;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    .single-card {
      margin: 16px 16px 32px 0;
    }
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
</style>
