<template>
<div class="qr-container">
  <div class="qr-single" v-for="(item, key) in childInfo" :key="key">
    <h4>{{item.id}}</h4>
    <img :id="item.id" :src="renderQRcode(item.url, item.id)">
  </div>
</div>
</template>

<script>
import qrcode from 'qrcode-generator'
export default {

  name: 'QRCodes',
  mounted () {

  },
  data () {
    return {

    }
  },
  computed: {
    childInfo () {
      if (this.$store.getters.isExist('user', 'childAccount')) {
        let child = this.$store.getters.childAccount.map(item => {
          return {
            id: item.id,
            url: `${this.$store.getters.host}/#/Login?upline_id=${item.id}`,
          }
        })
        let momId = this.$store.getters.momId
        let url = `${this.$store.getters.host}/#/Login?upline_id=${momId}`
        child.unshift({id: momId, url: url})
        return child
      } else {
        return []
      }
    },
  },
  methods: {
    renderQRcode (url, id) {
      var typeNumber = 0
      var errorCorrectionLevel = 'L'
      var qr = qrcode(typeNumber, errorCorrectionLevel)

      qr.addData(url)
      qr.make()
      return qr.createDataURL(5)
    },
  },
}
</script>

<style lang="css" scoped>
.qr-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.qr-single {
  margin-left: 20px;
  margin-bottom: 20px;
}

.qr-single h4 {
  text-align: center;
  font-size: 2em;
}

.qr-single img{
  width: 100%;
}
</style>
