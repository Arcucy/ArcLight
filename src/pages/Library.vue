<template>
  <spaceLayout>
    <div class="library">
      <h4 class="library-title">
        My Library
      </h4>
      <div class="library-box">
        <div class="library-box-col">
          <h4>Singles</h4>
          <div class="single-list">
            <mySingleCard
              v-for="(item, index) in singles"
              :key="index"
              :card="item"
            />
          </div>
          <v-pagination
            v-model="singlePage"
            :length="20"
            :total-visible="10"
            color="#E56D9B"
            dark
          />
        </div>
        <div class="library-box-col">
          <h4>Album</h4>
          <div class="single-list">
            <myAlbumCard
              v-for="(item, index) in singles"
              :key="index"
              :card="item"
            />
          </div>
          <v-pagination
            v-model="albumPage"
            :length="20"
            :total-visible="10"
            color="#E56D9B"
            dark
          />
        </div>
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import mySingleCard from '@/components/Song/MySingleCard'
import myAlbumCard from '@/components/Song/MyAlbumCard'

export default {
  components: {
    spaceLayout,
    mySingleCard,
    myAlbumCard
  },
  data () {
    return {
      singlePage: 1,
      albumPage: 1,
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
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.library {
  margin: 48px auto;
  max-width: 1240px;
  padding: 0 20px;

  &-title {
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 500;
    color: #E56D9B;
    line-height: 22px;
    text-align: left;
  }

  &-box {
    width: 100%;
    display: flex;

    &-col {
      flex: 1;

      &:first-child {
        margin-right: 48px;
      }
    }
  }

  .single-list {
    margin-bottom: 40px;
  }
}

.library-box-col {
  h4 {
    font-size: 16px;
    color: white;
    text-align: left;
    margin-bottom: 16px;
  }
}
</style>
