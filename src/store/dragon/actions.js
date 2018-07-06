export default {
  async buyDragon ({ dispatch }, { data }) {
    await dispatch('POST', {
      path: `/api/dragons`,
      data,
    })
  },
  async activateDragon ({ dispatch }, { idDragon, data }) {
    await dispatch('PUT', {
      path: `/api/dragons/${idDragon}`,
      data,
    })
  },
  async goToAllDragonPage ({ dispatch, commit }, { nextIndex }) {
    nextIndex = nextIndex || 1
    const json = await dispatch('GET', `/api/dragons?page=${nextIndex}`)
    commit('setAllDragonList', json)
  },
  // async goToDragonPage ({ dispatch, commit, getters }, { nextIndex }) {
  //   nextIndex = nextIndex || 1
  //   const myId = getters.myId
  //   const json = await dispatch('GET', `/api/dragons?owner_id=${myId}&activated=0&page=${nextIndex}`)
  //   commit('setDragonList', json)
  // },
  async ListDragonSummary ({dispatch, commit, getters}) {
    const myId = getters.myId
    const json = await dispatch('GET', `/api/users/${myId}/dragon-summary`)
    commit('setDragonList', json)
  },
  async goToActiveDragonPage ({ dispatch, commit, getters }, { nextIndex }) {
    nextIndex = nextIndex || 1
    const myId = getters.myId
    const json = await dispatch('GET', `/api/dragons?user_id=${myId}&page=${nextIndex}`)
    commit('setActiveDragonList', json)
  },
  async GetDragonPrice ({dispatch, commit}) {
    const arr = await dispatch('GET', `/api/dragon-prices`)
    commit('setDragonPrice', arr)
  },
}
