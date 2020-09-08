<template>
  <div data-app="true">
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      class="mx-4"
      flat
      hide-no-data
      hide-details
      label="Search Genre"
      solo-inverted
      background-color="#333333"
    >
    </v-autocomplete>
  </div>
</template>

<script>

const MusicGenres = require('musicgenres-json')

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
      genres: []
    }
  },
  created () {
    const mg = new MusicGenres()
    this.genres = mg.genres
    this.select = this.value
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
    select (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.select = val
    }
  },
  methods: {
    xx () {

    },
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.genres.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        console.log(this.items)
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .v-label.theme--light{
  color: white;
}

/deep/ .v-icon.mdi-menu-down.theme--light {
  color: white;
}

/deep/ .v-list-item__title {
  text-align: left;
}

/deep/ .v-select-list.theme--light {
  background-color: rgba(51,51,51,0.8);
}

/deep/ .v-list-item__title {
  color: white;
}

/deep/ .v-list-item__mask {
color: white !important;
  background-color: #E56D9B !important;
}
</style>
