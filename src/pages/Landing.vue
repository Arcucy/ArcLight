<template>
  <spaceLayout>
    <div class="home">
      <div id="title">ArcLight</div>
      <div id="subtitle">
        <span>Store</span>
        <span>In</span>
        <span>Permaweb</span>
      </div>
    </div>
  </spaceLayout>
</template>

<script>
import spaceLayout from '@/components/Layout/Space'

export default {
  components: {
    spaceLayout
  },
  mounted () {
    document.title = 'ArcLight - Music Distribution Platform'
  }
}
</script>

<style lang="less" scoped>
.home {
  font-family: "lato", sans-serif;
  color: #FFF;
  background: radial-gradient(ellipse at bottom, #0c1116 0%, #090a0f 100%);
}
#title {
  position: absolute;
  font-weight: 300;
  top: 63%;
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
  top: 91%;
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

@keyframes animTitle {
  0% {
    transform: translateY(-26px);
    opacity: 0;
  }

  30%,
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

@keyframes animOne {

  0%,
  15% {
    transform: translateY(-26px);
    opacity: 0;
  }

  35%,
  80% {
    transform: translateY(0px);
    opacity: 1;
  }

  92%,
  100% {
    transform: translateY(-4px);
  }
}

@keyframes animTwo {

  0%,
  25% {
    transform: translateY(-26px);
    opacity: 0;
  }

  45%,
  80% {
    transform: translateY(0px);
    opacity: 1;
  }

  92%,
  100% {
    transform: translateY(-4px);
  }
}

@keyframes animThree {

  0%,
  35% {
    transform: translateY(-26px);
    opacity: 0;
  }

  55%,
  80% {
    transform: translateY(0px);
    opacity: 1;
  }

  92%,
  100% {
    transform: translateY(-4px);
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
