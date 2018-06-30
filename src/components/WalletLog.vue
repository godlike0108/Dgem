<template lang="html">
  <div>
    <Select class="select-point-type" :class="selectIcon" v-model="currOperatableId" style="width:200px" placeholder="請選擇物品 Id" @on-change="changeType()">
        <Option :class="`gem${item.id-1}`" v-for="item in ids" :value="item.id" :key="item.id">
          {{ item.title }}
        </Option>
    </Select>
    <Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page>
    <Table stripe :columns="columns1" :data="walletLog"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedGem: 4,
      actionType: [
        '初始化（建立）',
        '修改',
        '激活',
        '召回（錢包）',
        '轉賬（美金）',
      ],
      // subType: [
      //   '推薦獎勵',
      //   '激活龍獎勵',
      //   '激活樹獎勵',
      //   '結算獎勵',
      // ],
      columns1: [
        {
          title: '時間',
          key: 'created_at',
          minWidth: 150,
        },
        {
          title: '操作者䁥稱',
          key: 'operator_name',
          minWidth: 100,
        },
        {
          title: '操作行為',
          key: 'action',
          width: 120,
        },
        {
          title: '物品',
          key: 'item',
          width: 100,
        },
        {
          title: '餘額',
          key: 'amount',
          align: 'right',
          width: 150,
        },
        {
          title: '金額',
          key: 'delta_amount',
          align: 'right',
          width: 150,
        },
        {
          title: '接受人䁥稱',
          key: 'user_name',
          minWidth: 100,
        },
        // {
        //   title: '操作備註',
        //   key: 'sub_type_string',
        //   width: 200,
        // },
      ],
    }
  },
  computed: {
    // select icon change
    selectIcon () {
      return `gem${this.selectedGem}`
    },
    // change to wallet log
    walletLog () {
      return this.$store.getters.walletLog.data.map(item => {
        item.action = item.sub_type_string || this.actionType[item.type]
        item.item = `${this.$store.getters.gems[item.result_data.gem]}`
        item.amount = item.result_data.amount
        item.delta_amount = (item.delta !== null) ? `${item.delta.amount}` : '0'
        item.operator_name = item.operator ? item.operator.name : ''
        item.user_name = item.user ? item.user.name : ''
        return item
      })
    },
    paging () {
      return this.$store.getters.paging('wallet', 'walletLog')
    },
    ids () {
      let newIds = this.$store.getters.wallet.map(item => {
        item.title = `${this.$store.getters.gems[item.gem]}`
        return item
      })
      newIds.splice(this.$store.getters.gems.length)
      return newIds
    },
    currOperatableId: {
      get () {
        return this.$store.getters.wallet.filter((item) => {
          return item.gem === this.selectedGem
        }).shift().id
      },
      set (id) {
        this.selectedGem = this.$store.getters.wallet.filter((item) => {
          return item.id === id
        }).shift().gem
      },
    },
  },
  methods: {
    async changePage (nextIndex) {
      const searchParams = new URLSearchParams()
      searchParams.append('operatable_type', `1`)
      if (this.currOperatableId) {
        searchParams.append('operatable_id', this.currOperatableId)
      }
      await this.$store.dispatch('WalletLog', { nextIndex, searchParams })
    },
    async changeType () {
      const searchParams = new URLSearchParams()
      searchParams.append('operatable_type', `1`)
      if (this.currOperatableId) {
        searchParams.append('operatable_id', this.currOperatableId)
      }
      const nextIndex = '1'// this.$store.getters.paging('user', 'eventsLog').curr_page
      await this.$store.dispatch('WalletLog', { nextIndex, searchParams })
    },
  },
}
</script>

<style lang="css">

</style>
