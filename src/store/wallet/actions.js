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
    await dispatch('PUT', {path, data})
  },
  // update wallet pwd
  async UpdateWalletAddr ({ dispatch, getters }, { walletIndex, data }) {
    const myId = getters.myId
    const walletId = getters.wallet[walletIndex].id
    const path = `/api/users/${myId}/wallets/${walletId}`
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
  // apply wallet transfer
  async ApplyWalletTransfer ({dispatch, commit}, {mainGemValue, data}) {
    await dispatch('POST', {
      path: `/api/gems/${mainGemValue}/wallet-transfer-applications`,
      data,
    })
  },
  // apply wallet transfer
  async GetWalletTransferList ({dispatch, commit}, {mainGemValue, nextIndex, searchParams}) {
    nextIndex = nextIndex || 1
    searchParams = searchParams || new URLSearchParams()
    searchParams.append('page', `${nextIndex}`)
    searchParams.append('to_gem[]', '5')
    searchParams.append('to_gem[]', '6')
    searchParams.append('to_gem[]', '8')
    const json = await dispatch('GET', `/api/gems/${mainGemValue}/wallet-transfer-applications?${searchParams.toString()}`)
    commit('setWalletTransferList', json)
  },

  // apply card
  async ApplyCard ({dispatch, commit}, data) {
    await dispatch('POST', {
      path: `/api/card-applications`,
      data,
    })
  },
  // apply wallet transfer
  async ApplyCardTransfer ({dispatch, commit}, {mainGemValue, data}) {
    await dispatch('POST', {
      path: `/api/gems/${mainGemValue}/wallet-transfer-applications`,
      data,
    })
  },
  // get card application list
  async GetCardApplyList ({dispatch, commit}, data) {
    const json = await dispatch('GET', `/api/card-applications`)
    commit('setApplyList', json)
  },
  // get card transfer list
  async GetCardTransferList ({dispatch, commit}, {mainGemValue, nextIndex, searchParams}) {
    nextIndex = nextIndex || 1
    searchParams = searchParams || new URLSearchParams()
    searchParams.append('page', `${nextIndex}`)
    searchParams.append('to_gem[]', '7')
    const json = await dispatch('GET', `/api/gems/${mainGemValue}/wallet-transfer-applications?${searchParams.toString()}`)
    commit('setCardTransferList', json)
  },
  // apply wallet transfer
  async ApplyPointTransfer ({dispatch, commit}, {mainGemValue, data}) {
    await dispatch('POST', {
      path: `/api/gems/${mainGemValue}/wallet-transfer-applications`,
      data,
    })
  },
  // get point transfer list
  async GetPointTransferList ({dispatch, commit}, {mainGemValue, nextIndex, searchParams}) {
    nextIndex = nextIndex || 1
    searchParams = searchParams || new URLSearchParams()
    searchParams.append('page', `${nextIndex}`)
    searchParams.append('to_gem[]', '5')
    const json = await dispatch('GET', `/api/gems/${mainGemValue}/wallet-transfer-applications?${searchParams.toString()}`)
    commit('setPointTransferList', json)
  },
  async GetTransferLimit ({dispatch, commit}, {mainGemValue, toValue}) {
    const json = await dispatch('GET', `/api/wallet-transfer-limits?from_gem=${mainGemValue}&to_gem=${toValue}`)
    commit('setWalletTransferLimit', json)
  },
}
