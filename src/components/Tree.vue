<template lang="html">
  <div>
    <CurrUsdWallet></CurrUsdWallet>
    <Button style="margin-right: 10px;" v-for="(type, key) in availTreeType" :key="key" type="error" @click="buy(type)">買一株{{treeName[type]}}</Button>
    <Page :total="paging.total" :page-size="paging.pre_page" simple size="small" @on-change="changePage($event)"></Page>
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
          minWidth: 120,
        },
        {
          title: '夢寶樹的擁有者',
          key: 'owner_name',
          minWidth: 120,
        },
        {
          title: '夢寶樹激活對象',
          key: 'user_name',
          minWidth: 120,
        },
        // {
        //   title: '是否激活',
        //   key: 'activated',
        //   minWidth: 50,
        // },
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
                    const idTree = params.row.id
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
      if (this.$store.getters.isExist('tree', 'tree')) {
        return this.$store.getters.tree.map((item) => {
          item.owner_name = (item.owner && item.owner.name) || '未指定'
          item.user_name = (item.user && item.user.name) || '未指定'
          item.operate = { id: '', name: '選一個對象' }
          item.tree_name = this.treeName[item.type]
          return item
        })
      } else {
        return []
      }
    },
    paging () {
      return this.$store.getters.paging('tree', 'tree')
    },
    dropdownItems () {
      let users = {}
      users[`${this.$store.getters.self.id}`] = this.$store.getters.self
      this.$store.getters.allChildAccount.forEach(item => { users[item.id] = item })
      return Object.values(users).filter(item => item.activated)
    },
  },
  methods: {
    async changePage (nextIndex) {
      await this.$store.dispatch('goToTreePage', { nextIndex })
    },
    async buy (type) {
      const data = {
        'user_id': this.$store.getters.myId,
        'type': type,
      }
      const nextIndex = this.$store.getters.paging('tree', 'tree').curr_page
      await this.$store.dispatch('buyTree', { data })
      await this.$store.dispatch(`setAvailTreeType`)
      await this.$store.dispatch(`WalletPage`)
      this.$store.dispatch('goToTreePage', { nextIndex })
    },
    async activate (payload) {
      const nextIndex = this.$store.getters.paging('tree', 'tree').curr_page
      await this.$store.dispatch('activateTree', payload)
      this.$store.dispatch('goToTreePage', { nextIndex })
    },
  },
}
</script>

<style lang="css">
</style>
