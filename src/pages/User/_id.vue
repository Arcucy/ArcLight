<template>
  <spaceLayout>
    <div class="user">
      <userInfo class="user-info" :user="user" />
      <!-- Singles Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            Singles Sellings
          </h4>
          <a>
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
        </div>
        <scrollXBox list-id="single" card-id="single-card">
          <singleCard
            id="single-card"
            class="single-card"
            v-for="(item, index) in singles"
            :key="index"
            :card="item"
          />
        </scrollXBox>
      </div>
      <!-- Albums Sellings -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            Albums Sellings
          </h4>
          <a>
            All Sellings
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
        </div>
        <scrollXBox list-id="albums" card-id="albums-card">
          <albumCard
            id="albums-card"
            class="album-card"
            v-for="(item, index) in singles"
            :key="index"
            :card="item"
          />
        </scrollXBox>
      </div>
      <!-- Favourite Singers -->
      <div class="songs">
        <div class="songs-header">
          <h4>
            Favourite Singers
          </h4>
          <a>
            All Singers
            <v-icon class="header-icon">mdi-chevron-right</v-icon>
          </a>
        </div>
        <scrollXBox list-id="singers" card-id="singers-card">
          <userCard
            id="singers-card"
            class="album-card"
            v-for="(follower, index) in followers"
            :key="index"
            :user="follower"
          />
        </scrollXBox>
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'
import userInfo from '@/components/User/UserInfo'
import singleCard from '@/components/Song/SingleCard'
import albumCard from '@/components/Song/AlbumCard'
import scrollXBox from '@/components/ScrollXBox'
import userCard from '@/components/User/UserCard'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    spaceLayout,
    userInfo,
    singleCard,
    albumCard,
    scrollXBox,
    userCard
  },
  data () {
    return {
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
      ],
      followers: [
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'Taylor Swift'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'TRXYE'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'TIKKA'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'Lady Gaga'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: '李知恩'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'Ariana Grande'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'Aril Lavigne Lavigne Lavigne Lavigne'
        },
        {
          avatar: 'https://picsum.photos/510/300?random',
          nickname: 'Little Sound'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['setUserPage', 'setIsMe'])
  },
  computed: {
    ...mapState(['wallet', 'isMe', 'username', 'userAvatar', 'userIntroduction', 'userType', 'userPage']),
    user () {
      let introduction = ''
      if (this.isMe) {
        if (this.userIntroduction === '') {
          introduction = 'No Introduction Yet'
        } else {
          introduction = this.userIntroduction
        }
        return { nickname: this.username, avatar: this.userAvatar, introduction: introduction, type: this.userType }
      } else {
        if (this.userPage.introduction === '') {
          introduction = 'No Introduction Yet'
        } else {
          introduction = this.userPage.introduction
        }
        return { nickname: this.userPage.nickname, avatar: this.userPage.avatar, introduction: introduction, type: this.userPage.type }
      }
    }
  },
  mounted () {
    this.setUserPage({ wallet: this.$route.params.id })
    if (this.wallet === this.$route.params.id) {
      console.log('isMe')
      this.setIsMe(true)
      document.title = this.username + '\'s Profile - ArcLight'
    } else {
      document.title = this.userPage.nickname + '\'s Profile - ArcLight'
    }

    // 假数据 循环 变多
    const followers = []
    for (let i = 0; i < 3; i++) {
      followers.push(...this.followers)
    }
    this.followers = followers
  }
}
</script>

<style lang="less" scoped>
.user {
  margin: 48px auto;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;
  &-info {
    margin-bottom: 48px;
  }
  .songs {
    width: 100%;
    margin-bottom: 48px;
    &-header {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h4 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #E56D9B;
        line-height: 22px;
      }
      a {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        &:hover {
          .header-icon {
            transform: translateX(5px);
          }
        }
        .header-icon {
          color: #FFFFFF;
          font-size: 18px;
        }
      }
    }

    .single-card {
      margin-right: 16px;
    }

    .album-card {
      margin-right: 42px;
    }

    .singers-card {
      margin-right: 24px;
    }
  }
}
</style>
