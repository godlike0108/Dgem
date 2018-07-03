import actions from './actions'

export default {
  state: {
    allDragon: {},
    dragon: {},
    activeDragon: {},
  },
  getters: {
    allDragon: (state) => state.allDragon.data,
    dragon: (state) => state.dragon,
    activeDragon: (state) => state.activeDragon.data,
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
  },
  actions,
}
