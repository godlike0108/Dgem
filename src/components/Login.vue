<template lang="html">
  <div class="loginIn">
    <QRcodeLogin></QRcodeLogin>
    <div class="green-panel">
      <h1 class="logo"><img src="/static/images/dg_logo.png"></h1>
      <div>
      <i-switch v-model="switchAreaType"></i-switch> <span>切換到 {{ areaType[switchAreaType] }}</span>
      </div>
      <div v-show="!!switchAreaType" class="SignIn">
        <div style="text-align: right;">
          <router-link style="color: #FFF;" :to="{path: `/ForgetPW`}">忘記密碼？</router-link>
        </div>
        <Form ref="SignIn" :model="SignIn" :rules="SignInRule" label-position="top">
          <FormItem label="請填入註冊信箱" prop="username">
            <Input type="text" v-model="SignIn.username"></Input>
          </FormItem>
          <FormItem label="請填入密碼" prop="password">
            <Input type="password" v-model="SignIn.password"></Input>
          </FormItem>
          <div class="submit">
            <Button class="yellow-panel dg-btn login" @click="signIn()" type="primary">登入</Button>
          </div>
        </Form>
      </div>
      <div v-show="!switchAreaType" class="SignUp">
        <Form ref="SignUp" :model="SignUp" :rules="SignUpRule" label-position="top">
          <FormItem label="請填入使用者䁥稱" prop="name">
            <Input type="text" v-model="SignUp.name"></Input>
          </FormItem>
          <FormItem label="請填入 E-mail" prop="email">
            <Input type="email" v-model="SignUp.email"></Input>
          </FormItem>
          <FormItem label="請填入密碼" prop="password">
            <Input type="password" v-model="SignUp.password"></Input>
          </FormItem>
          <FormItem label="請再次填入密碼" prop="passwordCheck">
            <Input type="password" v-model="SignUp.passwordCheck"></Input>
          </FormItem>
          <FormItem label="請填入二級密碼" prop="walletPassword">
            <Input type="password" v-model="SignUp.walletPassword"></Input>
          </FormItem>
          <FormItem label="請再次填入二級密碼" prop="walletPasswordCheck">
            <Input type="password" v-model="SignUp.walletPasswordCheck"></Input>
          </FormItem>
          <FormItem label="請填入上線 ID" prop="upline_id">
            <Input v-model="SignUp.upline_id"></Input>
          </FormItem>
          <div class="submit">
            <Button class="yellow-panel dg-btn" type="primary" @click="signUp()">確認</Button>
            <Button class="yellow-panel dg-btn" type="ghost" @click="reset()">取消</Button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import QRcodeLogin from '@/components/QRcodeLogin.vue'
export default {
  components: {
    QRcodeLogin,
  },
  created () {
    if (this.$route.query.hasOwnProperty('upline_id')) {
      this.switchAreaType = false
      this.SignUp.upline_id = this.$route.query.upline_id
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      } else {
        if (this.SignUp.passwordCheck !== '') {
          this.$refs.SignUp.validateField('passwordCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再填入一樣的密碼'))
      } else if (value !== this.SignUp.password) {
        callback(new Error('兩邊不一樣，請再確認'))
      } else {
        callback()
      }
    }
    const validateWalletPass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      } else {
        if (this.SignUp.passwordCheck !== '') {
          this.$refs.SignUp.validateField('walletPasswordCheck')
        }
        callback()
      }
    }
    const validateWalletPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('再填入一樣的密碼'))
      } else if (value !== this.SignUp.walletPassword) {
        callback(new Error('兩邊不一樣，請再確認'))
      } else {
        callback()
      }
    }
    const validateUplineId = (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('填入上線的 ID 號碼'))
      } else {
        callback()
      }
    }

    return {
      areaType: {
        true: '註冊新帳號',
        false: '帳號密碼登入',
      },
      switchAreaType: true,
      SignIn: {
        username: '',
        password: '',
      },
      SignInRule: {
        username: [
          { required: true, message: '填入要登入的使用者䁥稱', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '填入要登入的使用者䁥稱相對應的密碼', trigger: 'blur' },
          { type: 'string', min: 6, message: '長度要有 6 個字元', trigger: 'blur' },
        ],
      },
      SignUp: {
        name: '',
        email: '',
        password: '',
        passwordCheck: '',
        walletPassword: '',
        walletPasswordCheck: '',
        upline_id: 0,
      },
      SignUpRule: {
        name: [
          { required: true, message: '填入要註冊的使用者帳號', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '填入要註冊的 E-mail', trigger: 'blur' },
          { type: 'email', message: '請檢查 E-mail 格式，是否有誤', trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' },
        ],
        walletPassword: [
          { required: true, validator: validateWalletPass, trigger: 'blur' },
        ],
        walletPasswordCheck: [
          { required: true, validator: validateWalletPassCheck, trigger: 'blur' },
        ],
        upline_id: [
          { required: true, type: 'number', validator: validateUplineId, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    signIn () {
      this.$refs['SignIn'].validate(async (valid) => {
        if (valid) {
          try {
            await this.$store.dispatch('Login', {
              password: this.SignIn.password,
              name: this.SignIn.username,
            })
            this.$router.push('/Main')
          } catch (e) {
            this.$Message.error('帳號密碼不匹配')
          }
        } else {
          this.$Message.error('帳號密碼格式出錯')
        }
      })
    },
    signUp () {
      this.$refs['SignUp'].validate(async (valid) => {
        if (valid) {
          const data = {
            email: this.SignUp.email,
            name: this.SignUp.name,
            password: this.SignUp.password,
            wallet_password: this.SignUp.walletPassword,
            upline_id: this.SignUp.upline_id,
          }
          await this.$store.dispatch('CreateUser', data)
          this.switchAreaType = true
        } else {
          this.$Message.error('註冊失敗')
        }
      })
    },
    reset () {
      this.$refs['SignUp'].resetFields()
    },
  },
}
</script>

<style lang="css" scoped>
.logo {
  text-align: center;
}

.logo > img {
  width: 60%;
  padding: 10px;
}

.loginIn {
  position: relative;
  max-width: 450px;
  min-height: 1050px;
  margin: auto;
  padding: 40px 10px;
}

.submit {
  position: absolute;
  right: 5%;
}

.dg-btn {
  color: #fff;
  padding: 5px 20px;
  font-size: 1.6em;
  position: relative;
}

.dg-btn.login::after {
  content: "";
  background: 0 0/30px 30px no-repeat url('/static/images/login-arrow.png');
  width: 30px;
  height: 30px;
  display: inline-block;
  position: absolute;
  right: -15px;
}

</style>
