<template>
<div>
  <h4>我的夢寶積分</h4>
  <p><span class="wallet-value">{{currentGem}}</span>點</p>
  <Form ref="transferPoint" :model="transferPoint" :rules="transferPointRule" label-position="top" style="max-width:300px">
    <FormItem label="碳鏈錢包地址" prop="walletAddress">
      <Input type="text" readonly v-model="walletAddress"></Input>
    </FormItem>
    <FormItem label="已申購數量 / 可申購總量" prop="transferrRatio" v-if="limit.has_limit">
      <span>{{`${limit.used} / ${limit.max}`}}</span>
      <Progress :percent="limitRatio"></Progress>
    </FormItem>
    <FormItem :label="`兌換比例: ${transferRate}`">
      <span>剩餘可申購數量：{{limit.remain}}</span>
      <Row>
        <Col span="11">
          <FormItem prop="fromValue">
            <InputNumber :min="0" v-model="fromValue"></InputNumber>
            <span>夢寶積分</span>
          </FormItem>
        </Col>
        <Col span="2">-></Col>
        <Col span="11">
          <FormItem prop="toValue">
            <InputNumber :min="0" v-model="toValue"></InputNumber>
            <span>碳鏈</span>
          </FormItem>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="請輸入二級密碼" prop="password">
      <Input type="password" v-model="transferPoint.password"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('transferPoint')">申購碳鏈</Button>
    </FormItem>
  </Form>
  <h4>碳鏈申購狀態</h4>
<!--   <Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page> -->
   <Table :columns="transferApplyCols" :data="transferPointList"></Table>
</div>
</template>

<script>
export default {

  name: 'PointToC',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      }
      callback()
    }
    const validateFromValue = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('申購數量必須大於 0'))
      }
      if (value % this.fromLimit !== 0) {
        callback(new Error(`申購數量必須是 ${this.fromLimit} 的倍數`))
      }
      callback()
    }
    const validateToValue = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('申購數量必須大於 0'))
      }
      if (value > this.limit.remain) {
        callback(new Error(`申購數量不得超過剩餘可申購量`))
      }
      callback()
    }
    return {
      fromGem: 4,
      toGem: 5,
      transferPoint: {
        fromValue: 0,
        toValue: 0,
        password: '',
      },
      transferPointRule: {
        fromValue: [
          { required: true, type: 'number', validator: validateFromValue, trigger: 'blur' },
        ],
        toValue: [
          { required: true, type: 'number', validator: validateToValue, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
      transferApplyCols: [
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
      statusLookUp: {
        '0': '審核中',
      },
    }
  },
  computed: {
    // current gem
    currentGem () {
      return this.$store.getters.wallet.find(wallet => wallet.gem === this.fromGem).amount
    },
    walletAddress () {
      return this.$store.getters.wallet[this.toGem].external_address
    },
    transferRate () {
      let trans = `${this.fromGem}:${this.toGem}`
      return this.$store.getters.walletTransferRate[trans].split(':').join(' : ')
    },
    limit () {
      return this.$store.getters.walletTransferLimit
    },
    limitRatio () {
      return Number((this.limit.used / this.limit.max).toFixed(2)) * 100
    },
    fromValue: {
      get () {
        return this.transferPoint.fromValue
      },
      set (value) {
        this.transferPoint.fromValue = Number(value)
        this.transferPoint.toValue = Number((value * this.toFromRatio).toFixed(1))
      },
    },
    toValue: {
      get () {
        return this.transferPoint.toValue
      },
      set (value) {
        this.transferPoint.toValue = Number(value)
        this.transferPoint.fromValue = Number((value / this.toFromRatio).toFixed(1))
      },
    },
    fromLimit () {
      let end = this.transferRate.indexOf(':')
      return this.transferRate.slice(0, end)
    },
    toLimit () {
      let start = this.transferRate.indexOf(':') + 1
      return this.transferRate.slice(start, this.transferRate.length)
    },
    toFromRatio () {
      return this.toLimit / this.fromLimit
    },
    transferPointList () {
      let list = this.$store.getters.pointTransferList.data
      if (list) {
        list.map(data => {
          data.status = this.statusLookUp[data.status]
        })
      }
      return list
    },
    paging () {
      return this.$store.getters.paging('wallet', 'pointTransferList')
    },
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const data = {
            to_gem: this.toGem,
            amount: this.transferPoint.fromValue,
            wallet_password: this.transferPoint.password,
          }
          const mainGemValue = this.fromGem
          const toValue = this.toGem
          try {
            await this.$store.dispatch('ApplyPointTransfer', {mainGemValue, data})
          } catch (e) {
            this.$Message.error(e.response.data.message)
            return
          }
          this.$Message.success('轉出成功!')
          this.$store.dispatch(`GetPointTransferList`, {mainGemValue})
          this.$store.dispatch(`GetTransferLimit`, {mainGemValue, toValue})
          this.handleReset('transferPoint')
        } else {
          this.$Message.error('請確實填寫資料!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    async changePage (nextIndex) {
      let mainGemValue = this.fromGem
      const searchParams = new URLSearchParams()
      await this.$store.dispatch('GetPointTransferList', { mainGemValue, nextIndex, searchParams })
    },
  },
}
</script>

<style lang="css">
.wallet-value {
  font-size: 2em;
}
</style>
