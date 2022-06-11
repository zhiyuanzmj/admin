<script lang="ts" setup>
import TitleBox from './components/titleBox.vue'
import DateBox from './components/dateBox.vue'
</script>

<template>
  <div class="wrap">
    <TitleBox />
    <DateBox class="date-time" />
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  position: relative;

  // background: skyblue;
  // padding: 0 70px;
  padding-top: 1.018518518518519vh;
}
</style>
