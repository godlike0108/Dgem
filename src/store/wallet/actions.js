export default {
  async WalletPage ({ dispatch, commit, getters }) {
    const myId = getters.myId
    const json = await dispatch('GET', `/api/users/${myId}/wallets?page=1`)
    commit('setWallet', json)
  },
  async TransferUSD ({ dispatch, getters }, { data }) {
    const id = getters.idUsdWallet
    await dispatch('POST', {
      path: `/api/wallets/${id}/transfers`,
      data,
    })
  },
  // separate wallet log from event log
  async WalletLog ({ dispatch, commit, getters }, { nextIndex, searchParams }) {
    nextIndex = nextIndex || 1
    const myId = getters.myId
    searchParams = searchParams || new URLSearchParams()
    searchParams.append('page', `${nextIndex}`)
    const json = await dispatch('GET', `/api/users/${myId}/operation-histories?${searchParams.toString()}`)
    commit('walletLog', json)
  },
  // update wallet pwd
  async UpdateWalletPwd ({ dispatch, getters }, { data }) {
    const myId = getters.myId
    const path = `/api/users/${myId}`
    try {
      await dispatch('PUT', {path, data})
      return 'success'
    } catch (e) {
      return 'fail'
    }
  },
  // get wallet transfer map
  async WalletTransferMap ({dispatch, commit}) {
    let walletTransferMap = await dispatch('GET', `/api/wallet-transfer-map`)
    commit('setWalletTransferMap', walletTransferMap)
  },
  // get wallet transfer rate
  async WalletTransferRate ({dispatch, commit}) {
    let walletTransferRate = await dispatch('GET', `/api/wallet-transfer-rate`)
    commit('setWalletTransferRate', walletTransferRate)
  },
}
