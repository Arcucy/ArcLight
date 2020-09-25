<template>
  <div data-app="true">
    <v-autocomplete
      v-model="select.id"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      no-filter
      return-object
      class="mx-4 autocomplete"
      flat
      hide-details
      hide-no-data
      label="Search address / user / music"
      solo-inverted
      background-color="#333333"
    >
      <template v-slot:item="data">
        <template v-if="typeof (data.item) !== 'object'">
          <v-list-item-content v-text="data.item.id"></v-list-item-content>
        </template>
        <template v-else-if="data.item.searchType === 'Tx'">
          <v-list-item-icon style="margin-right: 10px;">
            <v-icon large color="#E56D9B">{{data.item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <a @click="goResult(data.item.id, data.item.type)">
            <v-list-item-title v-html="data.item.id"></v-list-item-title>
            <v-list-item-subtitle v-html="data.item.type" style="text-align: left; color: #ED6A83;"></v-list-item-subtitle>
            </a>
          </v-list-item-content>
        </template>
        <template v-else-if="data.item.searchType === 'Music'">
          <v-list-item-icon style="margin-right: 10px;">
            <v-icon large color="#E56D9B">{{data.item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <a @click="goResult(data.item.id, data.item.type)">
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="'by ' + data.item.artist" style="text-align: left; color: #ED6A83;"></v-list-item-subtitle>
            </a>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
import api from '@/api/api'
import decode from '@/util/decode'

export default {
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: [],
      option: [],
      AUDIO_ICON: {
        'single-info': 'mdi-music-circle',
        'album-info': 'mdi-album',
        'podcast-info': 'mdi-podcast',
        'soundeffect-info': 'mdi-waveform'
      },
      REVERSED_AUDIO_TYPE: {
        'single-info': 'Single',
        'album-info': 'Album',
        'podcast-info': 'Podcast',
        'soundeffect-info': 'Sound Effect'
      }
    }
  },
  watch: {
    async search (val, oldVal) {
      val && val !== oldVal && await this.querySelections(val)
    },
    select (val) {
      console.log(val)
    }
  },
  methods: {
    async querySelections (v) {
      this.loading = true
      let res = []

      if (typeof (v) === 'string' && v.length === 43) {
        let tx = await api.arweave.getTransactionDetail(v)

        if (tx) {
          const tags = await api.arweave.getTagsByTransaction(tx)
          const data = JSON.parse(decode.uint8ArrayToString(tx.data))
          console.log(tags)
          console.log(data)
          res.push({ searchType: 'Tx', id: tx.id, title: data.title, artist: tags['Author-Username'], type: this.REVERSED_AUDIO_TYPE[tags['Type']], icon: this.AUDIO_ICON[tags['Type']] })
        }
      }

      // {
      //   res = await api.arweave.querySearch(v)
      //   if (res) {
      //     res.forEach(item => {
      //       this.option.push(item)
      //     })
      //   }
      // }

      // if (res.length !== 0) {
      //   this.search = ''
      // }
      this.items = res

      // this.items = this.option.filter(e => {
      //   return (JSON.stringify(e) || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
      // })

      console.log('查询结果：', this.items)

      this.loading = false
    },
    goResult (id, type) {
      if (type === 'Album') {
        this.$router.push({ path: '/album/' + id })
      } else if (type !== 'User') {
        this.$router.push({ path: '/music/' + id })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.autocomplete {
  /deep/ .v-label.theme--light{
    color: white;
  }

  /deep/ .v-icon.mdi-menu-down.theme--light {
    color: white;
    &.primary--text {
      color: #E56D9B !important;
      caret-color: #E56D9B !important;
    }
  }
}
</style>
