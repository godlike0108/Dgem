import actions from './actions'

export default {
  state: {
    allDragon: {},
    dragon: {},
    activeDragon: {},
    dragonPrice: [],
  },
  getters: {
    allDragon: (state) => state.allDragon.data,
    dragon: (state) => state.dragon,
    activeDragon: (state) => state.activeDragon.data,
    dragonPrice: (state) => state.dragonPrice,
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
  },
  actions,
}
