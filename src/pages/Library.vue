<template>
  <spaceLayout>
    <div class="library">
      <h4 class="library-title">
        My Library
      </h4>
      <div class="library-box">
        <div class="library-box-col">
          <h4>
            <span
              v-for="(item, index) in tabs"
              :class="(tab || defaultTab) === item.type && 'active'"
              :key="index"
              @click="tab = item.type"
            >
              {{ item.label }}
            </span>
          </h4>
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
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import api from '@/api/api'
import { mapState } from 'vuex'

import spaceLayout from '@/components/Layout/Space'
import mySingleCard from '@/components/Song/MySingleCard'

export default {
  inject: ['updateQuery'],
  components: {
    spaceLayout,
    mySingleCard
  },
  data () {
    return {
      // 参数
      loading: true,
      addressList: [],
      page: this.$route.query.page || 1, // 页码
      pagesize: 8, // 每页数量
      flash: false,
      tab: this.$route.query.tab || '',
      defaultTab: 'single',
      tabs: [
        {
          label: 'Single',
          type: 'single'
        },
        {
          label: 'Album',
          type: 'album'
        },
        {
          label: 'Sound',
          type: 'soundEffect'
        },
        {
          label: 'Podcast',
          type: 'podcast'
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
      if (val) this.getList(this.tab || this.defaultTab)
      else {
        this.addressList = []
        this.page = 1
      }
    },
    page (val) {
      this.flash = true
      setTimeout(() => { this.flash = false })
      this.updateQuery('page', val)
    },
    tab (val) {
      this.addressList = []
      this.page = 1
      this.updateQuery('tab', val)
      if (this.wallet) this.getList(val || this.defaultTab)
    }
  },
  mounted () {
    if (this.wallet) this.getList(this.tab || this.defaultTab)
    document.title = 'My Library - ArcLight'
  },
  methods: {
    async getList (type) {
      this.loading = true
      try {
        let res = await api.arweave.getPurchasedItems(this.wallet, type)
        this.addressList = res || []
      } catch (e) {
        console.error(`[Failed to get ${type} list] wallet:`, this.wallet, e)
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
    text-align: left;
    margin-bottom: 16px;
    span {
      cursor: pointer;
      color: #848484;
      margin-right: 20px;
      display: inline-block;
      &:hover {
        color: #B2B2B2;
      }
      &.active {
        color: white;
      }
    }
  }
}
</style>
