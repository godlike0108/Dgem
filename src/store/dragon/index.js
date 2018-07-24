import actions from './actions'

export default {
  state: {
    allDragon: {},
    dragon: {},
    activeDragon: {},
    dragonPrice: [],
    allDragonCandidate: {},
  },
  getters: {
    allDragon: (state) => state.allDragon.data,
    dragon: (state) => state.dragon,
    activeDragon: (state) => state.activeDragon.data,
    dragonPrice: (state) => state.dragonPrice,
    allDragonCandidate: (state) => state.allDragonCandidate,
  },
  mutations: {
    setAllDragonList (state, json) {
      state.allDragon = json
    },
    setDragonList (state, json) {
      state.dragon = json
    },
    setActiveDragonList (state, json) {
      state.activeDragon = json
    },
    setDragonPrice (state, json) {
      state.dragonPrice = json
    },
    setDragonCandidate (state, json) {
      state.allDragonCandidate = json
    },
  },
  actions,
}
