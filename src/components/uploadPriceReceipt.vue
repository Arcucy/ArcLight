<template>
  <v-dialog
    v-model="showDialog"
    width="360"
  >
    <v-card dark>
      <div class="receipt">
        <h3 class="receipt-title">
          {{ $t('feeToUpload') }}:
        </h3>
        <div class="receipt-content">
          <p class="receipt-content-price">
            <span class="receipt-content-price-label">
              {{ $t('audio') }}
            </span>
            <span>
              {{ audioPrice }} AR
            </span>
          </p>
          <p class="receipt-content-price">
            <span class="receipt-content-price-label">
              {{ $t('cover') }}
            </span>
            <span>
              {{ coverPrice }} AR
            </span>
          </p>
          <p class="receipt-content-price">
            <span class="receipt-content-price-label">
              {{ $t('txInfo') }}
            </span>
            <span>
              {{ infoPrice }} AR
            </span>
          </p>
          <v-divider dark />
          <p class="receipt-content-price">
            <span class="receipt-content-price-label">
              {{ $t('paymentTotal') }}
            </span>
            <span>
              {{ totalPrice }} AR
            </span>
          </p>
        </div>
        <v-btn class="receipt-button" depressed color="#E56D9B" block @click="confirmClick">
          {{ $t('confirm') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/api/api'

export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    bill: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showDialog: this.value
    }
  },
  computed: {
    audioPrice () {
      if (this.bill && this.bill.audioPrice) {
        return api.arweave.winstonToAr(this.bill.audioPrice)
      }
      return this.$t('loading')
    },
    coverPrice () {
      if (this.bill && this.bill.coverPrice) {
        return api.arweave.winstonToAr(this.bill.coverPrice)
      }
      return this.$t('loading')
    },
    infoPrice () {
      if (this.bill && this.bill.infoPrice) {
        return api.arweave.winstonToAr(this.bill.infoPrice)
      }
      return this.$t('loading')
    },
    totalPrice () {
      if (this.bill && this.bill.audioPrice && this.bill.coverPrice && this.bill.infoPrice) {
        const { audioPrice, coverPrice, infoPrice } = this.bill
        const total = audioPrice + coverPrice + infoPrice
        return api.arweave.winstonToAr(total)
      }
      return this.$t('loading')
    }
  },
  watch: {
    value (val) {
      this.showDialog = val
    },
    showDialog (val) {
      this.setShowStatus(val)
    }
  },
  methods: {
    confirmClick () {
      this.setShowStatus(false)
      this.$emit('confirm')
    },
    setShowStatus (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.receipt {
  padding: 24px;
  width: 100%;
  &-title {
    text-align: left;
    font-size: 20px;
    font-weight: 500;
    color: white;
    line-height: 28px;
    margin: 0 0 30px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  &-content {
    &-price {
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      color: white;
      line-height: 22px;
      margin: 15px 0;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &-label {
        margin-right: 10px;
      }
    }
    hr {
      border-top: 2px solid #B2B2B2;
    }
  }
  &-button {
    margin-top: 35px;
    &-icon {
      font-size: 16px;
    }
  }
}
</style>
