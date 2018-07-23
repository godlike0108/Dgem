import axios from 'axios'
import localStore from 'store'
export default {
  async CreateUser ({ dispatch, getters }, data) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    await axios.post(`${getters.host}/api/users`, data, { headers })
  },
  async Login ({ dispatch, commit, getters }, { name, password }) {
    const headers = {
      'Content-Type': 'application/json',
    }
    const data = {
      'grant_type': 'password',
      username: name,
      password,
      'client_id': '2',
      'client_secret': `${getters.secret}`,
    }
    const response = await axios.post(`${getters.host}/oauth/token`, data, { headers })
    // store token into local
    localStore.set('dgemToken', response.data)
    commit('token', response.data)
  },
  Logout ({commit}) {
    let payload = {
      access_token: '',
      token_type: '',
    }
    // clear token
    commit('token', payload)
  },
  async LoginQRcode ({ dispatch, commit, getters }) {
    const headers = {
      'Content-Type': 'application/json',
    }
    const data = {
      'grant_type': 'qrcode',
      'id': `${getters.qrcodeUser.id}`,
      'password': `${getters.qrcodeUser.password}`,
      'client_id': '2',
      'client_secret': `${getters.secret}`,
    }

    const response = await axios.post(`${getters.host}/oauth/token`, data, { headers })
    // store token into local
    localStore.set('dgemToken', response.data)
    commit('token', response.data)
  },
  async CreateQRcode ({ commit, getters }) {
    const headers = {
      'Accept': 'application/json',
    }
    const data = {
      'id': 10,
      'password': 'h%1`2{A/A',
      'qrcode_url': 'https://uim.dreamsgem.net/applets?action=/applets/dreamsgem/auth/scan-login/10',
    }
    const response = await axios.post(`${getters.host}/api/qrcodes`, data, { headers })
    commit('setQRcodeData', response.data)
  },
  async GET ({ getters }, path) {
    const response = await axios.get(`${getters.host}${path}`, {
      headers: {
        ...getters.headers,
      },
    })
    if (response.status === 200) {
      return response.data
    } else {
      return response
    }
  },
  async POST ({ getters }, { path, data }) {
    const response = await axios.post(`${getters.host}${path}`,
      data, {
        headers: {
          ...getters.headers,
          'Content-Type': 'application/json',
        },
      })
    if (response.status === 200) {
      return response.data
    } else {
      return response
    }
  },
  async PUT ({ getters }, { path, data }) {
    const response = await axios.put(`${getters.host}${path}`,
      data, {
        headers: {
          ...getters.headers,
          'Content-Type': 'application/json',
        },
      })
    if (response.status === 200) {
      return response.data
    } else {
      return response
    }
  },
}
