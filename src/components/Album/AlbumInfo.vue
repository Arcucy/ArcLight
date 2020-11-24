<template>
  <div class="albuminfo">
    <!-- Cover -->
    <div class="albuminfo-cover">
      <v-img
        v-if="imgShouldLoad"
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
        <v-tooltip top :disabled="!toGenre.name">
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
              <router-link
                class="albuminfo-right-genre"
                :class="!toGenre.name && 'no-click'"
                :to="toGenre"
              >
                {{ album.genre }}
              </router-link>
            </span>
          </template>
          <span>{{ $t('viewSimilarArtwork') }}</span>
        </v-tooltip>
        {{ album.name || $t('loading') }}
      </h3>
      <div class="mobile mobile-albuminfo-right">
        <span class="genre">{{ album.genre }}</span>
        <span class="title">{{ album.name  }}</span>
      </div>
      <router-link class="albuminfo-right-artist" :to="{ name: 'User', params: { id: album.authorAddress } }">
        by {{ album.artist }}
      </router-link>
      <p class="albuminfo-right-time">
        {{ $t('time') }}: {{ time }}
      </p>
      <!-- 播放 -->
      <div v-if="unlock || album.duration !== 0" class="albuminfo-right-control">
        <v-btn
          class="albuminfo-right-control-play"
          color="#e56d9b"
          @click="$emit('play-album')"
        >
          <v-icon color="white" size="20px">mdi-play</v-icon>
          {{ unlock || album.duration === -1 ? $t('play') : $t('playDemo') }}
        </v-btn>
        <v-btn
          class="albuminfo-right-control-plus"
          color="#e56d9b"
          @click="$emit('add-album')"
        >
          <v-icon color="white" size="20px">mdi-plus</v-icon>
        </v-btn>
      </div>
      <p class="albuminfo-right-desp" v-html="album.desp" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    album: {
      type: Object,
      required: true
    },
    unlock: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      imgShouldLoad: true
    }
  },
  computed: {
    ...mapState(['appLang']),
    time () {
      return this.album.unixTime ? this.$moment(this.album.unixTime).locale(this.appLang).format('MMMDo HH:mm:ss') : '--:--:--'
    },
    toGenre () {
      if (!this.album || !this.album.genre || this.album.genre === this.$t('awaitData')) return {}
      return { name: 'SongsAlbums', query: { genre: this.album.genre } }
    },
    loaded () {
      return this.album && this.album.name && this.album.artist !== this.$t('artistLoading') && this.album.cover !== this.$t('loading')
    }
  },
  watch: {
    album () {
      this.imgShouldLoad = false
      setTimeout(() => {
        this.imgShouldLoad = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mobile {
  display: none;
}

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
      .word-limit();
      margin: 0 0 20px;
      font-size: 24px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 25px;
      text-align: left;
      display: flex;
      align-items: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
    }
    &-genre {
      text-decoration: none;
      height: 30px;
      margin-right: 8px;
      padding: 8px 16px 8px;
      background-color: #FAE5ED;
      border-radius: 10px;
      font-weight: 700;
      font-size: 16px;
      display: inline-table;
      color: #D85C8B;
      white-space: nowrap;
      &.no-click {
        cursor: default;
      }
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

    &-control {
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
      display: inline-block;
      border-radius: 4px;
      margin: 10px 0 0;

      &-play {
        color: white !important;
        padding: 0 16px 0 13px !important;
        border-radius: 4px 0 0 4px !important;
        margin-right: 0 !important;
        box-shadow: none !important;
        border-right: 1px solid #c75e86 !important;
      }

      &-plus {
        color: white !important;
        border-radius: 0 4px 4px 0 !important;
        box-shadow: none !important;
        padding: 0 0px !important;
        min-width: 40px !important;
        width: 40px !important;
      }
    }

    &-desp {
      .content();
      margin-top: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  .albuminfo-right-title {
    display: none;
  }
  .mobile-albuminfo-right {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .genre {
      margin-right: 8px;
      padding: 5px 10px 5px;
      background-color: #FAE5ED;
      border-radius: 5px;
      font-weight: 700;
      color: #D85C8B;
      font-size: 14px;
      white-space: nowrap;
    }
    .title {
      color: white;
      font-size: 18px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-break: break-all;
    }
  }

  .albuminfo {
    flex-direction: column;
    &-right {
      margin-top: 20px;
    }
  }
}
</style>
