<template>
  <spaceLayout>
    <div id="title">ArcLight</div>
    <div id="subtitle">
      <span>Store</span>
      <span>In</span>
      <span>Permaweb</span>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

export default {
  components: {
    spaceLayout
  }
}
</script>

<style lang="less" scoped>
#title {
  position: absolute;
  font-weight: 300;
  top: 49%;
  left: 0;
  right: 0;
  margin-top: -80px;
  font-size: 130px;
  text-align: center;
  letter-spacing: 25px;
  padding-left: 25px;
  background: -webkit-linear-gradient(white, #dbdde0, #38495a);
  background-clip: text;
  -webkit-background-clip: text;
  animation-duration: 6s;
  animation-timing-function: ease-in-out;
  animation-name: animTitle;
}

#subtitle {
  position: absolute;
  font-weight: 300;
  top: 70%;
  left: 0;
  right: 0;
  font-size: 25px;
  text-align: center;
  letter-spacing: 6px;
  span {
    color: #d8d8d8;
    animation-duration: 6s;
    animation-timing-function: ease;
    &:nth-child(1) {
      animation-name: animOne;
    }
    &:nth-child(2) {
      animation-name: animTwo;
    }
    &:nth-child(3) {
      animation-name: animThree;
    }
  }
}

@media screen and (max-width: 1000px) {
  #title {
    font-size: 6rem;
    letter-spacing: 1rem;
  }
}

@media screen and (max-width: 600px) {
  #title {
    font-size: 4rem;
    letter-spacing: 1rem;
  }
}

@media screen and (max-width: 400px) {
  #title {
    font-size: 2rem;
    letter-spacing: 0.5rem;
  }
  #subtitle span {
    font-size: 16px;
  }
}
</style>
