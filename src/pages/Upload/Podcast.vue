<template>
  <div>
    <spaceLayout>
      <div class="upload-single-container">
        <router-link :to="{ name: 'Upload' }" class="back-link">
          <v-icon color="#E56D9B">mdi-chevron-left</v-icon>
          Back to Selection
        </router-link>
      </div>
    </spaceLayout>
  </div>
</template>

<script>

import spaceLayout from '@/components/Layout/Space.vue'

export default {
  components: {
    spaceLayout
  },
  mounted () {
    document.title = 'Upload a new Single - ArcLight'
  }
}
</script>

<style lang="less" scoped>
.upload-single-container {
  margin: 20px auto;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;
}

.back-link {
  display: block;
  text-align: left;
}
</style>
