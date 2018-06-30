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
        <Button type="primary" @click="updateWalletPwd()">修改密碼</Button>
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
            <Button type="primary" @click="updateWalletPwd()">儲存</Button>
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
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.length < 6) {
        callback(new Error('填入密碼，符合長度 6 個字元以上'))
      } else {
        if (this.UpdateWalletPwd.newPasswordCheck !== '') {
          this.$refs.UpdateWalletPwd.validateField('newPasswordCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請再次確認新二級密碼'))
      } else if (value !== this.UpdateWalletPwd.newPassword) {
        callback(new Error('兩邊不一樣，請再確認'))
      } else {
        callback()
      }
    }
    return {
      UpdateWalletPwd: {
        password: '',
        newPassword: '',
        newPasswordCheck: '',
      },
      UpdateWalletPwdRule: {
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
      wallet: [
        {id: 5, name: '碳幣'},
        {id: 6, name: '財神幣'},
        {id: 7, name: '美金'},
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
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
        },
        '6': {

        },
        '7': {

        },
        '8': {

        },
      },
      nickName: {
        canModify: false,
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
    async changeDragonPage (nextIndex) {
      await this.$store.dispatch('goToActiveDragonPage', { nextIndex })
    },
    async change () {
      if (!this.nickName.canModify) {
        await this.$store.dispatch('whoAmI')
      }
    },
    async modifyUserName () {
      await this.$store.dispatch('modifyMyName')
      this.$store.dispatch('goToActiveDragonPage', { nextIndex: 1 })
      this.canModify = false
    },
    updateWalletPwd () {
      this.$refs['UpdateWalletPwd'].validate(async (valid) => {
        if (valid) {
          const data = {
            wallet_password: this.UpdateWalletPwd.password,
            new_wallet_password: this.UpdateWalletPwd.newPassword,
          }
          let response = await this.$store.dispatch('UpdateWalletPwd', {data})
          if (response === 'success') {
            this.$Message.success('密碼修改成功')
            this.reset()
            this.walletPassword.isOpen = false
          } else {
            this.$Message.error('密碼錯誤')
          }
        } else {
          this.$Message.error('修改二級密碼失敗')
        }
      })
    },
    reset () {
      this.$refs['UpdateWalletPwd'].resetFields()
    },
  },
}
</script>

<style lang="css">
</style>
