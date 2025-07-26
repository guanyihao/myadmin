import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(), // 初始从缓存读取Token
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log('准备登录:', username)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('登录响应:', response)

        // 修复1：根据实际响应结构，从根节点判断success（而非response.data.success）
        if (response.success) {
          // 修复2：从响应根节点提取token（而非response.data.token）
          const { token } = response
          console.log('获取到token:', token) // 此时会正确打印token

          // 保存token到Vuex和本地缓存
          commit('SET_TOKEN', token)
          setToken(token)
          resolve()
        } else {
          // 从根节点提取错误信息（如果message在根节点）
          const errorMessage = response.message || '登录失败，请重试'
          console.error('登录失败:', errorMessage)
          reject(new Error(errorMessage))
        }
      }).catch(error => {
        console.error('登录请求出错:', error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    console.log('开始获取用户信息，token:', state.token) // 修复后这里会显示正确token

    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        console.log('获取用户信息响应:', response)
        const { data } = response

        if (!data) {
          console.error('用户信息为空')
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data
        console.log('提取的角色:', roles)
        console.log('角色类型检查:', Array.isArray(roles))

        // roles must be a non-empty array
        if (!roles || !Array.isArray(roles) || roles.length <= 0) {
          console.error('角色验证失败:', roles)
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        console.error('获取用户信息错误:', error)
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // 清空路由标签
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态修改权限（可选功能）
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 根据新角色生成路由
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    router.addRoutes(accessRoutes)

    // 清空路由标签
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
