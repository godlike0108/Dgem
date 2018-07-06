import actions from './actions'

export default {
  state: {
    wallet: {},
    // separate wallet log from event log
    walletLog: {},
    // transfer map
    walletTransferMap: {},
    // transfer rate
    walletTransferRate: {},
    // wallet transfer application list
    walletTransferList: {},
    // card apply list
    applyList: {},
    // wallet transfer application list
    cardTransferList: {},
  },
  getters: {
    wallet: (state) => {
      return state.wallet.data
    },
    // separate wallet log from event log
    walletLog: (state) => state.walletLog,
    idUsdWallet: (state, getters) => {
      if (getters.isExist('wallet', 'wallet')) {
        const usdWallet = state.wallet.data.filter((item) => item.gem === 4).shift()
        return usdWallet.id
      } else {
        return 0
      }
    },
    walletTransferMap: (state) => state.walletTransferMap,
    walletTransferRate: (state) => state.walletTransferRate,
    walletTransferList: (state) => state.walletTransferList,
    applyList: (state) => state.applyList,
    cardTransferList: (state) => state.cardTransferList,
  },
  mutations: {
    setWallet (state, json) {
      state.wallet = json
    },
    // separate wallet log from event log
    walletLog: (state, json) => { state.walletLog = json },
    setWalletTransferMap: (state, json) => { state.walletTransferMap = json },
    setWalletTransferRate: (state, json) => { state.walletTransferRate = json },
    setWalletTransferList: (state, json) => { state.walletTransferList = json },
    setApplyList: (state, json) => { state.applyList = json.data },
    setCardTransferList: (state, json) => { state.cardTransferList = json },
  },
  actions,
}
