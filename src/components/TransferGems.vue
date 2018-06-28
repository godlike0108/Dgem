<template>
<div>
<h4>我的{{walletName}}</h4>
<span class="wallet-value">{{walletValue | valueUnit}}</span>
<Form ref="transferGems" :model="transferGems" :rules="transferRule" label-position="top" style="max-width:300px">
  <FormItem label="轉換種類">
    <Select v-model="selectedGem" style="width:200px" placeholder="請選擇轉換種類">
        <Option v-for="gem in gemList" :value="gem.value" :key="gem.value">{{ gem.name }}</Option>
    </Select>
  </FormItem>
  <FormItem :label="`兌換比例: ${transferRate}`">
    <Row>
      <Col span="11">
        <FormItem prop="fromValue">
          <InputNumber :min="0" v-model="fromValue"></InputNumber>
          <span>{{walletName}}</span>
        </FormItem>
      </Col>
      <Col span="2">-></Col>
      <Col span="11">
        <FormItem prop="toValue">
          <InputNumber :min="0" v-model="toValue"></InputNumber>
          <span>{{listLookUp[selectedGem]}}</span>
        </FormItem>
      </Col>
    </Row>
  </FormItem>
  <FormItem>
    <Button type="primary" @click="handleSubmit('transferGems')">Submit</Button>
    <Button type="ghost" @click="handleReset('transferGems')" style="margin-left: 8px">Reset</Button>
  </FormItem>
</Form>
</div>
</template>

<script>
export default {

  name: 'TransferGems',
  mounted () {
    this.selectedGem = this.gemList[0].value
    // for first in page
    this.mainGemValue = this.$route.params.gem
    this.walletName = this.listLookUp[this.pageGem]
  },
  watch: {
    '$route' (to, from) {
      if (!this.$route.params.hasOwnProperty('gem')) {
        return
      }
      // react to route changes...
      this.mainGemValue = this.$route.params.gem
      this.walletName = this.listLookUp[this.pageGem]
    },
  },
  data () {
    return {
      mainGemValue: 0,
      walletName: '',
      walletValue: 100,
      selectedGem: 0,
      listLookUp: {
        '0': '七彩寶石',
        '1': '多喜寶石',
        '2': '多福寶石',
        '3': '多財寶石',
        '4': '夢寶積分',
        '5': '碳幣',
        '6': '財神幣',
        '7': '美金',
        '8': '圓夢積分',
      },
      transferGems: {
        fromValue: 0,
        toValue: 0,
      },
      transferRule: {

      },
    }
  },
  filters: {
    valueUnit (value) {
      return `${value} 點`
    },
  },
  computed: {
    // get current wallet index
    pageGem () {
      return this.mainGemValue
    },
    // get map list from wallet transfer map
    gemList () {
      return this.$store.getters.walletTransferMap[this.mainGemValue].map(gem => {
        return {
          name: this.listLookUp[gem],
          value: gem,
        }
      })
    },
    transferRate () {
      let pickedRate = `${this.pageGem}_${this.selectedGem}`
      return this.$store.getters.walletTransferRate[pickedRate]
    },
    fromValue: {
      get () {
        return this.transferGems.fromValue
      },
      set (value) {
        this.transferGems.toValue = Number((value * this.transferRate).toFixed(1))
      },
    },
    toValue: {
      get () {
        return this.transferGems.toValue
      },
      set (value) {
        this.transferGems.fromValue = Number((value / this.transferRate).toFixed(1))
      },
    },
  },
}
</script>
