<template lang="html">
  <div class="userProfile">
    <h1>個人資料</h1>
    <Form>
      <FormItem label="修改䁥稱" inline>
        <i-switch v-model="nickName.canModify" @on-change="change()">
          <span slot="open">開</span>
          <span slot="close">關</span>
        </i-switch>
      </FormItem>
      <FormItem>
       <Input v-model="userName" :readonly="!nickName.canModify" :class="mode" placeholder="Enter something..." style="width: 300px"></Input>
       <Button v-show="nickName.canModify" @click="modifyUserName()" type="primary">決定䁥稱</Button>
      </FormItem>
    </Form>
    <Form>
      <FormItem label="修改密碼" inline>
        <i-switch v-model="userPassword.isOpen">
          <span slot="open">開</span>
          <span slot="close">關</span>
        </i-switch>
      </FormItem>
    </Form>
    <Form v-if="userPasswordMode" ref="UpdatePwd" :model="UpdatePwd" :rules="UpdatePwdRule" label-position="top" style="max-width: 300px;">
      <FormItem label="請輸入密碼" prop="password">
        <Input type="password" v-model="UpdatePwd.password"></Input>
      </FormItem>
      <FormItem label="請輸入新密碼" prop="newPassword">
        <Input type="password" v-model="UpdatePwd.newPassword"></Input>
      </FormItem>
      <FormItem label="請再次確認新密碼" prop="newPasswordCheck">
        <Input type="password" v-model="UpdatePwd.newPasswordCheck"></Input>
      </FormItem>
      <FormItem class="sumitArea">
        <Button type="primary" @click="updatePwd()">修改密碼</Button>
      </FormItem>
    </Form>
    <Form>
      <FormItem label="修改二級密碼" inline>
        <i-switch v-model="walletPassword.isOpen">
          <span slot="open">開</span>
          <span slot="close">關</span>
        </i-switch>
      </FormItem>
    </Form>
    <Form v-if="walletPasswordMode" ref="UpdateWalletPwd" :model="UpdateWalletPwd" :rules="UpdateWalletPwdRule" label-position="top" style="max-width: 300px;">
      <FormItem label="請輸入二級密碼" prop="password">
        <Input type="password" v-model="UpdateWalletPwd.password"></Input>
      </FormItem>
      <FormItem label="請輸入新二級密碼" prop="newPassword">
        <Input type="password" v-model="UpdateWalletPwd.newPassword"></Input>
      </FormItem>
      <FormItem label="請再次確認新二級密碼" prop="newPasswordCheck">
        <Input type="password" v-model="UpdateWalletPwd.newPasswordCheck"></Input>
      </FormItem>
      <FormItem class="sumitArea">
        <Button type="primary" @click="updateWalletPwd()">修改二級密碼</Button>
      </FormItem>
    </Form>

    <Form>
      <FormItem label="設定錢包位址" inline>
        <i-switch v-model="setWalletAddress.isOpen">
          <span slot="open">開</span>
          <span slot="close">關</span>
        </i-switch>
      </FormItem>
    </Form>
    <template v-if="walletAddressMode">
    <Form v-for="(wallet, key) in wallet" :key="key" :ref="`UpdateGem${wallet.id}Addr`" :model="addrGroup[wallet.id]" :rules="addrRuleGroup[wallet.id]" style="max-width: 500px;" :label-width="80">
      <FormItem :label="`${wallet.name}`" prop="address">
        <Row>
          <Col span="20">
            <Input type="text" v-model="addrGroup[wallet.id].address" :placeholder="`請輸入${wallet.name}錢包位址`"></Input>
          </Col>
          <Col span="1">&nbsp;</Col>
          <Col span="3">
            <Button type="primary" @click="updateWalletAddr(wallet.id)">儲存</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
    </template>

    <h2>夢寶龍 × {{ this.$store.getters.paging('dragon', 'activeDragon').total }}</h2>
    <Page :total="pagingDragon.total" :page-size="pagingDragon.pre_page" simple size="small" @on-change="changeDragonPage($event)"></Page>
    <Table :columns="columnsDragon" :data="dragon"></Table>
  </div>
</template>

<script>
export default {
  created () {
    this.setWalletAddr()
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      } else {
        if (this.UpdatePwd.newPasswordCheck !== '') {
          this.$refs.UpdatePwd.validateField('newPasswordCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請再次確認新二級密碼'))
      } else if (value !== this.UpdatePwd.newPassword) {
        callback(new Error('兩邊不一樣，請再確認'))
      } else {
        callback()
      }
    }
    const validateWalletPass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      } else {
        if (this.UpdateWalletPwd.newPasswordCheck !== '') {
          this.$refs.UpdateWalletPwd.validateField('newPasswordCheck')
        }
        callback()
      }
    }
    const validateWalletPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請再次確認新二級密碼'))
      } else if (value !== this.UpdateWalletPwd.newPassword) {
        callback(new Error('兩邊不一樣，請再確認'))
      } else {
        callback()
      }
    }
    return {
      UpdatePwd: {
        password: '',
        newPassword: '',
        newPasswordCheck: '',
      },
      UpdatePwdRule: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        newPasswordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' },
        ],
      },
      UpdateWalletPwd: {
        password: '',
        newPassword: '',
        newPasswordCheck: '',
      },
      UpdateWalletPwdRule: {
        password: [
          { required: true, validator: validateWalletPass, trigger: 'blur' },
        ],
        newPassword: [
          { required: true, validator: validateWalletPass, trigger: 'blur' },
        ],
        newPasswordCheck: [
          { required: true, validator: validateWalletPassCheck, trigger: 'blur' },
        ],
      },
      wallet: [
        {id: 5, name: '碳鏈'},
        {id: 6, name: '財神鏈'},
        {id: 7, name: '卡片號碼'},
        {id: 8, name: '圓夢積分'},
      ],
      addrGroup: {
        '5': {
          address: '',
        },
        '6': {
          address: '',
        },
        '7': {
          address: '',
        },
        '8': {
          address: '',
        },
      },
      addrRuleGroup: {
        '5': {
          address: [
            { required: true, trigger: 'blur', message: '請輸入錢包地址' },
          ],
        },
        '6': {
          address: [
            { required: true, trigger: 'blur', message: '請輸入錢包地址' },
          ],
        },
        '7': {
          address: [
            { required: true, trigger: 'blur', message: '請輸入錢包地址' },
          ],
        },
        '8': {
          address: [
            { required: true, trigger: 'blur', message: '請輸入錢包地址' },
          ],
        },
      },
      nickName: {
        canModify: false,
      },
      userPassword: {
        isOpen: false,
      },
      walletPassword: {
        isOpen: false,
      },
      setWalletAddress: {
        isOpen: false,
      },
      columnsDragon: [
        {
          title: '夢寶龍的擁有者',
          key: 'owner_name',
          minWidth: 150,
        },
        {
          title: '夢寶龍激活對象',
          key: 'user_name',
          minWidth: 150,
        },
        {
          title: '是否激活',
          key: 'isActivat',
          minWidth: 100,
        },
      ],
    }
  },
  computed: {
    dragon () {
      if (this.$store.getters.isExist('dragon', 'activeDragon')) {
        return this.$store.getters.activeDragon.map((item) => {
          item.owner_name = (item.owner && item.owner.name) || '未指定'
          item.user_name = (item.user && item.user.name) || '未指定'
          item.isActivat = item.activated ? '是' : '否'
          return item
        })
      } else {
        return []
      }
    },
    pagingDragon () {
      return this.$store.getters.paging('dragon', 'activeDragon')
    },
    mode () {
      return {
        readOnly: !this.nickName.canModify,
      }
    },
    userPasswordMode () {
      return this.userPassword.isOpen
    },
    walletPasswordMode () {
      return this.walletPassword.isOpen
    },
    walletAddressMode () {
      return this.setWalletAddress.isOpen
    },
    userName: {
      get: function () {
        return this.$store.getters.myName
      },
      set: function (newId) {
        this.$store.commit('myName', newId)
      },
    },
  },
  methods: {
    setWalletAddr () {
      for (let wallet in this.addrGroup) {
        this.addrGroup[wallet].address = this.$store.getters.wallet[wallet].external_address
      }
    },
    async changeDragonPage (nextIndex) {
      await this.$store.dispatch('goToActiveDragonPage', { nextIndex })
    },
    async change () {
      if (!this.nickName.canModify) {
        await this.$store.dispatch('whoAmI')
      }
    },
    async modifyUserName () {
      try {
        await this.$store.dispatch('modifyMyName')
        this.$store.dispatch('goToActiveDragonPage', { nextIndex: 1 })
      } catch (e) {
        this.$Message.error(e.response.data.message)
      }
      this.nickName.canModify = false
      this.$Message.success('暱稱修改成功')
    },
    updatePwd () {
      this.$refs['UpdatePwd'].validate(async (valid) => {
        if (valid) {
          const data = {
            password: this.UpdatePwd.password,
            new_password: this.UpdatePwd.newPassword,
          }
          try {
            await this.$store.dispatch('UpdateUserPwd', {data})
          } catch (e) {
            this.$Message.error(e.response.data.message)
            return
          }
          this.$Message.success('密碼修改成功')
          this.reset('UpdatePwd')
          this.userPassword.isOpen = false
        } else {
          this.$Message.error('修改密碼失敗')
        }
      })
    },
    updateWalletPwd () {
      this.$refs['UpdateWalletPwd'].validate(async (valid) => {
        if (valid) {
          const data = {
            wallet_password: this.UpdateWalletPwd.password,
            new_wallet_password: this.UpdateWalletPwd.newPassword,
          }
          try {
            await this.$store.dispatch('UpdateWalletPwd', {data})
          } catch (e) {
            this.$Message.error(e.response.data.message)
            return
          }
          this.reset('UpdateWalletPwd')
          this.$Message.success('密碼修改成功')
          this.walletPassword.isOpen = false
        } else {
          this.$Message.error('修改二級密碼失敗')
        }
      })
    },
    updateWalletAddr (walletIndex) {
      this.$refs[`UpdateGem${walletIndex}Addr`][0].validate(async (valid) => {
        if (valid) {
          const data = {
            external_address: this.addrGroup[walletIndex].address,
          }
          try {
            await this.$store.dispatch('UpdateWalletAddr', {walletIndex, data})
          } catch (e) {
            this.$Message.error(e.response.data.message)
            return
          }
          this.$Message.success('設定錢包位址成功')
        } else {
          this.$Message.error('設定錢包位址失敗')
        }
      })
    },
    reset (ref) {
      this.$refs[ref].resetFields()
    },
  },
}
</script>

<style lang="css">
</style>
