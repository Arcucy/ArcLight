<template>
  <spaceLayout>
    <genreSelect v-model="genre" />
  </spaceLayout>
</template>

<script>

import spaceLayout from '@/components/Layout/Space.vue'
import genreSelect from '@/components/GenreSelect.vue'

export default {
  components: {
    spaceLayout,
    genreSelect
  },
  data () {
    return {
      genre: ''
    }
  }
}
</script>
