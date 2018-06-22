import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
// import Home from '@/components/Home'
import notStart from '@/components/notStart'
import Dragon from '@/components/Dragon'
import Tree from '@/components/Tree'
import Activating from '@/components/Activating'
import ChildAccount from '@/components/ChildAccount'
import Wallet from '@/components/Wallet'
import BuyDragon from '@/components/BuyDragon'
import Group from '@/components/Group'
import TransferUSD from '@/components/TransferUSD'
// import QRcodeLogin from '@/components/QRcodeLogin'
import Login from '@/components/Login'
import UserProfile from '@/components/UserProfile'
import EventsLog from '@/components/EventsLog'
import WalletLog from '@/components/WalletLog'

Vue.use(Router)

var route = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Login',
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Main',
      name: 'Main',
      component: Main,
      redirect: '/Main/UserProfile',
      children: [
        {
          path: 'notStart',
          name: 'notStart',
          component: notStart,
        },
        {
          path: 'UserProfile',
          name: 'UserProfile',
          component: UserProfile,
        },
        {
          path: 'Dragon',
          name: 'Dragon',
          component: Dragon,
        },
        {
          path: 'Tree',
          name: 'Tree',
          component: Tree,
        },
        {
          path: 'Activating',
          name: 'Activating',
          component: Activating,
        },
        {
          path: 'ChildAccount',
          name: 'ChildAccount',
          component: ChildAccount,
        },
        {
          path: 'Wallet',
          name: 'Wallet',
          component: Wallet,
        },
        {
          path: 'TransferUSD',
          name: 'TransferUSD',
          component: TransferUSD,
        },
        {
          path: 'BuyDragon',
          name: 'BuyDragon',
          component: BuyDragon,
        },
        {
          path: 'Group',
          name: 'Group',
          component: Group,
        },
        {
          path: 'EventsLog',
          name: 'EventsLog',
          component: EventsLog,
        },
        {
          path: 'WalletLog',
          name: 'WalletLog',
          component: WalletLog,
        },
      ],
    },
  ],
})

route.beforeEach(async (to, from, next) => {
  if (from.name === null && to.name !== 'Login' && (route.app.$store === undefined || route.app.$store.getters.token.length === 0)) {
    route.push('/Login')
  }

  if (from.name === 'Login') {
    await route.app.$store.dispatch('whoAmI')
    route.app.$store.dispatch(`allChildAccount`)
    route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
    route.app.$store.dispatch(`WalletPage`)
  }

  if (route.app.$store !== undefined) {
    const searchParams = new URLSearchParams()
    switch (to.name) {
      case 'UserProfile':
        await route.app.$store.dispatch('goToActiveDragonPage', { nextIndex: 1 })
        break
      case 'Activating':
        route.app.$store.dispatch('goToActiveTreePage', { nextIndex: 1 })
        break
      case 'BuyDragon':
        await route.app.$store.dispatch(`goToAllDragonPage`, { nextIndex: 1 })
        route.app.$store.dispatch(`WalletPage`)
        break
      case 'Tree':
      case 'Dragon':
      case 'ChildAccount':
        if (!route.app.$store.getters.self.is_child_account) {
          await route.app.$store.dispatch('whoAmI')
          route.app.$store.dispatch(`allChildAccount`)
          await route.app.$store.dispatch(`goTo${to.name}Page`, { nextIndex: 1 })
        }
        route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
        route.app.$store.dispatch(`WalletPage`)
        break
      case 'Group':
        await route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
        break
      case 'Wallet':
      case 'TransferUSD':
        await route.app.$store.dispatch(`WalletPage`)
        break
      case 'EventsLog':
        searchParams.append('operatable_type', `2`) // dragon
        searchParams.append('type[]', `0`)
        searchParams.append('type[]', `2`)
        await route.app.$store.dispatch('EventsLog', { nextIndex: 1, searchParams })
        break
      case 'WalletLog':
        await route.app.$store.dispatch(`WalletPage`)
        searchParams.append('operatable_type', `1`) // wallet
        searchParams.append('operatable_id', route.app.$store.getters.wallet.filter((item) => {
          return item.gem === 4
        }).shift().id)
        await route.app.$store.dispatch('WalletLog', { nextIndex: 1, searchParams })
        break
    }
  }
  next()
})

export default route
