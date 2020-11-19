<template>
  <div class="playlist" v-click-outside="() => $emit('close')">
    <div class="playlist-topbar">
      <h3>
        {{ $t('playlist') }}
        ({{ playList.length }})
      </h3>
      <div class="playlist-topbar-clear" @click="() => setPlayList([])">
        <v-icon>mdi-trash-can-outline</v-icon>
        {{ $t('clear') }}
      </div>
      <div class="playlist-topbar-divider" />
      <div @click="$emit('close')" class="playlist-topbar-close">
        <v-icon>mdi-close-thick</v-icon>
      </div>
    </div>
    <div class="playlist-list">
      <div
        v-for="(audio, index) in playList"
        :key="index"
        class="playlist-list-entry"
        :class="playIndex === index && 'active'"
        @click="setPlayIndex(index)"
      >
        <h4>
          {{ audio.title }}
        </h4>
        <div class="playlist-list-entry-artist" @click.stop>
          <router-link v-if="audio.artistId" :to="{ name: 'User', params: { id: audio.artistId } }">
            {{ audio.artist || '' }}
          </router-link>
        </div>
        <div @click.stop>
          <router-link class="playlist-list-entry-button" :to="getMusicUrl(audio)">
            <v-icon>mdi-link-variant</v-icon>
          </router-link>
        </div>
        <div class="playlist-list-entry-button" @click.stop="deletePlayList(index)">
          <v-icon>mdi-trash-can-outline</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['playList', 'playIndex'])
  },
  watch: {
  },
  async mounted () {
  },
  // 取消侦测器
  destroyed () {
  },
  methods: {
    ...mapMutations(['setPlayList', 'setPlayIndex', 'deletePlayList']),
    getMusicUrl (audio) {
      let query = {}
      if (!isNaN(audio.musicIndex)) {
        query = {
          album: audio.musicIndex + 1
        }
      }
      return { name: 'Music', params: { id: audio.infoId }, query }
    }
  }
}
</script>

<style lang="less" scoped>
.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.playlist {
  position: absolute;
  right: 0;
  bottom: 20px;
  border-radius: 5px;
  background: #adadad4d;
  overflow: hidden;
  backdrop-filter: blur(20px);
  text-align: left;
  color: white;
  max-width: 400px;
  width: calc(100% - 20px);
  margin: 10px;
  box-sizing: border-box;

  &-topbar {
    height: 33px;
    background: #e56d9b78;
    margin: 0;
    padding: 0 3px 0 10px;
    display: flex;
    align-items: center;

    h3 {
      font-size: 16px;
      line-height: 20px;
      flex: 1;
    }

    &-clear {
      color: #b2b2b2;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      height: 30px;
      display: flex;
      align-items: center;
      padding: 0 10px 0 10px;
      cursor: pointer;

      i {
        color: #b2b2b2;
        font-size: 18px;
        margin-right: 2px;
      }

      &:hover {
        background: #ffffff20;
        color: white;

        i {
          color: white;
        }
      }
    }

    &-close {
      color: #b2b2b2;
      border-radius: 5px;
      height: 30px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      i {
        color: #b2b2b2;
        font-size: 16px;
      }

      &:hover {
        background: #ffffff20;
        i {
          color: white;
        }
      }
    }

    &-divider {
      height: 70%;
      width: 1px;
      background: #b2b2b2;
      margin: 0 5px 0 5px;
    }
  }

  &-list {
    height: 350px;
    overflow-y: auto;

    &-entry {
      display: flex;
      align-items: center;
      border-radius: 5px;
      padding: 0 10px 0;
      margin-top: 3px;
      height: 30px;
      cursor: pointer;

      h4 {
        font-size: 14px;
        color: #cccccc;
        flex: 1;
        font-weight: 500;
        .word-limit();
      }

      &-artist {
        text-align: left;
        margin: 0 0 0 5px;
        width: 90px;

        a {
          color: #b2b2b2;
          margin: 0;
          font-size: 14px;
          text-decoration: none;
          line-height: 30px;
          .word-limit();

          &:hover {
            text-decoration: underline;
            color: white;
          }
        }
      }

      &-button {
        height: 30px;
        width: 30px;
        margin: 0 0 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        i {
          font-size: 18px;
          color: #b2b2b2;
        }

        &:hover {
          i {
            color: white;
          }
        }
      }

      &:hover {
        background: #ffffff20;

        h4 {
          color: white;
        }

        a {
          color: white;
        }
      }

      &.active {
        background: #ffffff20;

        h4 {
          color: #E56D9B;
        }

        a {
          color: white;
        }
      }
    }
  }
}
</style>
