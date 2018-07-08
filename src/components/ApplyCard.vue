<template>
<div>
  <Form ref="ApplyCard" :model="applyCard" :rules="applyCardRule" label-position="top" style="max-width: 300px">
    <FormItem>
      <h4>申請卡片</h4>
    </FormItem>
    <FormItem label="收件人姓名" prop="name">
      <Input v-model="applyCard.name" placeholder="請輸入收件人姓名" style="width: 300px" clearable></Input>
    </FormItem>
    <FormItem label="收件人地址" prop="address">
      <Input v-model="applyCard.address" placeholder="請輸入聯絡地址" style="width: 300px" clearable></Input>
    </FormItem>
    <FormItem label="收件人電話" prop="phone">
      <Input type="text" v-model="applyCard.phone" placeholder="請輸入聯絡電話"></Input>
    </FormItem>
    <FormItem>
      <Button type="error" @click="handleSubmit('ApplyCard')">提交申請單</Button>
    </FormItem>
  </Form>

  <h4>申請狀態</h4>
  <Page :current="paging.curr_page" :total="paging.total" simple @on-change="changePage($event)"></Page>
  <Table stripe :columns="applyListCol" :data="applyList"></Table>
</div>
</template>

<script>
export default {

  name: 'ApplyCard',

  data () {
    return {
      statusLookUp: {
        '0': '審核中',
      },
      applyCard: {
        name: '',
        address: '',
        phone: '',
      },
      applyCardRule: {
        name: [
          { required: true, message: '請填入收件人姓名', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '請填入聯絡地址', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '請填入電話號碼', trigger: 'blur' },
        ],
      },
      applyListCol: [
        {
          title: '申請編號',
          key: 'id',
          width: 120,
        },
        {
          title: '收件人姓名',
          key: 'nickname',
          width: 120,
        },
        {
          title: '收件人地址',
          key: 'address',
          width: 240,
        },
        {
          title: '收件人電話',
          key: 'phone',
          width: 160,
        },
        {
          title: '目前狀態',
          key: 'status',
          width: 100,
        },
        {
          title: '建立時間',
          key: 'updated_at',
          width: 120,
        },
      ],
    }
  },
  computed: {
    applyList () {
      let list = this.$store.getters.applyList
      return list.map(item => {
        item.status = this.statusLookUp[item.status]
        return item
      })
    },
    paging () {
      return this.$store.getters.paging('wallet', 'applyList')
    },
  },
  methods: {
    applyUserCard () {
      const data = {
        address: this.applyCard.address,
        nickname: this.applyCard.name,
        phone: this.applyCard.phone,
      }
      try {
        this.$store.dispatch('ApplyCard', data)
      } catch (e) {
        console.log(e)
        return 'fail'
      }
      return 'success'
    },
    handleSubmit (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          let response = await this.applyUserCard()
          if (response !== 'success') {
            this.$Message.error('申請失敗')
            return
          }
          this.$Message.success('申請成功!')
          this.handleReset('ApplyCard')
          this.$store.dispatch('GetCardApplyList')
        } else {
          this.$Message.error('請確實填寫資料!')
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
</style>
