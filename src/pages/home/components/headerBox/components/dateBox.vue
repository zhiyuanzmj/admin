<script>
export default {
  data() {
    return {
      nowDate: '', // 当前日期
    }
  },
  mounted() {
    this.currentTime()
  },
  // 销毁定时器
  beforeUnmount() {
    if (this.formatDate)
      clearInterval(this.formatDate) // 在Vue实例销毁前，清除时间定时器
  },
  methods: {
    currentTime() {
      setInterval(this.formatDate, 500)
    },
    formatDate() {
      const date = new Date()
      const year = date.getFullYear() // 年
      const month = date.getMonth() + 1 // 月
      const day = date.getDate() // 日
      const week = date.getDay() // 星期
      // console.log('week', week)
      const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      let hour = date.getHours() // 时
      hour = hour < 10 ? `0${hour}` : hour // 如果只有一位，则前面补零
      let minute = date.getMinutes() // 分
      minute = minute < 10 ? `0${minute}` : minute // 如果只有一位，则前面补零
      let second = date.getSeconds() // 秒
      second = second < 10 ? `0${second}` : second // 如果只有一位，则前面补零
      this.nowDate = `${year}年${month}月${day}日 ${hour}:${minute}:${second} ${weekArr[week]}`
    },
  },
}
</script>

<template>
  <div class="date-box">{{ nowDate }}</div>
</template>

<style lang="scss" scoped>
.date-box {
  position: absolute;

  //  background-color: gray;
  right: 0;
  bottom: 0.9259259259259259vh;
  font-size: 12px !important;
  color: #fff;
}
</style>
