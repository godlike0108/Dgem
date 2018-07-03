<template lang="html">
  <div>
    <CurrUsdWallet></CurrUsdWallet>
    <Button style="margin-right: 10px;" v-for="(type, key) in availTreeType" :key="key" type="error" @click="buy(type)">買一株{{treeName[type]}}</Button>
    <Table stripe :columns="columns1" :data="tree"></Table>
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
      treeName: {
        '0': '小夢寶樹',
        '1': '夢寶樹',
        '2': '大夢寶樹',
      },
      columns1: [
        {
          title: '夢寶樹種類',
          key: 'tree_name',
          width: 200,
        },
        {
          title: '夢寶樹數量',
          key: 'amount',
          width: 100,
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
                  disabled: true,
                },
                class: 'defaultStyle',
                on: {
                  'on-click': (value) => {
                    params.row.operate = this.dropdownItems.filter(item => item.id === value).shift()
                  },
                },
              }, [
                h('span', [`${params.row.operate.id} ${params.row.operate.name} `,
                  h('Icon', {
                    props: { type: 'arrow-down-b' },
                    style: { marginRight: '5px' },
                  }),
                ]),
                h('DropdownMenu', {
                  slot: 'list',
                }, this.dropdownItems
                  .sort((a, b) => a.id - b.id)
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
                    const idTree = params.row.next_available_tree.id
                    this.activate({ data: { 'user_id': params.row.operate.id }, idTree })
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
    availTreeType () {
      return this.$store.getters.availTreeType
    },
    tree () {
      return this.$store.getters.tree.map((item) => {
        item.tree_name = this.treeName[item.type]
        item.operate = { id: '', name: '選一個對象' }
        return item
      })
    },
    dropdownItems () {
      let users = {}
      users[`${this.$store.getters.self.id}`] = this.$store.getters.self
      this.$store.getters.allChildAccount.forEach(item => { users[item.id] = item })
      return Object.values(users).filter(item => item.activated)
    },
  },
  methods: {
    async buy (type) {
      const data = {
        'user_id': this.$store.getters.myId,
        'type': type,
      }
      await this.$store.dispatch('buyTree', { data })
      await this.$store.dispatch(`setAvailTreeType`)
      await this.$store.dispatch(`WalletPage`)
      this.$store.dispatch('ListTreeSummary')
    },
    async activate (payload) {
      await this.$store.dispatch('activateTree', payload)
      this.$store.dispatch('ListTreeSummary')
    },
  },
}
</script>

<style lang="css">
</style>
