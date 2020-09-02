<template>
  <spaceLayout>
    <!-- Singles Sellings -->
    <div class="songs">
      <div class="songs-header">
        <h4>
          Singles Sellings
        </h4>
        <router-link :to="{ name: 'SongsSingles' }">
          All Sellings
          <v-icon class="header-icon">keyboard_arrow_right</v-icon>
        </router-link>
      </div>
      <div class="songs-scroll-box">
        <!-- Scroll Left -->
        <div
          v-if="singlePara.scrollLeft"
          class="songs-scroll scroll-left"
          @click="singleScrollLeft('singles', 'single-card')"
        >
          <v-icon>keyboard_arrow_left</v-icon>
        </div>
        <!-- List -->
        <div id="singles" class="songs-list">
          <singleCard
            id="single-card"
            class="single-card"
            v-for="(item, index) in singles"
            :key="index"
            :card="item"
          />
        </div>
        <!-- Scroll Right -->
        <div
          v-if="singlePara.scrollRight"
          class="songs-scroll scroll-right"
          @click="singleScrollRight('singles', 'single-card')"
        >
          <v-icon>keyboard_arrow_right</v-icon>
        </div>
      </div>
    </div>
    <!-- Albums Sellings -->
    <div class="songs">
      <div class="songs-header">
        <h4>
          Albums Sellings
        </h4>
        <router-link :to="{ name: 'SongsAlbums' }">
          All Sellings
          <v-icon class="header-icon">keyboard_arrow_right</v-icon>
        </router-link>
      </div>
      <div class="songs-scroll-box">
        <!-- Scroll Left -->
        <div
          v-if="albumsPara.scrollLeft"
          class="songs-scroll scroll-left"
          @click="singleScrollLeft('albums', 'albums-card')"
        >
          <v-icon>keyboard_arrow_left</v-icon>
        </div>
        <!-- List -->
        <div id="albums" class="songs-list">
          <albumCard
            id="albums-card"
            class="album-card"
            v-for="(item, index) in singles"
            :key="index"
            :card="item"
          />
        </div>
        <!-- Scroll Right -->
        <div
          v-if="albumsPara.scrollRight"
          class="songs-scroll scroll-right"
          @click="singleScrollRight('albums', 'albums-card')"
        >
          <v-icon>keyboard_arrow_right</v-icon>
        </div>
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'

export default {
  components: {
    spaceLayout,
    singleCard,
    albumCard
  },
  data () {
    return {
      singlePara: {
        scrollRight: false,
        scrollLeft: false
      },
      albumsPara: {
        scrollRight: false,
        scrollLeft: false
      },
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
          price: 0,
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
        },
        {
          title: 'RED',
          artist: 'Tayl',
          price: 8888,
          time: '2020-05-01 10:22'
        },
        {
          title: 'HEART BEAT',
          artist: 'GEM',
          price: 10.1,
          time: '2000-08-31 10:22'
        }
      ]
    }
  },
  created () {
    // 侦测页面变化，变化后更新翻页按钮状态。
    this.$nextTick(() => {
      // singles
      this.singleButtonUpdate()
      const singles = document.getElementById('singles')
      window.addEventListener('resize', this.singleButtonUpdate)
      singles.addEventListener('scroll', this.singleButtonUpdate)

      // albums
      this.scrollButtonUpdate('albums', this.albumsPara)
      const albums = document.getElementById('albums')
      window.addEventListener('resize', this.albumsButtonUpdate)
      albums.addEventListener('scroll', this.albumsButtonUpdate)
    })
  },
  mounted () {
    // 假数据
    const singles = []
    for (let i = 0; i < 3; i++) {
      singles.push(...this.singles)
    }
    this.singles = singles
  },
  // 取消侦测器
  destroyed () {
    // singles
    const singles = document.getElementById('singles')
    if (singles) singles.removeEventListener('scroll', this.singleButtonUpdate)
    window.removeEventListener('resize', this.singleButtonUpdate)
    // albums
    const albums = document.getElementById('albums')
    if (albums) albums.removeEventListener('scroll', this.albumsButtonUpdate)
    window.removeEventListener('resize', this.albumsButtonUpdate)
  },
  methods: {
    /** 更新 单曲列表的翻页按钮状态 */
    singleButtonUpdate () {
      this.scrollButtonUpdate('singles', this.singlePara)
    },
    /** 更新 专辑列表的翻页按钮状态 */
    albumsButtonUpdate () {
      this.scrollButtonUpdate('albums', this.albumsPara)
    },
    /** 更新 翻页按钮状态 */
    scrollButtonUpdate (id, button) {
      const list = document.getElementById(id)
      if (list.scrollWidth - list.clientWidth <= 0) {
        button.scrollRight = false
        button.scrollLeft = false
      } else if (list.scrollLeft >= list.scrollWidth - list.clientWidth) {
        button.scrollRight = false
        button.scrollLeft = true
      } else if (list.scrollLeft <= 0) {
        button.scrollRight = true
        button.scrollLeft = false
      } else {
        button.scrollRight = true
        button.scrollLeft = true
      }
    },
    /** 向左滚动 */
    singleScrollLeft (id, cardId) {
      this.singleScroll(id, cardId, false)
    },
    /** 向右滚动 */
    singleScrollRight (id, cardId) {
      this.singleScroll(id, cardId, true)
    },
    /** 滚动 */
    singleScroll (id, cardId, direction) {
      // 获取 element
      const list = document.getElementById(id)
      const card = document.getElementById(cardId)
      // 获取宽度
      const marginRight = Number(window.getComputedStyle(card).marginRight.replace('px', '')) || 0
      const marginLeft = Number(window.getComputedStyle(card).marginLeft.replace('px', '')) || 0
      const width = list.clientWidth
      const cardWidth = card.clientWidth + marginRight + marginLeft
      // 开始滚动，距离刚好是目前完整显示的卡片所占的宽度
      const distance = Math.floor(width / cardWidth) * cardWidth
      // true 向右滚动、 false 向左滚动
      const scroll = direction ? list.scrollLeft + distance : list.scrollLeft - distance
      this.smoothScroll(list, scroll)
    },
    /** 平滑滚动 */
    smoothScroll (element, scroll) {
      // 决定运动方向
      const speed = element.scrollLeft < scroll ? 80 : -80
      // 持续滚动，直到抵达目标位置。
      const IntervalId = setInterval(() => {
        const newScroll = element.scrollLeft + speed
        element.scrollLeft = newScroll
        // 检查是否抵达目的
        let arrive
        if (speed > 0) arrive = element.scrollLeft >= scroll
        else arrive = element.scrollLeft <= scroll
        // 如果抵达目的地，或者触碰边缘，则停止。
        if (arrive || element.scrollLeft !== newScroll) {
          element.scrollLeft = scroll
          clearInterval(IntervalId)
        }
      }, 10)
    }
  }
}
</script>

<style lang="less" scoped>
.songs {
  margin: 20px auto;
  max-width: 1240px;
  width: 100%;
  &-header {
    margin: 0 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #E56D9B;
      line-height: 22px;
    }
    a {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 20px;
      .header-icon {
        color: #FFFFFF;
        font-size: 18px;
      }
    }
  }
  &-list {
    margin: 0 20px 0;
    display: flex;
    overflow: hidden;
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .single-card {
      margin-right: 16px;
    }
    .album-card {
      margin-right: 42px;
    }
  }
  &-scroll-box {
    position: relative;
  }
  &-scroll {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 50%;
    bottom: 50%;
    z-index: 1;
    transition: all 0.1s ease-in;
    &:hover {
      transform: scale(1.5);
      i {
        text-shadow: 3px 6px 15px black;
      }
    }
    i {
      font-size: 45px;
      color: white;
      text-shadow: 1px 4px 10px black;
    }
    &.scroll-left {
      left: 20px;
    }
    &.scroll-right {
      right: 20px;
    }
  }

}
</style>
