<template lang="html">
  <div>
    <h1 class="yellow-panel">行動裝置刷 QR code 登入</h1>
    <div id="placeHolder"><img id="qrcodeImg" src="" alt=""></div>
    <div class="download-apk"><a :href="apkUrl">點此下載行動裝置 App</a></div>
  </div>
</template>

<script>
import qrcode from 'qrcode-generator'
export default {
  data () {
    return {
      showButton: false,
    }
  },
  async mounted () {
    // call api create qr code
    await this.$store.dispatch('CreateQRcode')
    this.renderQRcode()
    setTimeout(() => {
      this.isLoginSuccess()
    }, 3500)
  },
  computed: {
    apkUrl () {
      return this.$store.getters.fullApkUrl
    },
  },
  methods: {
    renderQRcode () {
      var typeNumber = 0
      var errorCorrectionLevel = 'L'
      var qr = qrcode(typeNumber, errorCorrectionLevel)

      qr.addData(`${this.$store.getters.qrcode}`)
      qr.make()
      document.querySelector('#qrcodeImg').src = qr.createDataURL(10)
      this.showButton = true
    },
    async isLoginSuccess () {
      try {
        await this.$store.dispatch('LoginQRcode')
        this.$router.push('/Main')
      } catch (e) {
        if (!this.$store.getters.isLogin) {
          setTimeout(this.isLoginSuccess, 2000)
        }
      }
    },
  },
}
</script>

<style lang="css" scoped>

h1 {
  text-align: center;
}

.download-apk {
  font-size: 2em;
  text-align: center;
  padding: 10px;
}

#placeHolder {
  background: top left / 100% 100% url('/static/images/qrcode.png');
  max-width: 100%;
  max-height: 100vh;
  display: flex;
}

#placeHolder > img {
  display: block;
  max-width: 70%;
  width: auto;
  margin: auto;
}
</style>
