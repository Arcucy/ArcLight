<template>
  <spaceLayout>
    <div>
      <div class="single">
        <a class="back-link">
          <v-icon color="#E56D9B">mdi-chevron-left</v-icon>
          Back to Selection
        </a>
        <div class="notice-title">
          <v-icon light color="rgba(251, 140, 0, 1.000)" style="font-size: 40px; margin-right: 20px;">mdi-alert-circle-outline</v-icon>
          <div class="notice-content">
            Please carefully review your single release here,
            <br>
            if there is no problem, you can submit your wonderful work
          </div>
        </div>
        <div class="single-container">
          <img :src="singleCoverRaw" class="cover" />
          <div class="info-container">
            <div class="single-title-container">
              <div class="single-genre">
                {{ singleInfo.genre }}
              </div>
              <div class="single-title">
                {{ singleInfo.title }}
              </div>
            </div>
            <div class="single-artist">
              {{ username }}
            </div>
            <div class="single-desp">
              {{ singleInfo.desp }}
            </div>
          </div>
        </div>
        <div class="other-container">
          <div class="single-price">
              <div class="other-title">
                Price Cost
              </div>
              <v-text-field
                v-model="price"
                solo
                disabled
                class="single-price"
                :style="`width: ${priceWidth}px;`"
              ></v-text-field>
          </div>
          <div class="single-demo">
              <div class="other-title">
                Demo Duration
              </div>
              <v-text-field
                v-model="duration"
                solo
                disabled
                class="single-demo"
                :style="`width: 54px;`"
              ></v-text-field>
          </div>
        </div>
        <v-btn color="#E56D9B" depressed light class="submit-btn" large :loading="submitBtnLoading" @click="submit">Submit</v-btn>
      </div>
    </div>
  </spaceLayout>
</template>

<script>

import spaceLayout from '@/components/Layout/Space.vue'
import { mapState } from 'vuex'

export default {
  components: {
    spaceLayout
  },
  data () {
    return {
      price: '',
      duration: '',
      priceWidth: 0,
      submitBtnLoading: false
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'username', 'singleCoverFile', 'singleCoverRaw', 'singleCoverType', 'singleMusicRaw', 'singleMusicType', 'singleInfo'])
  },
  methods: {
    submit () {
      this.uploadSingle({
        img: { data: this.singleCoverRaw, type: this.singleCoverType },
        music: { data: this.singleMusicRaw, type: this.singleMusicType },
        key: this.keyFileContent,
        single: this.singleInfo
      })
    }
  },
  mounted () {
    this.price = this.singleInfo.price + ' AR'
    this.duration = this.singleInfo.duration

    const priceString = this.singleInfo.price + ''
    this.priceWidth = priceString.length * 8 + 52
  }
}
</script>

<style lang="less" scoped>
.single {
  margin: 40px auto;
  max-width: 1040px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.notice-title {
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.single-container {
  margin-top: 16px;
  display: flex;
}

.single-title-container {
  display: flex;
  align-items: center;
}

.single-genre {
  margin-right: 8px;
  padding: 8px 16px 8px;
  background-color: #FAE5ED;
  border-radius: 10px;
  font-weight: 700;
  color: #D85C8B;
}

.single-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.single-artist {
  margin-top: 10px;
  font-size: 24px;
  color: #E56D9B;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.single-desp {
  margin-top: 10px;
  color: white;
  font-size: 20px;
}

.cover {
  width: 250px;
  height: 250px;
  border-radius: 25px;
  margin-right: 20px;
}

.other-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.other-title {
  color: white;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
}

.single-price {
  margin-right: 20px;
}

.submit-btn {
  width: 100px;
  color: white;
}

/deep/ .v-input__slot {
  background-color: rgba(51, 51, 51, 0.8) !important;
  .v-text-field__slot > input {
    color: white;
  }
}

</style>
