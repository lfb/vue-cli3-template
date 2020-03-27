<template>
  <div>
    <h1 class="title">Hello Vue.js</h1>
    <van-button type="info">您好</van-button>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button } from 'vant';

Vue.use(Button);
export default {
  name: 'index',
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
  .title {
    margin: 64px;
  }
</style>
