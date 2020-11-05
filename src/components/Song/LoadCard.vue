<template>
  <div :style="`width:${width};height:${height}; `" class="loadcard" v-ripple>
    <v-progress-circular v-if="!message" indeterminate color="#E56D9B" />
    <p v-else>
      {{ message }}
    </p>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    width: {
      type: String,
      default: '128px'
    },
    height: {
      type: String,
      default: '231px'
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.loadcard {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #ffffff0d;
  padding: 10px;
  p {
    color: white;
  }
}
</style>
