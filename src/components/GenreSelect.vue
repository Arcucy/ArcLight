<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      class="autocomplete"
      flat
      hide-no-data
      hide-details
      :label="$t('searchGenre')"
      solo-inverted
      background-color="#333333"
    >
    </v-autocomplete>
  </div>
</template>

<script src="https://unpkg.com/musicgenres-json@latest/dist/index.js"></script>
<script>
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
    this.genres.push('None')
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
        this.loading = false
      }, 500)
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
