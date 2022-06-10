<script setup lang="ts" name="person-staff-balance">
const { status, data, send, open, close } = useWebSocket(`${location.protocol === 'https' ? 'wss' : 'ws'}://${location.host}${baseURL}/webSocketServer/pay/1`)
</script>

<template>
  <div>
    <VHeader />
    <div table>
      <el-image src="" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 余额充值
  layout: default
  hidden: true
</route>
