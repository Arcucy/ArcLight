<template>
  <div class="card">
    <v-img
      class="card-img"
      src="https://picsum.photos/510/300?random"
      alt="cover"
      aspect-ratio="1"
    >
      <template v-slot:placeholder>
        <div class="card-img-loading">
          <v-progress-circular indeterminate color="#E56D9B" />
        </div>
      </template>
    </v-img>
    <p class="card-title">
      {{ card.title }}
    </p>
    <p class="card-artist">
      by {{ card.artist }}
    </p>
    <p v-if="card.price != 0" class="card-price">
      pay {{ card.price }} AR
    </p>
    <p v-else class="card-price">
      free
    </p>
    <p class="card-time">
      {{ card.time }}
    </p>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
p {
  text-align: left;
}
.card {
  width: 128px;
  .content {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
  }

  .word-limit {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    word-break: break-all;
  }

  &-img {
    border-radius:5px;
    width: 128px;
    height: 128px;
    background: #252525;
    &-loading {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }

  &-title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
    .word-limit();
  }

  &-artist {
    .content();
    .word-limit();
  }

  &-price {
    .content();
    .word-limit();
  }

  &-time {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 17px;
    .word-limit();
  }
}
</style>
