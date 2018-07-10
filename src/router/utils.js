import localStore from 'store'
import store from '../store'

const utils = {
  checkLogin () {
    if (store.getters.isLogin) {
      return true
    } else if (localStore.get('dgemToken')) {
      store.commit('token', localStore.get('dgemToken'))
      return true
    } else {
      return false
    }
  },
  verifyEmail () {
    if (store.getters.emailVerified) {
      return true
    } else {
      return false
    }
  },
  checkChild () {
    if (store.getters.self.is_child_account) {
      return true
    } else {
      return false
    }
  },
  fetchLoginData () {
    // await route.app.$store.dispatch('whoAmI')
    // await route.app.$store.dispatch(`allChildAccount`)
    // await route.app.$store.dispatch('userDownLines', { idUser: route.app.$store.getters.myId })
    // await route.app.$store.dispatch(`WalletPage`)
  },
}

export default utils
