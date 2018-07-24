<template lang="html">
  <div>
    <CurrUsdWallet></CurrUsdWallet>
    <Button type="error" @click="buy()">買一隻夢寶龍</Button>
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
          title: '夢寶龍種類',
          key: 'dragon_type',
          width: 120,
        },
        {
          title: '夢寶龍價格',
          key: 'price',
          width: 120,
        },
        {
          title: '夢寶龍持有數量',
          key: 'amount',
          width: 120,
        },
        {
          title: '選擇激活對象',
          key: 'operate',
          width: 200,
          render: (h, params) => {
            if (this.dropdownItems.length === 0) {
              return h('div', '已無可激活對象')
            } else {
              return h('div', [
                h('Dropdown', {
                  props: {
                    trigger: 'click',
                  },
                  class: 'defaultStyle',
                  on: {
                    'on-click': (value) => {
                      console.log(params.index)
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
                  }, this.dropdownItems
                    .map(item => {
                      return h('DropdownItem', {
                        props: {
                          name: item.id,
                        },
                      }, `${item.id} ${item.name}`)
                    }),
                  ),
                ]),
              ])
            }
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
                  disabled: !params.row.operate.id || !params.row.amount,
                },
                on: {
                  click: () => {
                    const idDragon = params.row.next_available_dragon.id
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
      return this.$store.getters.dragon.map((item) => {
        item.dragon_type = this.dragonType[item.type]
        item.price = this.dragonPrice[item.type]
        item.operate = { id: '', name: '選一個對象' }
        return item
      })
    },
    dragonPrice () {
      return this.$store.getters.dragonPrice
    },
    dropdownItems () {
      return this.$store.getters.allDragonCandidate
    },
  },
  methods: {
    async buy () {
      const data = {
        'owner_id': this.$store.getters.myId,
      }
      try {
        await this.$store.dispatch('buyDragon', { data })
        await this.$store.dispatch(`WalletPage`)
        this.$store.dispatch('ListDragonSummary')
        this.$Message.success('購買成功！')
      } catch (e) {
        this.$Message.error(e.response.data.message)
      }
    },
    async activate (payload) {
      try {
        await this.$store.dispatch('activateDragon', payload)
        this.$store.dispatch('ListDragonSummary')
        this.$store.dispatch('setDragonCandidate')
        this.$store.dispatch(`allChildAccount`)
        this.$store.dispatch('whoAmI')
        this.$Message.success('激活成功！')
      } catch (e) {
        this.$Message.error(e.response.data.message)
      }
    },
  },
}
</script>

<style lang="css">
</style>
