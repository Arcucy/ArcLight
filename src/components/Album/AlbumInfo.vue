<template>
  <div class="albuminfo">
    <!-- Cover -->
    <div class="albuminfo-cover">
      <v-img
        class="albuminfo-cover-img"
        :src="album.cover"
        alt="cover"
        aspect-ratio="1"
      >
        <template v-slot:placeholder>
          <div class="albuminfo-cover-img-loading">
            <v-progress-circular indeterminate color="#E56D9B" />
          </div>
        </template>
      </v-img>
      <div class="albuminfo-cover-record">
        <img src="@/assets/image/record.png" alt="record">
      </div>
    </div>
    <!-- Info -->
    <div class="albuminfo-right">
      <h3 class="albuminfo-right-title">
        <span class="albuminfo-right-genre">
          {{ album.genre }}
        </span>
        {{ album.name || 'Loading...' }}
      </h3>
      <router-link class="albuminfo-right-artist" :to="{ name: 'User', params: { id: album.authorAddress } }">
        by {{ album.artist }}
      </router-link>
      <p class="albuminfo-right-time">
        Time: {{ time }}
      </p>
      <p class="albuminfo-right-desp" v-html="album.desp" />
    </div>
  </div>
</template>

<script>
import avatar from '@/components/User/Avatar'

export default {
  components: {
    avatar
  },
  props: {
    album: {
      type: Object,
      required: true
    }
  },

  computed: {
    time () {
      return this.album.unixTime ? this.$moment(this.album.unixTime).format('MMMDo HH:mm:ss') : '--:--:--'
    }
  }
}
</script>

<style lang="less" scoped>
.albuminfo {
  display: flex;
  margin-top: 20px;
  &-cover {
    display: flex;
    width: 280px;
    min-width: 280px;
    margin-right: 20px;
    &-img {
      border-radius:5px;
      width: 190px;
      height: 190px;
      background: #252525;
      &-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    }
    &-record {
      width: 180px;
      height: 180px;
      min-height: 180px;
      min-height: 180px;
      margin-left: -90px;
      margin-top: 5px;

      img {
        width: 100%;
        height: 100%;
        min-height: 100%;
        min-height: 100%;
      }
    }
  }
  &-right {
    text-align: left;
    .content {
      margin: 10px 0 0;
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

    &-title {
      margin: 0 0 20px;
      font-size: 24px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 25px;
      text-align: left;
      display: flex;
      align-items: center;
    }
    &-genre {
      .content();
      .word-limit();
      height: 30px;
      background: #F9C1D7;
      border-radius: 2px;
      display: inline-block;
      color: #E56D9B;
      padding: 5px 10px;
      margin: 0 10px 0 0;
    }
    &-artist {
      .content();
      .word-limit();
      text-decoration: none;
      &:hover {
        color: #E56D9B;
      }
    }
    &-time {
      .content();
      .word-limit();
    }
    &-desp {
      .content();
      margin-top: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  .albuminfo {
    flex-direction: column;
    &-right {
      margin-top: 20px;
    }
  }
}
</style>
