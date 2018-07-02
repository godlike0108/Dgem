<template lang="html">
  <div>
    <CurrUsdWallet></CurrUsdWallet>
    <Button type="error" @click="buy()">買一隻全新夢寶龍</Button>
    <Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page>
    <Table stripe :columns="columns1" :data="dragon"></Table>
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
      dragonType: {
        '0': '夢寶龍',
        '1': '小夢寶龍',
      },
      columns1: [
        {
          title: 'ID',
          key: 'id',
          width: 100,
        },
        {
          title: '夢寶龍種類',
          key: 'dragon_type',
          width: 100,
        },
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
          title: '選擇激活對象',
          key: 'operate',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Dropdown', {
                props: {
                  trigger: 'click',
                },
                class: 'defaultStyle',
                on: {
                  'on-click': (value) => {
                    params.row.operate = this.dropdownItems.filter(item => item.id === value).shift()
                  },
                },
              }, [
                h('span', [`${params.row.operate.id} ${params.row.operate.name} `, h('Icon', {
                  props: {
                    type: 'arrow-down-b',
                  },
                  style: {
                    marginRight: '5px',
                  },
                })]),
                h('DropdownMenu', {
                  slot: 'list',
                }, this.dropdownItems.sort((a, b) => a.id - b.id)
                  .map(item => {
                    return h('DropdownItem', {
                      props: {
                        name: item.id,
                        disabled: params.row.activated,
                      },
                    }, `${item.id} ${item.name}`)
                  }),
                ),
              ]),
            ])
          },
        },
        {
          title: '動作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: params.row.activated,
                },
                on: {
                  click: () => {
                    const idDragon = params.row.id
                    this.activate({ data: { 'user_id': params.row.operate.id }, idDragon })
                  },
                },
              }, '激活'),
            ])
          },
        },
      ],
    }
  },
  computed: {
    dragon () {
      if (this.$store.getters.isExist('dragon', 'dragon')) {
        return this.$store.getters.dragon.map((item) => {
          item.owner_name = (item.owner && item.owner.name) || '未指定'
          item.dragon_type = this.dragonType[item.type]
          item.user_name = (item.user && item.user.name) || '未指定'
          item.operate = { id: '', name: '選一個對象' }
          return item
        })
      } else {
        return []
      }
    },
    paging () {
      return this.$store.getters.paging('dragon', 'dragon')
    },
    dropdownItems () {
      return this.$store.getters.allUsers
    },
  },
  methods: {
    async changePage (nextIndex) {
      await this.$store.dispatch('goToDragonPage', { nextIndex })
    },
    async buy () {
      const data = {
        'owner_id': this.$store.getters.myId,
      }
      const nextIndex = this.$store.getters.paging('dragon', 'dragon').curr_page
      await this.$store.dispatch('buyDragon', { data })
      await this.$store.dispatch(`WalletPage`)
      this.$store.dispatch('goToDragonPage', { nextIndex })
    },
    async activate (payload) {
      try {
        const nextIndex = this.$store.getters.paging('dragon', 'dragon').curr_page
        await this.$store.dispatch('activateDragon', payload)
        this.$store.dispatch('goToDragonPage', { nextIndex })
      } catch (e) {
        // not do anything
      }
      this.$store.dispatch('userDownLines', { idUser: this.$store.getters.myId })
      this.$store.dispatch(`allChildAccount`)
      this.$store.dispatch('whoAmI')
    },
  },
}
</script>

<style lang="css">
</style>
