<template>
<div class="forgetPW">
  <Form ref="getPW" :model="getPW" :rules="getPWRule">
    <FormItem>
      <h4>忘記密碼</h4>
    </FormItem>
    <FormItem label="Email" prop="email">
      <Input type="text" v-model="getPW.email"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('getPW')">取得新密碼</Button>
    </FormItem>
  </Form>
</div>
</template>

<script>
export default {

  name: 'ForgetPW',

  data () {
    return {
      getPW: {
        email: '',
      },
      getPWRule: {
        email: [
          { required: true, trigger: 'blur', message: '請輸入註冊信箱' },
        ],
      },
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let data = this.getPW.email
          let response = await this.$store.dispatch('ResetPassword', {data})
          if (response === 'success') {
            this.$Message.success('已發送新密碼至您的信箱，請前往確認')
            this.handleReset('getPW')
          } else {
            this.$Message.error('發送密碼失敗，請稍後再試')
          }
        } else {
          this.$Message.error('發送密碼失敗，請確認資料填寫是否完整')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
  },
}
</script>

<style lang="css">
.forgetPW {
  position: relative;
  max-width: 450px;
  min-height: 1050px;
  margin: auto;
  padding: 0 10px;
}
</style>
