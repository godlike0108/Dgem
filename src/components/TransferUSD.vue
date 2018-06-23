<template lang="html">
  <div>
    <div class="form">
      <h4>轉出對象</h4>
      <Input class="input-id" v-model="id" :placeholder="`${myId}`" style="width: 300px" clearable></Input>
    </div>
    <CurrUsdWallet></CurrUsdWallet>
    <div class="form">
      <h4>我的夢寶積分</h4>
      <Input class="input-amount" v-model="amount" placeholder="0" style="width: 300px" clearable></Input>
    </div>
    <div class="form">
      <Alert type="error">接下來的行為，將不可回溯!!</Alert>
    </div>
      <Button type="error" @click="transferTo()">轉出</Button>
      <Spin v-if="busy">轉出中...</Spin>
  </div>
</template>

<script>
import CurrUsdWallet from '@/components/CurrUsdWallet.vue'
export default {
  components: {
    CurrUsdWallet,
  },
  data () {
    return {
      id: 0,
      amount: 0,
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
          'user_id': this.id,
          'amount': this.amount,
        }
        await this.$store.dispatch('TransferUSD', { data })
        await this.$store.dispatch(`WalletPage`)
        this.busy = false
      } catch (e) {
        this.busy = false
      }
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
