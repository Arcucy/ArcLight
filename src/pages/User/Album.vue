<template>
  <userAllSellings
    type="album"
    label="Album"
    :pagesize="10"
  />
</template>

<script>
import userAllSellings from '@/components/User/UserAllSellings.vue'
export default {
  components: {
    userAllSellings
  }
}
</script>
