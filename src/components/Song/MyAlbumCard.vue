<template>
  <div class="card" v-ripple>
    <div class="card-cover">
      <v-img
        class="card-cover-img"
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
      <div class="card-cover-record">
        <img src="@/assets/image/record.png" alt="record">
      </div>
    </div>
    <div class="card-right">
      <div class="info">
        <p class="info-title">
          {{ card.title }}
        </p>
        <p class="info-artist">
          by {{ card.artist }}
        </p>
      </div>
      <div class="download">
        <v-icon>mdi-download</v-icon>
      </div>
    </div>
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

.word-limit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
}

.card {
  display: flex;
  margin-bottom: 8px;
  cursor: pointer;
  &-cover {
    display: flex;
    width: 94px;
    margin-right: 8px;
    &-img {
      border-radius:5px;
      width: 64px;
      height: 64px;
      background: #252525;
      &-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    }
    &-record {
      width: 60px;
      height: 60px;
      min-height: 60px;
      min-height: 60px;
      margin-left: -30px;
      margin-top: 2px;

      img {
        width: 100%;
        height: 100%;
        min-height: 100%;
        min-height: 100%;
      }
    }
  }

  &-right {
    flex: 1;
    display: flex;
    border-bottom: 1px solid #B2B2B2;
    .info {
      flex: 1;
      &-title {
        margin: 9px 0 4px;
        font-size: 16px;
        font-weight: 500;
        color: white;
        line-height: 22px;
        .word-limit();
      }

      &-artist {
        margin: 0 0 16px;
        font-size: 14px;
        font-weight: 400;
        color: #B2B2B2;
        line-height: 20px;
        .word-limit();
      }
    }
    .download {
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        color: white;
        font-size: 30px;
      }
    }
  }
}
</style>
