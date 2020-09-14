<template>
  <router-link :to="{ name: 'Album', params: { id: card.txid } }" v-ripple>
    <div class="card-bg">
      <div class="card">
        <v-img
          class="card-img"
          :src="cover"
          alt="cover"
          aspect-ratio="1"
        >
          <template v-slot:placeholder>
            <div class="card-img-loading">
              <v-progress-circular indeterminate color="#E56D9B" />
            </div>
          </template>
        </v-img>
        <p class="card-title">
          {{ card.title }}
        </p>
        <router-link class="card-artist" :to="{ name: 'User', params: { id: card.authorAddress } }">
          by {{ card.authorUsername }}
        </router-link>
        <p v-if="card.price != 0" class="card-price">
          pay {{ card.price }} AR
        </p>
        <p v-else class="card-price free-song">
          Free
        </p>
        <p class="card-time">
          {{ time }}
        </p>
      </div>
      <div class="record">
        <img src="@/assets/image/record.png" alt="record">
      </div>
    </div>
  </router-link>
</template>

<script>
import api from '@/api/api'
import { isNDaysAgo } from '@/util/momentFun'

export default {
  components: {
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cover: 'Loading'
    }
  },
  computed: {
    time () {
      const time = this.$moment(this.card.unixTime)
      return isNDaysAgo(3, this.card.unixTime) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  },
  async mounted () {
    if (this.card && this.card.coverTxid) {
      if (this.cover === 'Loading') this.cover = await api.arweave.getCover(this.card.coverTxid)
    } else this.cover = ''
  }
}
</script>

<style lang="less" scoped>
p {
  text-align: left;
}
a {
  text-decoration: none;
  color: white;
}
.card-bg {
  display: flex;
  width: 188px;
  .record {
    width: 1200px;
    min-width: 120px;
    height: 120px;
    min-height: 120px;
    margin-left: -60px;
    margin-top: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .card {
    width: 128px;
    .content {
      margin: 4px 0 0;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 20px;
      text-align: left;
    }

    .word-limit {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    &-img {
      border-radius:5px;
      width: 128px;
      height: 128px;
      background: #252525;
      &-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    }

    &-title {
      margin: 10px 0 0;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 20px;
      .word-limit();
    }

    &-artist {
      .content();
      .word-limit();
      &:hover {
        color: #E56D9B;
      }
    }

    &-price {
      .content();
      .word-limit();
      &.free-song {
        color: #66BB6A;
      }
    }

    &-time {
      margin: 8px 0 0;
      font-size: 12px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 17px;
      .word-limit();
    }
  }
}
</style>
