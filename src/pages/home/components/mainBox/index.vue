<script>
import device from './components/device/index.vue'
import { baseURL, request } from '~/composables/request'

// 获取刷脸人员个人信息
function getPersonInfo(deviceNum) {
  // console.log('deviceNum', deviceNum)
  return request(deviceNum === 2 ? '/result/displayInfo' : '/result/aloneMachine', {
    method: 'post',
  })
}

// 清除数据库(测试时所需)
function clear() {
  return request('/result/recoverData')
}

export default defineComponent({
  name: 'MainBox',
  components: {
    Device: device,
  },
  props: {
    devNum: { type: Number, default: 2 },
  },
  data() {
    return {
      testMode: false,
      faceList: new Array(Number(this.devNum)).fill().map(() => {
        return new Array(4).fill({})
      }),
      personInfoList: [],
      showErrorMessage: new Array(2).fill({ message: '', status: false }),
      timer: new Array(2).fill(null),
      stopLoad: false,
    }
  },
  computed: {
    deviceNum() {
      let deviceNum = Number(this.devNum)
      deviceNum = deviceNum % 2 === 0 ? 2 : 1
      return deviceNum
    },
    routerParamNum() {
      const routerParamNum = Number(this.devNum)
      return routerParamNum
    },
  },
  created() {
    this.closeMessage()
  },
  mounted() {
    if (this.testMode)
      return

    // 机号
    // let deviceNum = this.deviceNum
    // http机制
    // this.loopRequest(deviceNum)

    // websocket机制
    this.buildWebsocket(this.routerParamNum)

    // 检测断网 重连处理
    window.addEventListener('offline', this.offlineHandler)
    window.addEventListener('online', this.onlineHandler)
    window.addEventListener('beforeunload', e => this.reLoadPage(e))
  },
  methods: {
    // 无限循环请求员工数据
    loopRequest(deviceNum) {
      // alert(deviceNum)
      getPersonInfo(deviceNum).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          const isEvenNum = res.data.personInfo.window % 2 === 0 ? 1 : 0
          this.$set(this.personInfoList, isEvenNum, res.data.personInfo)
          // console.log('this.personInfoList', this.personInfoList)
          this.$set(this.faceList, isEvenNum, res.data.passFace)
          // return
          // if (this.faceList[0].length === 2 || this.faceList[1].length === 2) return
          this.loopRequest(deviceNum)
        } else if (res.code === 500) {
          this.stopLoad = true
          ElMessage({
            message: '网络请求出错 请手动刷新页面',
            type: 'error',
            title: '连接出错',
          })
        } else if (res.code === 100) {
          // 已经消费过了
          const window = res.data.window
          const message = res.message
          const data = {
            message,
            status: true,
          }
          this.$set(this.showErrorMessage, window - 1, data)
          setTimeout(() => {
            this.$set(this.showErrorMessage, window - 1, {
              message: '',
              status: false,
            })
          }, 3500)

          this.loopRequest(deviceNum)
        } else {
          this.loopRequest(deviceNum)
        }
      })
    },
    // 建立一个websocket双向通讯连接
    buildWebsocket(routerParamNum) {
      // console.log(routerParamNum)
      // return
      if (typeof WebSocket === 'undefined') {
        // alert("您的浏览器不支持socket");

        ElMessage({
          message: '您的浏览器不支持socket 请使用谷歌浏览器',
          type: 'error',
          title: '连接出错',
          success() {
            this.buildWebsocket(routerParamNum)
          },
        })
      } else {
        // 实例化socket
        // 此处使用wss是后端配置过，保证在https下不被拦截
        const url = baseURL
        const websockeyPath = `ws://${url}/webSocketServer/${routerParamNum}`
        // console.log(websockeyPath)
        this.socket = new WebSocket(websockeyPath)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    // socket连接成功
    open() {
      // console.log("socket连接成功");
      // this.moveClose()
    },
    // socket连接错误
    error() {
      // console.log("socket连接错误");

      this.infoHandler({ code: 500, scokeyErr: true })
      // openMessageBox({
      //   psContent: '网络请求出错 请手动刷新页面',
      //   type: 'error',
      //   title: '连接出错'
      // })
    },
    // 获取到后台数据
    getMessage(res) {
      // console.log('获取到原始数据', res);
      const webSocketData = res.data
      this.infoHandler(webSocketData)
      // console.log('获取到数据data', data);
    },
    // 数据处理
    infoHandler(webSocketData, isOffLine) {
      // console.log('webSocketData', webSocketData)
      if (webSocketData.constructor !== Object)
        webSocketData = JSON.parse(webSocketData)

      if (!webSocketData.code)
        return

      // console.log('获取到处理后数据', webSocketData);
      // 200 为正常数据 500为后台崩溃 100为提示信息处理
      if (webSocketData.code === 200) {
        const { data } = webSocketData
        const isEvenNum = data.personInfo.window && data.personInfo.window % 2 === 0 ? 1 : 0
        // let isEvenNum = data.personInfo.window % 2 === 0 && data.personInfo.window < 4 ? 1 : data.personInfo.window % 2 !== 0 && data.personInfo.window >= 4 ? 1 : 0
        this.$set(this.personInfoList, isEvenNum, data.personInfo)
        // console.log('this.personInfoList', this.personInfoList)
        this.$set(this.faceList, isEvenNum, data.passFace)
        // return
        // if (this.faceList[0].length === 2 || this.faceList[1].length === 2) return
      } else if (webSocketData.code === 500) {
        this.stopLoad = true
        let message = '网络请求出错 请手动刷新页面'
        if (isOffLine)
          message = '网络不通 请检查网络'

        ElMessage({
          message,
          type: 'error',
          title: '连接出错',
        })
        if (!webSocketData.scokeyErr)
          return
        this.moveClose()
      } else if (webSocketData.code === 100) {
        const { data } = webSocketData
        // let isEvenNum = data.window % 2 === 0 && data.window < 4 ? 1 : data.window % 2 !== 0 && data.window >= 4 ? 1 : 0
        const isEvenNum = data.window && data.window % 2 === 0 ? 1 : 0
        const message = webSocketData.message
        // let itemTimer = this.timer[isEvenNum]

        // 先清除定时器和提示信息数据
        this.$set(this.showErrorMessage[isEvenNum], 'status', false)
        clearTimeout(this.timer[isEvenNum])
        const mesInfo = {
          message,
          status: true,
        }
        // this.$set(this.showErrorMessage, isEvenNum, mesInfo)

        this.$set(this.showErrorMessage, isEvenNum, mesInfo)

        this.timer[isEvenNum] = setTimeout((_) => {
          this.$set(this.showErrorMessage[isEvenNum], 'status', false)
        }, 3000)
      }
    },
    // 发送信息给后台
    moveClose() {
      const readyState = this.socket.readyState
      if (readyState > 1) {
        // console.log('> 3', readyState)
        return
      }
      // websocket请求无法设置请求头，在此采用建立连接之后主动推送token和userId给后端
      // let token = this.$cookies.get("auth");
      // let userId = this.$cookies.get("user_id");
      this.socket.send(
        JSON.stringify({
          isClosed: 'close',
          content: '我断开了websocket链接',
          params: {
            headers: {
              Connection: 'upgrade', // 此处看后端要求
            },
          },
        }),
      )
      // console.log('this.socket', this.socket)
    },
    // 网络离线处理
    offlineHandler() {
      // console.log("离线处理");
      this.infoHandler({ code: 500 }, true)
    },
    // 网络重连处理
    onlineHandler() {
      this.stopLoad = true
      // console.log("重连处理");
      // this.reload();
      window.location.reload()
    },
    // 关闭弹窗
    closeMessage() {
      const mesEle = document.querySelector('.el-message-box__wrapper')
      // console.log('mesEle', mesEle)
      if (!mesEle)
        return
      mesEle.querySelector('.el-message-box__headerbtn').click()
      this.closeMessage()
    },
    // 清除余额缓存数据
    emptyPersonInfo(index) {
      // console.log('index', index)
      this.personInfoList[index].UserBalance = '-'
    },
    // 清除员工吃饭数据
    clearHandler() {
      clear()
    },
    // 用以监听刷新或者浏览器关闭
    reLoadPage() {
      this.moveClose()
    },
    // 测试弹框
    testAlert() {
      // 伪数据测试
      const res = {
        code: 100,
        data: {
          window: 1,
        },
        message: '你已经消费过了!',
      }

      // 已经消费过了
      const window = res.data.window
      const message = res.message
      const data = {
        message,
        status: true,
      }
      const isEvenNum = window % 2 === 0 ? 1 : 0
      // let itemTimer = this.timer[isEvenNum]

      // 先清除定时器和提示信息数据
      this.$set(this.showErrorMessage[isEvenNum], 'status', false)
      clearTimeout(this.timer[isEvenNum])
      // let mesInfo = {
      //   message,
      //   status: true
      // }
      // this.$set(this.showErrorMessage, isEvenNum, mesInfo)

      this.$set(this.showErrorMessage, isEvenNum, data)

      this.timer[isEvenNum] = setTimeout((_) => {
        this.$set(this.showErrorMessage[isEvenNum], 'status', false)
      }, 3000)
      // this.$message({
      //   message: '你已经消费了，就不要浪费钱了！！！',
      //   type: 'error',
      //   duration: '999999',
      //   showClose: false
      // })
      // document.querySelector('.el-message').style.left = '0'
      // document.querySelector('.el-message').style.left = '6%'
      // console.log(document.querySelector('.el-message').style)
    },
    // 测试人脸识别
    testSucc() {
      // 伪数据测试
      const resData = {
        code: 200,
        data: {
          passFace: [
            {
              PhotoName: 'f14.jpg',
              StaffID: 9795,
              name: '骆庆祥',
            },
          ],
          personInfo: {
            AccountNumer: 2,
            CardType: '1类卡',
            ExpireDate: '2024-03-18',
            Name: '骆庆祥',
            PhotoName: 'f14.jpg',
            QuanCheng: '三水区区委政法委',
            Sex: 0,
            StartDate: '2021-03-18',
            UserBalance: 129,
            window: 2,
          },
        },
      }

      this.infoHandler(resData)

      // this.$message({
      //   message: '你已经消费了，就不要浪费钱了！！！',
      //   type: 'error',
      //   duration: '999999',
      //   showClose: false
      // })
      // document.querySelector('.el-message').style.left = '0'
      // document.querySelector('.el-message').style.left = '6%'
      // console.log(document.querySelector('.el-message').style)
    },
    // 测试人脸识别-余额不足
    testSuccBalanceNoAmple() {
      // 伪数据测试
      const resData = {
        code: 200,
        data: {
          passFace: [
            {
              PhotoName: 'f14.jpg',
              StaffID: 9795,
              name: '骆庆祥',
            },
            {
              PhotoName: 'z39.jpg',
              StaffID: 8594,
              name: '张辉昌',
            },
          ],
          personInfo: {
            AccountNumer: 2,
            CardType: '1类卡',
            ExpireDate: '2024-03-18',
            Name: '张辉昌',
            PhotoName: 'f14.jpg',
            QuanCheng: '三水区区委政法委',
            Sex: 0,
            StartDate: '2021-03-18',
            UserBalance: 9,
            window: 2,
          },
        },
      }

      this.infoHandler(resData)

      // this.$message({
      //   message: '你已经消费了，就不要浪费钱了！！！',
      //   type: 'error',
      //   duration: '999999',
      //   showClose: false
      // })
      // document.querySelector('.el-message').style.left = '0'
      // document.querySelector('.el-message').style.left = '6%'
      // console.log(document.querySelector('.el-message').style)
    },
  },
})
</script>

<template>
  <div class="wrap">
    <!-- 开发环境 测试调用 -->
    <!-- <div style="
    top: 0px;
    left: 0px;
    position: absolute;
    color: #fff;
    font-size: 20px;
    background: red;
    cursor: pointer;"
    @click="clearHandler"
    >清除数据库</div> -->
    <div v-if="testMode">
      <div
        style="
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    background: red;"
        @click="testAlert"
      >
        测试弹框
      </div>
      <div
        style="
    position: absolute;
    top: 0;
    left: 10%;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    background: red;"
        @click="testSucc"
      >
        测试人脸识别
      </div>
      <div
        style="
    position: absolute;
    top: 0;
    left: 20%;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    background: red;"
        @click="testSuccBalanceNoAmple"
      >
        测试人脸识别-余额不足
      </div>
    </div>

    <Device
      v-for="(_, devIndex) of deviceNum"
      :key="devIndex"
      v-model:person-info="personInfoList[devIndex]"
      :window-index="devIndex + 1"
      :class="devIndex > 0 ? 'later' : ''"
      :face-list="faceList"
      :show-error-message="showErrorMessage[devIndex]"
      :stop-load="stopLoad"
      @emptyPersonInfo="emptyPersonInfo"
    />
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: row;

  // align-items: center;
  justify-content: center;
  width: 1724px;

  // height: 900px;
  height: 83.33vh;

  // background-color: gray;
  padding-top: 2.31vh;

  .later {
    position: relative;
    margin-left: 142px;

    &::before {
      position: absolute;

      // top: -12px;
      top: -1.11vh;
      left: -70px;

      // background-color: red;
      width: 2px;

      // height: calc(100% + 23px);
      height: calc(100% + 2.12vh);
      content: "";
      background-color: #189add;
    }
  }
}
</style>
