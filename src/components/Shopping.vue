<template>
<div>
  <h4>我的多喜寶石</h4>
  <p><span class="wallet-value">{{currentGem}}</span>點</p>

  <Tabs value="name1">
    <TabPane label="寶石商品" icon="waterdrop"><span class="temp">Coming Soon...</span></TabPane>
    <TabPane label="3C商品" icon="iphone"><span class="temp">Coming Soon...</span></TabPane>
    <TabPane label="地產商品" icon="home"><span class="temp">Coming Soon...</span></TabPane>
  </Tabs>
</div>
</template>

<script>
export default {

  name: 'Shopping',

  data () {
    return {
    }
  },
  computed: {
    currentGem () {
      return this.$store.getters.wallet.find(wallet => wallet.gem === 1).amount
    },
  },
}
</script>

<style lang="css">
.wallet-value {
  font-size: 2em;
}
.temp {
  font-size: 2em;
}
</style>
