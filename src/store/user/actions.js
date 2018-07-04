export default {
  async allChildAccount ({ dispatch, commit, getters }) {
    const myId = getters.myId
    const json = await dispatch('GET', `/api/users/${myId}/child-accounts?hello=world&activated=1`)
    // json.data = await dispatch('accountAndWallet', { array: json.data })
    commit('allChildAccount', json)
  },
  async goToChildAccountPage ({ dispatch, commit, getters }, { nextIndex }) {
    nextIndex = nextIndex || 1
    const myId = getters.momId
    const json = await dispatch('GET', `/api/users/${myId}/child-accounts?page=${nextIndex}`)
    json.data = await dispatch('accountAndWallet', { array: json.data })
    commit('setChildAccount', json)
  },
  async addChildAccount ({ dispatch, commit, getters }, { data }) {
    const myId = getters.myId
    const json = await dispatch('POST', {
      data,
      path: `/api/users/${myId}/child-accounts`,
    })
    json.data = await dispatch('accountAndWallet', { array: json.data })
    commit('setChildAccount', json)
  },
  async userDownLines ({ dispatch, commit }, { idUser }) {
    const json = await dispatch('GET', `/api/users/${idUser}`)
    let downlinesWithTreeStatus = []
    json.downlines.forEach(async item => {
      const allTreeStatus = await dispatch('allTreeStatus', { id: item.id })
      downlinesWithTreeStatus.push(Object.assign({}, item, allTreeStatus))
    })
    json.downlines = downlinesWithTreeStatus
    const allTreeStatus = await dispatch('allTreeStatus', { id: json.id })
    commit('setUserDownLines', Object.assign({}, json, allTreeStatus))
  },
  async childAccountWallet ({ dispatch, commit }, { idUser }) {
    const json = await dispatch('GET', `/api/users/${idUser}/wallets?page=1`)
    return json
  },
  accountAndWallet ({ dispatch, commit }, { array }) {
    if (typeof array !== 'undefined' && array.constructor.name === 'Array') {
      let accountAndWallet = []
      array.forEach(async user => {
        const wallets = await dispatch('childAccountWallet', { idUser: user.id })
        wallets.data.forEach(wallet => {
          user[`gem${wallet.gem}`] = user.activated ? wallet.amount : ''
        })
        accountAndWallet.push(Object.assign({}, user))
      })
      return accountAndWallet
    } else {
      return []
    }
  },
  async whoAmI ({ dispatch, commit }) {
    const json = await dispatch('GET', `/api/users/me`)
    const allTreeStatus = await dispatch('allTreeStatus', { id: json.id })
    commit('IAm', Object.assign({}, json, allTreeStatus))
  },
  async whoIsMom ({ dispatch, commit }) {
    const json = await dispatch('GET', `/api/users/me`)
    commit('setMom', Object.assign({}, json))
  },
  async getOnlyMe ({ dispatch, commit }) {
    const json = await dispatch('GET', `/api/users/me`)
    commit('IAm', Object.assign({}, json))
  },
  async modifyMyName ({ dispatch, commit, getters }) {
    const myId = getters.myId
    const json = await dispatch('PUT', {
      path: `/api/users/${myId}`,
      data: {
        name: getters.myName,
      },
    })
    commit('myName', json.name)
  },
  allTreeStatus ({ dispatch }, { id }) {
    return dispatch('GET', `/api/users/${id}/tree-stats`)
  },
  async EventsLog ({ dispatch, commit, getters }, { nextIndex, searchParams }) {
    nextIndex = nextIndex || 1
    const myId = getters.myId
    searchParams = searchParams || new URLSearchParams()
    searchParams.append('page', `${nextIndex}`)
    const json = await dispatch('GET', `/api/users/${myId}/operation-histories?${searchParams.toString()}`)
    commit('eventsLog', json)
  },
  async Recall ({ dispatch, getters }) {
    const myId = getters.myId
    const path = `/api/users/${myId}/recalls`
    await dispatch('POST', { path })
    dispatch(`goToChildAccountPage`, { nextIndex: 1 })
  },
}
