<template>
  <router-link class="card-link" :to="{ name: 'Music', params: { id: card.txid } }">
    <div class="card" v-ripple>
      <v-img
        v-if="!blink"
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
      <div v-else class="card-img-blink" />
      <p class="card-title">
        {{ card.title }}
      </p>
      <router-link v-if="card.authorAddress" class="card-artist" :to="{ name: 'User', params: { id: card.authorAddress } }">
        by {{ card.authorUsername }}
      </router-link>
      <a v-else class="card-artist">
        {{ card.authorUsername }}
      </a>
      <p v-if="card.price != 0" class="card-price">
        {{ $t('pay') }} {{ card.price }} AR
      </p>
      <p v-else class="card-price free-song">
        {{ $t('free') }}
      </p>
      <p class="card-time">
        {{ time }}
      </p>
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
      cover: 'Loading',
      blink: false
    }
  },
  computed: {
    time () {
      if (!this.card) return '--:--:--'
      const time = this.$moment(this.card.unixTime)
      return isNDaysAgo(3, this.card.unixTime) ? time.format('MMMDo HH:mm') : time.fromNow()
    }
  },
  watch: {
    card (val) {
      if (val) this.getCover()
      else this.cover = ''
    }
  },
  mounted () {
    this.getCover()
  },
  methods: {
    async getCover () {
      if (this.card && this.card.coverTxid) {
        this.cover = 'Loading'
        this.newBlink()
        const txid = this.card.coverTxid
        try {
          const img = await api.arweave.getCover(txid)
          if (txid !== this.card.coverTxid) return
          this.cover = img
        } catch (e) {
          this.cover = ''
        }
      } else this.cover = ''
    },
    newBlink () {
      this.blink = true
      setTimeout(() => { this.blink = false })
    }
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
.card-link {
  display: flex;
  justify-content: center;
  align-items: center;
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

  &-img-blink {
    border-radius:5px;
    width: 128px;
    height: 128px;
    background: #252525;
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
@media screen and (max-width: 992px) {
  .card {
    width: 100px;
    .card-img {
      height: 100px;
      width: 100px;
    }
  }
}
@media screen and (max-width: 768px) {
}
@media screen and (max-width: 640px) {
}
@media screen and (max-width: 480px) {
}
</style>
