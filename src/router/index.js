import Vue from 'vue'
import Router from 'vue-router'
import localStore from 'store'

import utils from '@/router/utils'

import Main from '@/components/Main'
import Unverified from '@/components/Unverified'
import notStart from '@/components/notStart'
import Dragon from '@/components/Dragon'
import Tree from '@/components/Tree'
import Activating from '@/components/Activating'
import ChildAccount from '@/components/ChildAccount'
import Wallet from '@/components/Wallet'
import Group from '@/components/Group'
import TransferPoint from '@/components/TransferPoint'
import TransferGems from '@/components/TransferGems'
// import QRcodeLogin from '@/components/QRcodeLogin'
import Login from '@/components/Login'
import ForgetPW from '@/components/ForgetPW'
import UserProfile from '@/components/UserProfile'
import EventsLog from '@/components/EventsLog'
import WalletLog from '@/components/WalletLog'
import Shopping from '@/components/Shopping'
import ApplyCard from '@/components/ApplyCard'
import TransferCard from '@/components/TransferCard'
import PointToC from '@/components/PointToC'
import QRCodes from '@/components/QRCodes'

Vue.use(Router)

var route = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      beforeEnter: (to, from, next) => {
        if (localStore.get('dgemToken')) {
          next({path: '/Main'})
        } else {
          next({path: '/Login'})
        }
      },
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/ForgetPW',
      name: 'ForgetPW',
      component: ForgetPW,
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
          path: 'Shopping',
          name: 'Shopping',
          component: Shopping,
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
          path: 'Unverified',
          name: 'Unverified',
          component: Unverified,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch('getOnlyMe')
            next()
          },
        },
        {
          path: 'UserProfile',
          name: 'UserProfile',
          component: UserProfile,
          beforeEnter: async (to, from, next) => {
            // await route.app.$store.dispatch('whoAmI')
            // route.app.$store.dispatch(`allChildAccount`)
            // route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
            await route.app.$store.dispatch(`WalletPage`)
            route.app.$store.dispatch('goToActiveDragonPage', { nextIndex: 1 })
            next()
          },
        },
        {
          path: 'Dragon',
          name: 'Dragon',
          component: Dragon,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              next({path: '/Main/ChildAccount'})
              return
            }
            await route.app.$store.dispatch('setDragonCandidate')
            await route.app.$store.dispatch('ListDragonSummary')
            route.app.$store.dispatch(`WalletPage`)
            route.app.$store.dispatch('GetDragonPrice')
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
            await route.app.$store.dispatch('setTreeCandidate')
            await route.app.$store.dispatch('ListTreeSummary')
            route.app.$store.dispatch('setAvailTreeType')
            route.app.$store.dispatch(`WalletPage`)
            route.app.$store.dispatch('GetTreePrice')
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
          path: 'QRCodes',
          name: 'QRCodes',
          component: QRCodes,
          beforeEnter: async (to, from, next) => {
            route.app.$store.dispatch(`goToQRCodePage`, { nextIndex: 1 })
            next()
          },
        },
        {
          path: 'ApplyCard',
          name: 'ApplyCard',
          component: ApplyCard,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }

            await route.app.$store.dispatch(`GetCardApplyList`)
            next()
          },
        },
        {
          path: 'ChildAccount',
          name: 'ChildAccount',
          component: ChildAccount,
          beforeEnter: async (to, from, next) => {
            await route.app.$store.dispatch('whoIsMom')
            route.app.$store.dispatch(`goToChildAccountPage`, { nextIndex: 1 })
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
          path: 'TransferPoint',
          name: 'TransferPoint',
          component: TransferPoint,
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
          path: 'PointToC',
          name: 'PointToC',
          component: PointToC,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }
            let mainGemValue = 4
            let toValue = 5
            route.app.$store.dispatch(`GetTransferLimit`, {mainGemValue, toValue})
            await route.app.$store.dispatch(`WalletTransferRate`)
            await route.app.$store.dispatch(`GetPointTransferList`, {mainGemValue})
            await route.app.$store.dispatch(`WalletPage`)
            next()
          },
        },
        {
          path: 'TransferCard',
          name: 'TransferCard',
          component: TransferCard,
          beforeEnter: async (to, from, next) => {
            if (route.app.$store.getters.self.is_child_account) {
              // redirect if directly enter url
              next({path: '/Main/ChildAccount'})
              return
            }
            let mainGemValue = 0
            await route.app.$store.dispatch(`GetCardTransferList`, {mainGemValue})
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
              next({path: '/Main/ChildAccount'})
              return
            }
            route.app.$store.dispatch(`WalletPage`)
            route.app.$store.dispatch(`WalletTransferMap`)
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
            route.app.$store.dispatch('whoAmI')
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
            await route.app.$store.dispatch(`WalletPage`)
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
  if (to.path.includes('/Main/') && to.name !== 'Unverified') {
    if (utils.checkLogin()) {
      if (!from.name || from.name === 'Login') {
        try {
          await route.app.$store.dispatch('getOnlyMe')
        } catch (e) {
          if (e.response.status === 401) {
            utils.removeToken()
            route.app.$Message.error('認證過期，請重新登入')
            next('/Login')
          }
        }
      }

      if (utils.verifyEmail()) {
        next()
      } else if (!utils.checkChild()) {
        next({path: '/Main/Unverified'})
      } else {
        next()
      }
    } else {
      next({path: '/Login'})
    }
  } else {
    next()
  }
})

export default route
