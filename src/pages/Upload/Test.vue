<template>
  <spaceLayout>
    <div class="container">
      <div class="music">
        <div class="music-download">
          <p>
            Sale for {{ price }} AR
          </p>
          <v-btn
            block
            large
            light
            outlined
            rounded
            color="#E56D9B"
            :height="44"
            @click.stop="buyClick"
          >
            BUY
          </v-btn>
        </div>
      </div>
      <v-dialog
        v-model="showWallet"
        width="360"
      >
        <v-card dark class="wallet">
          <h3 class="payment-title">
            Payment of 「Test Music」
          </h3>
          <div class="file-input-area" id="file-input-area">
            <v-icon v-if="!file" >mdi-plus</v-icon>
            <span v-else >{{ fileName }}</span>
            <input class="file-input" id="file-input" type="file">
          </div>
          <p class="payment-content">
            Please drag your wallet application into this box to complete the payment.
          </p>
          <v-btn class="wallet-upload-button" depressed color="#E56D9B" block @click="step2">
            Upload key
          </v-btn>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="showConfirm"
        persistent
        width="360"
      >
        <v-card dark class="confirm">

        </v-card>
      </v-dialog>
      <v-dialog
        v-model="showDialog"
        width="360"
      >
        <v-card dark>
          <div class="pay">
            <h3 class="pay-title">
              Payment of 「Test Music」
            </h3>
            <div class="pay-icon">
              <img src="@/assets/image/paymentCompleted.png" alt="Completed" />
            </div>
            <p class="pay-intro">
              Succeed to unlock the music！
            </p>

            <v-btn class="pay-button" depressed color="#E56D9B" block @click="showDialog = false">
              BACK TO MUSIC PLAYER
              <v-icon class="pay-button-icon">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </spaceLayout>
</template>

<script>

import spaceLayout from '@/components/Layout/Space.vue'
import genreSelect from '@/components/GenreSelect.vue'

export default {
  components: {
    spaceLayout,
    genreSelect
  },
  data () {
    return {
      price: 0.01,
      address: 'RBuiQvzC6dI-ZMaeha4Y387grwOz73yp73OmqWgqtEQ',
      showWallet: true,
      showConfirm: false,
      showDialog: false,
      owned: false,
      fileName: 'Wallet Name',
      file: ''
    }
  },
  methods: {
    buyClick () {
      // 这里并没有真的付款代码，而是直接将参数设定为付款成功的状态。
      this.showWallet = true
    },
    step2 () {
      this.showWallet = false
      this.showConfirm = true
    },
    addClass (elem, className) {
      elem.classList.add(className)
    },
    removeClass (elem, className) {
      elem.classList.remove(className)
    }
  },
  mounted () {
    let fileInput = document.getElementById('file-input')
    let droparea = document.getElementById('file-input-area')

    fileInput.addEventListener('dragenter', () => {
      this.addClass(droparea, 'is-active')
    })
    fileInput.addEventListener('click', () => {
      this.addClass(droparea, 'is-active')
    })
    fileInput.addEventListener('focus', () => {
      this.addClass(droparea, 'is-active')
    })

    fileInput.addEventListener('dragleave', () => {
      this.removeClass(droparea, 'is-active')
    })
    fileInput.addEventListener('blur', () => {
      this.removeClass(droparea, 'is-active')
    })
    fileInput.addEventListener('drop', () => {
      this.removeClass(droparea, 'is-active')
    })

    fileInput.addEventListener('change', () => {
      console.log(fileInput.files[0])
      this.file = fileInput.files[0]
      this.fileName = this.file.name
    })
  }
}
</script>

<style lang="less" scoped>
.container {
  margin: 48px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
}

.wallet {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .payment-content {
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: left;
  }
}

.payment-title {
  margin-bottom: 24px;
  text-align: left;
}

.file-input-area {
  padding: 76px 24px 76px 24px;
  margin: 0 auto;
  height: 156px;
  width: 312px;
  border-radius: 4px;
  border: 2px dashed #B2B2B2;
  display: flex;
  justify-content: center;
  align-items: center;
  &.is-active {
    background-color: rgba(255, 255, 255, 0.05);
  }
  .file-input {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
    opacity: 0;
    &:focus {
      outline: none;
    }
  }
}

.music {
  &-download {
    margin: 30px auto 0;
    max-width: 240px;
    p {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 20px;
      margin: 0 0 8px;
    }
    .free-text {
      color: #66BB6A;
    }
  }
}

.pay {
  padding: 24px;
  &-title {
    text-align: left;
    font-size: 20px;
    font-weight: 500;
    color: white;
    line-height: 28px;
    margin: 0 0 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }
  &-icon {
    text-align: center;
    margin-bottom: 16px;
    img {
      width: 128px;
      height: 128px;
      min-width: 128px;
      min-height: 128px;
    }
  }
  &-intro {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: white;
    line-height: 22px;
    margin: 0 0 54px;
  }
  &-button {
    &-icon {
      font-size: 16px;
    }
  }
}
</style>
