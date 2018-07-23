<template lang="html">
  <div>
    <Form ref="TranfserUSD" :model="transferUSD" :rules="transferUSDRule" label-position="top" style="max-width: 300px">
        <FormItem>
          <CurrUsdWallet></CurrUsdWallet>
        </FormItem>
        <FormItem label="轉出對象" prop="id">
          <Input class="input-id" v-model="transferUSD.id" :placeholder="`${myId}`" style="width: 300px" clearable></Input>
        </FormItem>
        <FormItem label="轉出數量" prop="amount">
          <Input class="input-amount" v-model="transferUSD.amount" placeholder="0" style="width: 300px" clearable></Input>
        </FormItem>
        <FormItem label="請輸入二級密碼" prop="password">
          <Input type="password" v-model="transferUSD.password"></Input>
        </FormItem>
        <FormItem>
          <Alert type="error">接下來的行為，將不可回溯!!</Alert>
        </FormItem>
        <FormItem>
          <Button type="error" @click="handleSubmit('TranfserUSD')">轉出</Button>
        </FormItem>
        <FormItem>
          <Spin v-if="busy">轉出中...</Spin>
        </FormItem>
    </Form>
  </div>
</template>

<script>
import CurrUsdWallet from '@/components/CurrUsdWallet.vue'
export default {
  components: {
    CurrUsdWallet,
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      }
      callback()
    }
    const validateAmount = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('轉換數量必須大於 0'))
      }
      callback()
    }

    return {
      transferUSD: {
        id: '',
        amount: 0,
        password: '',
      },
      transferUSDRule: {
        id: [
          { required: true, type: 'string', trigger: 'blur', message: '請填寫 ID' },
        ],
        amount: [
          { required: true, validator: validateAmount, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
      busy: false,
    }
  },
  computed: {
    currUSD () {
      if (this.$store.getters.isExist('wallet', 'wallet')) {
        const wallet = this.$store.getters.wallet.filter(wallet => wallet.gem === 4).pop()
        return wallet.amount
      } else {
        return 0
      }
    },
    myId () {
      return this.$store.getters.myId
    },
  },
  methods: {
    async transferTo () {
      try {
        this.busy = true
        const data = {
          'user_id': this.transferUSD.id,
          'amount': this.transferUSD.amount,
          'wallet_password': this.transferUSD.password,
        }
        await this.$store.dispatch('TransferUSD', { data })
        await this.$store.dispatch(`WalletPage`)
        this.busy = false
        return 'success'
      } catch (e) {
        console.log(e)
        this.busy = false
        return 'fail'
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let response = await this.transferTo()
          if (response === 'success') {
            this.$Message.success('轉出成功！')
          } else {
            this.$Message.error('轉出失敗，請確認資料是否確實填寫')
          }
        } else {
          this.$Message.error('轉出失敗，請確認資料是否確實填寫')
        }
        this.handleReset('TransferUSD')
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
  },
}
</script>

<style lang="css" scoped>
.input-id input:invalid {
  outline: red;
}
.input-amount input:invalid {
  outline: red;
}
.ivu-spin.ivu-spin-show-text, .ivu-alert.ivu-alert-error {
  display: inline-block;
}

.form {
  margin: 10px 0;
}
</style>
