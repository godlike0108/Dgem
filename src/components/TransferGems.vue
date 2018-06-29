<template>
<div>
<h4>我的{{walletName}}</h4>
<p><span class="wallet-value">{{currentGem}}</span>點</p>
<Form ref="transferGems" :model="transferGems" :rules="transferRule" label-position="top" style="max-width:300px">
  <FormItem label="轉換種類" prop="selectedGem">
    <Select v-model="transferGems.selectedGem" style="width:200px" placeholder="請選擇轉換種類">
        <Option v-for="gem in gemList" :value="gem.value" :key="gem.value">{{ gem.name }}</Option>
    </Select>
  </FormItem>
  <FormItem :label="`兌換比例: ${transferRate}`">
    <Row>
      <Col span="11">
        <FormItem prop="fromValue">
          <InputNumber :min="0" v-model="fromValue"></InputNumber>
          <span>{{walletName}}</span>
        </FormItem>
      </Col>
      <Col span="2">-></Col>
      <Col span="11">
        <FormItem prop="toValue">
          <InputNumber :min="0" v-model="toValue"></InputNumber>
          <span>{{listLookUp[transferGems.selectedGem]}}</span>
        </FormItem>
      </Col>
    </Row>
  </FormItem>
  <FormItem label="請輸入二級密碼" prop="password">
    <Input type="password" v-model="transferGems.password"></Input>
  </FormItem>
  <FormItem>
    <Button type="primary" @click="handleSubmit('transferGems')">申請轉換</Button>
  </FormItem>
</Form>
<h4>寶石轉換申請狀態</h4>
<Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page>
 <Table :columns="transferApplyCols" :data="walletTransferList"></Table>
</div>
</template>

<script>
// this is for fetch data to store before Route enter
import store from '../store'
export default {
  name: 'TransferGems',
  beforeRouteEnter: async (to, from, next) => {
    let mainGemValue = to.params.gem
    await store.dispatch(`GetWalletTransferList`, {mainGemValue})
    next()
  },
  created () {
    this.transferGems.selectedGem = this.gemList[0].value
    // for first in page
    this.mainGemValue = this.$route.params.gem
    this.walletName = this.listLookUp[this.pageGem]
  },
  watch: {
    '$route' (to, from) {
      if (!this.$route.params.hasOwnProperty('gem')) {
        return
      }
      // react to route changes...
      this.mainGemValue = this.$route.params.gem
      this.walletName = this.listLookUp[this.pageGem]
      let mainGemValue = this.mainGemValue
      this.$store.dispatch(`GetWalletTransferList`, {mainGemValue})
      this.handleReset('transferGems')
    },
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      }
      callback()
    }
    const validateFromValue = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('轉換數量必須大於 0'))
      }
      if (value % this.fromLimit !== 0) {
        callback(new Error(`轉換數量必須是 ${this.fromLimit} 的倍數`))
      }
      callback()
    }

    return {
      mainGemValue: 0,
      walletName: '',
      listLookUp: {
        '0': '七彩寶石',
        '1': '多喜寶石',
        '2': '多福寶石',
        '3': '多財寶石',
        '4': '夢寶積分',
        '5': '碳幣',
        '6': '財神幣',
        '7': '美金',
        '8': '圓夢積分',
      },
      statusLookUp: {
        '0': '審核中',
      },
      transferGems: {
        selectedGem: null,
        fromValue: 0,
        toValue: 0,
        password: '',
      },
      transferRule: {
        selectedGem: [
          { required: true, type: 'number', trigger: 'blur', message: '請選擇轉換寶石種類' },
        ],
        fromValue: [
          { required: true, type: 'number', validator: validateFromValue, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
      transferApplyCols: [
        {
          title: '來源寶石',
          key: `from_gem`,
        },
        {
          title: '轉換寶石',
          key: 'to_gem',
        },
        {
          title: '匯率',
          key: 'rate',
        },
        {
          title: '數量',
          key: 'amount',
        },
        {
          title: '目前狀態',
          key: 'status',
        },
        {
          title: '建立時間',
          key: 'updated_at',
        },
      ],
    }
  },
  // filters: {
  //   valueUnit (value) {
  //     return `${value} 點`
  //   },
  // },
  computed: {
    // get current wallet index
    pageGem () {
      return this.mainGemValue
    },
    // current gem
    currentGem () {
      return this.$store.getters.wallet.find(wallet => wallet.gem === Number(this.mainGemValue)).amount
    },
    // get map list from wallet transfer map
    gemList () {
      return this.$store.getters.walletTransferMap[this.mainGemValue].map(gem => {
        return {
          name: this.listLookUp[gem],
          value: gem,
        }
      })
    },
    transferRate () {
      let pickedRate = `${this.pageGem}:${this.transferGems.selectedGem}`
      return this.$store.getters.walletTransferRate[pickedRate] || '請選擇兌換幣種'
    },
    fromValue: {
      get () {
        return this.transferGems.fromValue
      },
      set (value) {
        this.transferGems.fromValue = Number(value)
        this.transferGems.toValue = Number((value * this.toFromRatio).toFixed(1))
      },
    },
    toValue: {
      get () {
        return this.transferGems.toValue
      },
      set (value) {
        this.transferGems.toValue = Number(value)
        this.transferGems.fromValue = Number((value / this.toFromRatio).toFixed(1))
      },
    },
    fromLimit () {
      return this.transferRate.charAt(0)
    },
    toLimit () {
      return this.transferRate.charAt(2)
    },
    toFromRatio () {
      return this.toLimit / this.fromLimit
    },
    // for table
    walletTransferList () {
      let list = this.$store.getters.walletTransferList.data
      list.map(data => {
        data.from_gem = this.listLookUp[data.from_wallet.gem]
        data.to_gem = this.listLookUp[data.to_wallet.gem]
        data.status = this.statusLookUp[data.status]
      })
      return list
    },
    paging () {
      return this.$store.getters.paging('wallet', 'walletTransferList')
    },
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let mainGemValue = this.mainGemValue
          let data = {
            to_gem: this.transferGems.selectedGem,
            amount: this.transferGems.fromValue,
            wallet_password: this.transferGems.password,
          }
          await this.$store.dispatch('ApplyWalletTransfer', {mainGemValue, data})
          await this.$store.dispatch(`WalletPage`)
          await store.dispatch(`GetWalletTransferList`, {mainGemValue})
          this.$Message.success('申請成功！請等待審核通知')
          this.handleReset('transferGems')
        } else {
          this.$Message.error('申請失敗，請確實填寫資料')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    async changePage (nextIndex) {
      let mainGemValue = this.mainGemValue
      const searchParams = new URLSearchParams()
      await this.$store.dispatch('GetWalletTransferList', { mainGemValue, nextIndex, searchParams })
    },
  },
}
</script>
<style lang="css">
.wallet-value {
  font-size: 2em;
}
</style>
