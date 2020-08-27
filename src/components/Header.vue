<template>
  <div class="header">
    <div class="link-container">
      <router-link :to="{ name: 'Landing' }" class="link">
        <img src="../assets/logo.png" style="height: 3rem">
      </router-link>
      <router-link :to="{ name: 'Landing' }" class="link text-link">
        ArcLight
      </router-link>
      <router-link :to="{ name: 'MusicMenu' }" class="link text-link">
        Music
      </router-link>
    </div>
  </div>
</template>

<style lang="less" scoped>
.link-container {
  margin-top: 2rem;
  margin-left: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
}

.link {
  margin-left: .75rem;
  font-size: 1.2rem;
}

.text-link {
  margin-bottom: 5px;
}

.text-link:hover {
  animation-name: colorChange;
  animation-duration: 0.25s;
  animation-timing-function: ease-in-out;
  color: #ff92bc;
}

@keyframes colorChange {
  0% {
    color: white;
  }
  100% {
    color: #ff92bc;
  }
}

/deep/ a {
  color: white;
}
</style>
