import Vue from 'vue'
import Router from 'vue-router'
import localStore from 'store'
import Main from '@/components/Main'
import Unverified from '@/components/Unverified'
import notStart from '@/components/notStart'
import Dragon from '@/components/Dragon'
import Tree from '@/components/Tree'
import Activating from '@/components/Activating'
import ChildAccount from '@/components/ChildAccount'
import Wallet from '@/components/Wallet'
import Group from '@/components/Group'
import TransferUSD from '@/components/TransferUSD'
import TransferGems from '@/components/TransferGems'
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
      beforeEnter: (to, from, next) => {
        if (localStore.get('dgemToken')) {
          route.push('/Main')
        } else {
          route.push('/Login')
        }
      },
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
          path: 'Unverified',
          name: 'Unverified',
          component: Unverified,
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
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }

            route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            route.app.$store.dispatch(`WalletPage`)
            await route.app.$store.dispatch('ListDragonSummary')
            next()
          },
        },
        {
          path: 'Tree',
          name: 'Tree',
          component: Tree,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }
            route.app.$store.dispatch('setAvailTreeType')
            route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            route.app.$store.dispatch(`WalletPage`)
            route.app.$store.dispatch('goToTreePage', { nextIndex: 1 })
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
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }

            await route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'TransferGems/:gem',
          name: 'TransferGems',
          component: TransferGems,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              route.push('/Main/ChildAccount')
              return
            }
            await route.app.$store.dispatch(`WalletPage`)
            await route.app.$store.dispatch(`WalletTransferMap`)
            await route.app.$store.dispatch(`WalletTransferRate`)
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
  if (to.name === 'Login') {
    next()
    return
  }
  if (!from.name && to.name === 'Unverified') {
    next({path: '/Main/Unverified'})
    return
  } else if (to.name === 'Unverified') {
    next()
    return
  }

  if (!route.app.$store.getters.isLogin && !localStore.get('dgemToken')) {
    next({path: '/Login'})
    return
  } else if (!route.app.$store.getters.isLogin) {
    route.app.$store.commit('token', localStore.get('dgemToken'))
  }

  await route.app.$store.dispatch('getOnlyMe')
  if (!route.app.$store.getters.emailVerified) {
    next({path: '/Main/Unverified'})
    return
  }

  if (!from.name) {
    await route.app.$store.dispatch('whoAmI')
    await route.app.$store.dispatch(`allChildAccount`)
    await route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
    await route.app.$store.dispatch(`WalletPage`)
  }
  next()
})

export default route
