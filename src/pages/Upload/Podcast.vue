<template>
  <div>
    <spaceLayout>
      <div class="upload-single-container">
        <div class="upload-header">
          <router-link :to="{ name: 'Upload' }" class="back-link">
            <v-icon class="back-link-icon">mdi-chevron-left</v-icon>
            Back to Selection
          </router-link>
        </div>
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
  margin: 48px auto 20px;
  max-width: 1240px;
  width: 100%;
  padding: 0 20px;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .back-link {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: #E56D9B;
    line-height: 22px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s;
    &:hover {
      .back-link-icon {
        transform: translateX(-5px);
      }
    }
    .back-link-icon {
      color: #E56D9B;
      font-size: 22px;
    }
  }
}
</style>
