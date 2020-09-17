<template>
  <div>
    <spaceLayout>
      <div class="about-container">
        <div class="about-title">
          Why <span class="pink-text">ArcLight</span> ?
        </div>
        <div class="about-subtitle">
          about Project <span class="pink-text">ArcLight</span>
        </div>
      </div>
    </spaceLayout>
  </div>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

export default {
  components: {
    spaceLayout
  },
  mounted () {
    document.title = 'Why Choose ArcLight - ArcLight Music Distribution Platform'
  }
}
</script>

<style lang="less" scoped>
.about-container {
  margin: 80px auto 20px;
  max-width: 840px;
  width: 100%;
  padding: 0 20px;
  text-align: start;
}

.about-title {
  font-size: 32px;
  color: white;
}

.about-subtitle {
  font-size: 20px;
  color: white;
}

.pink-text {
  color: #EA6290;
}
</style>
