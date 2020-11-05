<template>
  <div class="autocomplete-container">
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      class="autocomplete"
      :class="(select || search) && 'hidden-triangle'"
      outlined
      dense
      clearable
      label="Genre Filter"
      dark
      color="#E56D9B"
    />
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
      search: '',
      select: ''
    }
  },
  created () {
    const mg = new MusicGenres()
    this.items = mg.genres
    this.select = this.value
    window.vueTest = this
  },
  watch: {
    select (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.select = val
    }
  }
}
</script>

<style lang="less" scoped>
.autocomplete-container {
  height: 40px;
}
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
  /deep/ .v-input__control .v-input__slot .v-select__slot .v-input__append-inner .v-input__icon {
    &.v-input__icon--clear {
      display: none;
    }
  }
  &.hidden-triangle {
    /deep/ .v-input__control .v-input__slot .v-select__slot .v-input__append-inner .v-input__icon {
      &.v-input__icon--clear {
        display: inline-flex;
      }
      &.v-input__icon--append {
        display: none;
      }
    }
  }
}
</style>
