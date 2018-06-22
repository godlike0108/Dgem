import Vue from 'vue'
import Router from 'vue-router'
import localStore from 'store'
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
      beforeEach: (to, from, next) => {
        console.log('here')
      },
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
          beforeEnter: async (to, from, next) => {
            if (from.name === 'Login') {
              await route.app.$store.dispatch('whoAmI')
              route.app.$store.dispatch(`allChildAccount`)
              route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
              route.app.$store.dispatch(`WalletPage`)
            }
            await route.app.$store.dispatch('goToActiveDragonPage', { nextIndex: 1 })
            next()
          },
        },
        {
          path: 'Dragon',
          name: 'Dragon',
          component: Dragon,
          beforeEnter: async (to, from, next) => {
            console.log('fuck')
            if (!route.app.$store.getters.self.is_child_account) {
              await route.app.$store.dispatch('whoAmI')
              route.app.$store.dispatch(`allChildAccount`)
              await route.app.$store.dispatch(`goTo${to.name}Page`, { nextIndex: 1 })
            }
            route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'Tree',
          name: 'Tree',
          component: Tree,
          beforeEnter: async (to, from, next) => {
            if (!route.app.$store.getters.self.is_child_account) {
              await route.app.$store.dispatch('whoAmI')
              route.app.$store.dispatch(`allChildAccount`)
              await route.app.$store.dispatch(`goTo${to.name}Page`, { nextIndex: 1 })
            }
            route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'Activating',
          name: 'Activating',
          component: Activating,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch('goToActiveTreePage', { nextIndex: 1 })
            next()
          },
        },
        {
          path: 'ChildAccount',
          name: 'ChildAccount',
          component: ChildAccount,
          beforeEnter: async (to, from, next) => {
            if (!route.app.$store.getters.self.is_child_account) {
              await route.app.$store.dispatch('whoAmI')
              route.app.$store.dispatch(`allChildAccount`)
              await route.app.$store.dispatch(`goTo${to.name}Page`, { nextIndex: 1 })
            }
            route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'Wallet',
          name: 'Wallet',
          component: Wallet,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'TransferUSD',
          name: 'TransferUSD',
          component: TransferUSD,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'BuyDragon',
          name: 'BuyDragon',
          component: BuyDragon,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch(`goToAllDragonPage`, { nextIndex: 1 })
            route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'Group',
          name: 'Group',
          component: Group,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            next()
          },
        },
        {
          path: 'EventsLog',
          name: 'EventsLog',
          component: EventsLog,
          beforeEnter: async (to, from, next) => {
            let searchParams = new URLSearchParams()
            searchParams.append('operatable_type', `2`) // dragon
            searchParams.append('type[]', `0`)
            searchParams.append('type[]', `2`)
            await route.app.$store.dispatch('EventsLog', { nextIndex: 1, searchParams })
            next()
          },
        },
        {
          path: 'WalletLog',
          name: 'WalletLog',
          component: WalletLog,
          beforeEnter: async (to, from, next) => {
            let searchParams = new URLSearchParams()
            searchParams.append('operatable_type', `1`) // wallet
            searchParams.append('operatable_id', route.app.$store.getters.wallet.filter((item) => {
              return item.gem === 4
            }).shift().id)
            await route.app.$store.dispatch('WalletLog', { nextIndex: 1, searchParams })
            next()
          },
        },
      ],
    },
  ],
})

route.beforeEach(async (to, from, next) => {
  // if (from.name === null && to.name !== 'Login' && (route.app.$store === undefined || route.app.$store.getters.token.length === 0)) {
  //   route.push('/Login')
  //   return
  // }

  if (to.name === 'Login') {
    console.log('Go to login page.')
    next()
    return
  }

  if (!localStore.get('dgemToken')) {
    console.log('Please Login first.')
    route.push('/Login')
    return
  }

  if (from.name !== 'Login') {
    route.app.$store.commit('token', localStore.get('dgemToken'))
    await route.app.$store.dispatch('whoAmI')
    route.app.$store.dispatch(`allChildAccount`)
    route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
    route.app.$store.dispatch(`WalletPage`)
  }
  next()

  // if (from.name === 'Login') {
  //   await route.app.$store.dispatch('whoAmI')
  //   route.app.$store.dispatch(`allChildAccount`)
  //   route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
  //   route.app.$store.dispatch(`WalletPage`)
  // }
})

export default route
