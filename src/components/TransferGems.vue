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
  <FormItem :label="`兌換比例: ${ratio.label}`">
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
  },
  data () {
    return {
      walletName: '七彩寶石',
      walletValue: 100,
      selectedGem: 0,
      ratio: {
        label: '1:5',
        value: 5,
      },
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
    // get map list from wallet transfer map
    gemList () {
      return this.$store.getters.walletTransferMap[this.$route.params.gem].map(gem => {
        return {
          name: this.listLookUp[gem],
          value: gem,
        }
      })
    },
    fromValue: {
      get () {
        console.log(this)
        return this.transferGems.fromValue
      },
      set (value) {
        this.transferGems.toValue = value * this.ratio.value
      },
    },
    toValue: {
      get () {
        return this.transferGems.toValue
      },
      set (value) {
        this.transferGems.fromValue = value / this.ratio.value
      },
    },
  },
}
</script>
