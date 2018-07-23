<template>
<div>
  <h4>我的夢寶積分</h4>
  <p><span class="wallet-value">{{currentGem}}</span>點</p>
  <Form ref="transferPoint" :model="transferPoint" :rules="transferPointRule" label-position="top" style="max-width:300px">
    <FormItem label="卡片號碼" prop="walletAddress">
      <Input type="text" readonly v-model="walletAddress"></Input>
    </FormItem>
    <FormItem :label="`兌換比例: ${transferRate}`">
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
      <Button type="primary" @click="handleSubmit('transferPoint')">申請轉換</Button>
    </FormItem>
  </Form>
  <h4>夢寶積分轉碳鏈申請狀態</h4>
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
        callback(new Error('轉換數量必須大於 0'))
      }
      if (value % this.fromLimit !== 0) {
        callback(new Error(`轉換數量必須是 ${this.fromLimit} 的倍數`))
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
      return this.$store.getters.walletTransferRate[trans]
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
          await this.$store.dispatch('ApplyPointTransfer', {mainGemValue, data})
          this.$Message.success('轉出成功!')
          this.$store.dispatch(`GetPointTransferList`, {mainGemValue})
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
