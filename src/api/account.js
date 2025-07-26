// src/api/account.js
import axios from 'axios'

// 创建axios实例，配置后端基础地址
const request = axios.create({
  baseURL: 'http://localhost:8080', // 替换为你的后端服务地址
  timeout: 5000
})

export default {
  // 注册接口
  register: (userData) => {
    return request.post('/user/register', userData)
  },
  // 可选：登录接口（未来可能用到）
  login: (loginData) => {
    return request.post('/user/login', loginData)
  }
}
