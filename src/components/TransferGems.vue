<template>
<div>
<h4>我的{{walletName}}</h4>
<span class="wallet-value">{{currentGem | valueUnit}}</span>
<Form ref="transferGems" :model="transferGems" :rules="transferRule" label-position="top" style="max-width:300px">
  <FormItem label="轉換種類">
    <Select v-model="selectedGem" style="width:200px" placeholder="請選擇轉換種類">
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
          <span>{{listLookUp[selectedGem]}}</span>
        </FormItem>
      </Col>
    </Row>
  </FormItem>
  <FormItem label="請輸入錢包密碼" prop="password">
    <Input type="password" v-model="transferGems.password"></Input>
  </FormItem>
  <FormItem>
    <Button type="primary" @click="handleSubmit('transferGems')">申請轉換</Button>
  </FormItem>
</Form>
</div>
</template>

<script>
export default {

  name: 'TransferGems',
  mounted () {
    this.selectedGem = this.gemList[0].value
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
    },
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      }
      callback()
    }

    return {
      mainGemValue: 0,
      walletName: '',
      selectedGem: 0,
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
      transferGems: {
        fromValue: 0,
        toValue: 0,
        password: '',
      },
      transferRule: {
        fromValue: [
          { required: true, type: 'number', trigger: 'blur', message: '請輸入數字' },
          { type: 'number', min: 1, trigger: 'blur', message: '轉換數量必須大於1' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
    }
  },
  filters: {
    valueUnit (value) {
      return `${value} 點`
    },
  },
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
      let pickedRate = `${this.pageGem}_${this.selectedGem}`
      return this.$store.getters.walletTransferRate[pickedRate]
    },
    fromValue: {
      get () {
        return this.transferGems.fromValue
      },
      set (value) {
        this.transferGems.fromValue = Number(value)
        this.transferGems.toValue = Number((value * this.transferRate).toFixed(1))
      },
    },
    toValue: {
      get () {
        return this.transferGems.toValue
      },
      set (value) {
        this.transferGems.toValue = Number(value)
        this.transferGems.fromValue = Number((value / this.transferRate).toFixed(1))
      },
    },
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let mainGemValue = this.mainGemValue
          let data = {
            to_gem: this.selectedGem,
            amount: this.transferGems.fromValue,
            wallet_password: this.transferGems.password,
          }
          await this.$store.dispatch('ApplyWalletTransfer', {mainGemValue, data})
          await this.$store.dispatch(`WalletPage`)
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
  },
}
</script>
