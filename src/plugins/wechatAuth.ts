import { App } from 'vue';
import { isLogin } from '@/apis/qywx';
const Cookies = require('js-cookie');
import { getQuery } from '@/utils/request';

const wechatAuth = {
    install(app: App) {
        //每次进入应用的时候会调用接口判断是否登录，如果是PC端，会走扫码逻辑
        const authUrl = encodeURIComponent(process.env.VUE_APP_QY_WECHAT_AUTH)
        const curUrl = encodeURIComponent(window.location.href)
        if(window.location.href.indexOf('token') !== -1) {
            //保存token
            Cookies.set('token', getQuery('token'))
            return
        }
        // isLogin().then((res: any) => {
        //     if(res.isLogin) {
        //         //如果登录了
        //         return
        //     }
        //     const appid = res.appid
        //     const agentid = res.agentid
        //     if(navigator.userAgent.indexOf('MicroMessenger') === -1) {
        //         window.location.href = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${appid}&agentid=${agentid}&redirect_uri=${authUrl}&state=${curUrl}`
        //     } else {
        //         window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${authUrl}&response_type=code&scope=snsapi_base&state=${curUrl}#wechat_redirect`
        //     }
        // })
    }
}
export default wechatAuth