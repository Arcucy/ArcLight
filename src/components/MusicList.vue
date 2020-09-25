<template>
  <div class="music-list">
    <v-card
      height="200"
      width="256"
      class="mx-auto"
    >
      <v-navigation-drawer permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Music List
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item
            v-for="item in audioList"
            :key="item.name"
            link
            :href="item.path"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      audioList: [
        {
          name: 'Flower Dance',
          path: '#/music/flowerdance'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.music-list {
  padding-top: 200px;
  text-align: center;
  margin-top: 20rem;
  width: 50%;
  border-radius: 20px;
  margin: 0 auto;
  justify-content: center;
  display: flex;
}

/deep/ .menu-list a {
  border-radius: 10px;
  color: white;
}

/deep/ .menu-list a:hover {
  background-color: #E56D9B;
}

/deep/ .menu-label {
  font-size: 1rem !important;
}

/deep/ span {
  font-size: 1.2rem !important;
}
</style>
