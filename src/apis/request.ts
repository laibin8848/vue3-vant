import axios from 'axios';
import { Toast } from 'vant';

const service = axios.create({
  baseURL: process.env.NODE_ENV !== 'development' ? process.env.VUE_APP_BASE_API : '/gateway',
  timeout: 5000,
  withCredentials: true
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });
    const Cookies = require('js-cookie');
    config.headers['isAdmin'] = Cookies.get('isAdmin') || 'false'
    config.headers['X-Access-Token'] = Cookies.get('token') || ''
    config.headers['userId'] = Cookies.get('userId') || ''
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors`
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 200) {
      if(res.code == 401) {
        //when token invalid
        const Cookies = require('js-cookie')
        Cookies.set('isAdmin', '')
        Cookies.set('token', '')
        Cookies.set('userId', '')
        Cookies.set('userName', '')
        process.env.NODE_ENV !== 'development'
          && (window.location.href = 'https://xxx')
        return
      }
      Toast.fail(res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      Toast.clear()
      return response.data
    }
  },
  (error) => {
    Toast.fail('出错了!')
    return Promise.reject(error)
  }
)

export default service