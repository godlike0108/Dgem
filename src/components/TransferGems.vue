<template>
<div>
<h4>我的{{walletName}}</h4>
<span class="wallet-value">{{walletValue || valueUnit}}</span>
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
          <span>{{gemList[selectedGem].name}}</span>
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

  data () {
    return {
      walletName: '七彩寶石',
      walletValue: 100,
      selectedGem: 1,
      ratio: {
        label: '1:5',
        value: 5,
      },
      gemList: [
        {
          name: '碳幣',
          value: 0,
        },
        {
          name: '財神幣',
          value: 1,
        },
        {
          name: '美金',
          value: 2,
        },
        {
          name: '圓夢積分',
          value: 3,
        },
      ],
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
    fromValue: {
      get () {
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
