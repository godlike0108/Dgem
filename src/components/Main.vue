<style>
.layout{
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.menu-item span{
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span{
  width: 0px;
  transition: width .2s ease;
}
.collapsed-menu i{
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.logout-button {
  margin: 0 10px;
}

.user-name {
  vertical-align: middle;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="2-1" theme="dark" width="auto" :class="menuitemClasses">
                  <Submenu name="2">
                      <template slot="title">
                          <Icon type="person"></Icon>
                          個人中心
                      </template>
                      <router-link :to="{path: `/Main/userProfile`}"><MenuItem name="2-1">基本資料</MenuItem></router-link>
                      <router-link :to="{path: `/Main/ChildAccount`}"><MenuItem name="2-2">子母帳號</MenuItem></router-link>
                       <router-link :to="{path: `/Main/QRCodes`}"><MenuItem name="2-3">QR Code</MenuItem></router-link>
                      <!-- <router-link to="notStart"><MenuItem v-show="isFunctionEnabel" name="2-3">更換手機</MenuItem></router-link> -->
                      <router-link :to="{path: `/Main/notStart`}"><MenuItem v-show="false" name="2-4">夢想卡解涷</MenuItem></router-link>
                  </Submenu>
                  <Submenu name="3">
                      <template slot="title">
                          <Icon type="leaf"></Icon>
                          夢寶龍樹種區
                      </template>
                      <!-- <router-link to="BuyDragon"><MenuItem v-show="isFunctionEnabel" name="3-1">夢寶龍購買</MenuItem></router-link> -->
                      <router-link :to="{path: `/Main/Dragon`}"><MenuItem v-show="isFunctionEnabel" name="3-2">夢寶龍激活</MenuItem></router-link>
                      <router-link :to="{path: `/Main/Tree`}"><MenuItem v-show="isFunctionEnabel" name="3-3">夢寶樹激活</MenuItem></router-link>
                      <router-link :to="{path: `/Main/EventsLog`}"><MenuItem name="3-4">操作明細查詢</MenuItem></router-link>
                      <router-link :to="{path: `/Main/Activating`}"><MenuItem name="3-5">開採狀況</MenuItem></router-link>
                  </Submenu>
                  <Submenu name="4">
                      <template slot="title">
                          <Icon type="bag"></Icon>
                          寶石卡片管理
                      </template>
                      <router-link :to="{path: `/Main/Wallet`}"><MenuItem name="4-1">寶石庫存</MenuItem></router-link>
                      <router-link :to="{path: `/Main/WalletLog`}"><MenuItem name="4-2">進出明細</MenuItem></router-link>
                      <Submenu name="4-3" v-show="isFunctionEnabel">
                          <template slot="title">
                          寶石轉換
                          </template>
                          <router-link :to="{path: '/Main/TransferGems/0'}"><MenuItem name="4-3-1">七彩寶石轉換</MenuItem></router-link>
                          <router-link :to="{path: '/Main/notStart'}"><MenuItem name="4-3-2">多喜寶石轉換</MenuItem></router-link>
                          <router-link :to="{path: '/Main/Shopping'}"><MenuItem name="4-3-3">多福寶石轉換</MenuItem></router-link>
                          <router-link :to="{path: '/Main/TransferGems/3'}"><MenuItem name="4-3-4">多財寶石轉換</MenuItem></router-link>
                      </Submenu>
                  </Submenu>
                  <Submenu name="5" v-show="isFunctionEnabel">
                      <template slot="title">
                          <Icon type="card"></Icon>
                          卡片管理
                      </template>
                      <router-link :to="{path: `/Main/ApplyCard`}"><MenuItem name="5-1">卡片申請</MenuItem></router-link>
                      <router-link :to="{path: `/Main/TransferCard`}"><MenuItem name="5-2">轉出</MenuItem></router-link>
                  </Submenu>
                  <router-link :to="{path: `/Main/Group`}"><MenuItem name="6-1">
                    <Icon type="person-stalker"></Icon>
                    家族開採狀況
                  </MenuItem></router-link>
                  <Submenu name="7" v-show="isFunctionEnabel">
                    <template slot="title">
                      <Icon type="trophy"></Icon>
                      夢寶積分管理
                    </template>
                    <router-link :to="{path: `/Main/TransferPoint`}"><MenuItem v-show="isFunctionEnabel" name="7-1">轉出</MenuItem></router-link>
                    <router-link :to="{path: `/Main/PointToC`}"><MenuItem name="7-2">碳鏈轉換</MenuItem></router-link>
                  </Submenu>
                </Menu>
                <div slot="trigger"></div>
            </Sider>
            <Layout>
                <Header class="layout-header-bar">
                  <span class="user-name">{{ userHeadUpDisplay }}</span>
                  <Button class="logout-button" @click="logOut()" type="primary">登出</Button>
                </Header>
                <Content :style="{padding: '20px', minHeight: '220px'}">
                  <keep-alive>
                    <router-view></router-view>
                  </keep-alive>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import localStore from 'store'
export default {
  data () {
    return {
      isCollapsed: false,
    }
  },
  computed: {
    isFunctionEnabel () {
      // child account not show
      return !this.$store.getters.self.is_child_account
    },
    menuitemClasses: () => {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : '',
      ]
    },
    userHeadUpDisplay () {
      return `${this.$store.getters.self.name}`
    },
  },
  methods: {
    logOut () {
      // clear state token
      this.$store.dispatch('Logout')
      // clear local storage
      localStore.remove('dgemToken')
      // redirect to login page
      this.$router.push('/Login')
    },
  },
}
</script>
