<template lang="html">
  <div>
    <h1>自己</h1>
    <Table stripe :columns="columnsUser" :data="self"></Table>
    <h1>家族</h1>
    <Table stripe :columns="columnsUser" :data="downlines"></Table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columnsUser: [
        {
          title: 'ID',
          key: 'id',
          width: 100,
        },
        {
          title: 'name',
          key: 'name',
          minWidth: 150,
        },
        {
          title: '總產出數',
          key: 'total_capacity',
          minWidth: 85,
        },
        {
          title: '未產出',
          key: 'total_remain',
          minWidth: 75,
        },
        {
          title: '已產出',
          key: 'total_processed',
          minWidth: 75,
        },
        {
          title: '家族帳號數量',
          key: 'total_user_count',
          minWidth: 110,
        },
        {
          title: '是否子帳號',
          key: 'isChild',
          minWidth: 100,
        },
        {
          title: '是否激活',
          key: 'isActivat',
          minWidth: 85,
        },
      ],
    }
  },
  computed: {
    self () {
      return [this.$store.getters.self].map(item => {
        item.total_processed = item.total_capacity - item.total_remain
        item.isActivat = item.activated ? '是' : '否'
        item.isChild = item.is_child_account ? '是' : '否'
        return item
      })
    },
    downlines () {
      return this.$store.getters.downlines.map(item => {
        item.total_processed = item.total_capacity - item.total_remain
        item.isActivat = item.activated ? '是' : '否'
        item.isChild = item.is_child_account ? '是' : '否'
        return item
      })
    },
  },
}
</script>

<style lang="css" scoped>
h1 {
  margin-top: 20px;
}
</style>
