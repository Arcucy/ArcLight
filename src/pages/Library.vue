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
              v-for="(txid, index) in paginatedAddressList"
              :key="index"
              :txid="txid"
            />
            <div v-if="loading || addressList.length === 0" class="list-loading">
              <v-progress-circular v-if="loading" indeterminate color="#E56D9B" />
              <p v-else>
                No data
              </p>
            </div>
          </div>
          <v-pagination
            v-if="maxPage > 1"
            v-model="page"
            :length="maxPage"
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
import api from '@/api/api'
import { mapState } from 'vuex'

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
      // 参数
      loading: true,
      addressList: [],
      page: 1, // 页码
      pagesize: 8, // 每页数量
      flash: false,
      // 旧的
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
  },
  computed: {
    ...mapState(['wallet']),
    paginatedAddressList () {
      if (this.flash) return []
      return this.addressList.slice((this.page - 1) * this.pagesize, this.page * this.pagesize)
    },
    maxPage () {
      return Math.ceil(this.addressList.length / this.pagesize)
    }
  },
  watch: {
    wallet (val) {
      if (val) this.getList('single')
    },
    page () {
      this.flash = true
      setTimeout(() => { this.flash = false })
    }
  },
  mounted () {
    if (this.wallet) this.getList('single')
  },
  methods: {
    async getList (type) {
      this.loading = true
      try {
        const res = await api.arweave.getPurchasedItems(this.wallet, type)
        // const res2 = []
        // for (let i = 0; i < 33; i++) {
        //   res2.push(...res)
        // }
        // this.addressList = res2 || []
        this.addressList = res || []
      } catch (e) {
        console.log(`[Failed to get ${type} list] wallet:`, this.wallet, e)
        this.$message.error(`Failed to get ${type} list`)
      }
      this.loading = false
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
    min-height: 632px;
    .list-loading {
      min-height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius:5px;
      background: #ffffff0d;
      p {
          margin: 0 0 0 10px;
        padding: 0;
        font-size: 16px;
        font-weight: 500;
        color: white;
        line-height: 22px;
      }
    }
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
