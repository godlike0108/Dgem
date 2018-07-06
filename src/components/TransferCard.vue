<template>
<div>
  <h4>我的七彩寶石</h4>
  <p><span class="wallet-value">{{currentGem}}</span>點</p>
  <Form ref="transferCard" :model="transferCard" :rules="transferCardRule" label-position="top" style="max-width:300px">
    <FormItem label="錢包位置" prop="walletAddress">
      <Input type="text" readonly v-model="walletAddress"></Input>
    </FormItem>
    <FormItem :label="`兌換比例: ${transferRate}`">
      <Row>
        <Col span="11">
          <FormItem prop="fromValue">
            <InputNumber :min="0" v-model="fromValue"></InputNumber>
            <span>七彩寶石</span>
          </FormItem>
        </Col>
        <Col span="2">-></Col>
        <Col span="11">
          <FormItem prop="toValue">
            <InputNumber :min="0" v-model="toValue"></InputNumber>
            <span>卡片</span>
          </FormItem>
        </Col>
      </Row>
    </FormItem>
    <FormItem label="請輸入二級密碼" prop="password">
      <Input type="password" v-model="transferCard.password"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('transferCard')">申請轉換</Button>
    </FormItem>
  </Form>
  <h4>寶石轉換申請狀態</h4>
<!--   <Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page> -->
   <Table :columns="transferApplyCols" :data="transferCardList"></Table>
</div>
</template>

<script>
export default {

  name: 'ApplyCard',

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
      transferCard: {
        fromValue: 0,
        toValue: 0,
        password: '',
      },
      transferCardRule: {
        fromValue: [
          { required: true, type: 'number', validator: validateFromValue, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
      transferApplyCols: [
        {
          title: '申請編號',
          key: 'id',
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
      statusLookUp: {
        '0': '審核中',
      },
    }
  },
  computed: {
    // current gem
    currentGem () {
      return this.$store.getters.wallet.find(wallet => wallet.gem === 0).amount
    },
    walletAddress () {
      return this.$store.getters.wallet['7'].external_address
    },
    transferRate () {
      return '1:1'
    },
    fromValue: {
      get () {
        return this.transferCard.fromValue
      },
      set (value) {
        this.transferCard.fromValue = Number(value)
        this.transferCard.toValue = Number((value * this.toFromRatio).toFixed(1))
      },
    },
    toValue: {
      get () {
        return this.transferCard.toValue
      },
      set (value) {
        this.transferCard.toValue = Number(value)
        this.transferCard.fromValue = Number((value / this.toFromRatio).toFixed(1))
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
    transferCardList () {
      let list = this.$store.getters.walletTransferList.data
      list.map(data => {
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
          const data = {
            to_gem: 5,
            amount: this.transferCard.fromValue,
            wallet_password: this.transferCard.password,
          }
          const mainGemValue = 0
          await this.$store.dispatch('ApplyWalletTransfer', {mainGemValue, data})
          this.$Message.success('轉出成功!')
          this.$store.dispatch(`GetWalletTransferList`, 0)
        } else {
          this.$Message.error('請確實填寫資料!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    async changePage (nextIndex) {
      let mainGemValue = 0
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
