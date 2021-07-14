const Koa = require("koa");
const router = require('koa-router')();
const static = require('koa-static');
const axios = require('axios');

const appInstance = new Koa();

const requestUrl = process.env.ENV == 'prod' 
    ? 'https://xxx'
    : 'http://xxx';

const baseUrl = process.env.ENV == 'prod' 
    ? 'https://xxx' 
    : 'http://xxx';

appInstance.use(static(process.env.ENV == 'prod' ? './dist' : './dist'));


//应用配置
const appConfig = {
    appPath: process.env.ENV == 'prod' ? '/' : '/',
    agentid: '2',
    appid: '',
    authUrl: encodeURIComponent(`${baseUrl}/auth`)
}

router.get('/auth-redirect', async (cxt, next) => {
    const token = cxt.cookies.get('token');
    const userAgent = cxt.request.header['user-agent'] || '';
    console.log('user-agent', cxt.request.header['user-agent']);
    console.log('auth-redirect', token);
    console.log('indexof', userAgent.indexOf('Windows NT'));
    //针对PC应用不同的模板
    const template = `${userAgent.indexOf('Windows NT') > -1 ? 'pc.html' : 'index.html'}`;
    if(!token) {
        //未登录
        const curUrl = encodeURIComponent(`${baseUrl}/${template}`);
        if(userAgent.indexOf('MicroMessenger') === -1) {
            jumpUrl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${appConfig.appid}&agentid=${appConfig.agentid}&redirect_uri=${appConfig.authUrl}&state=${curUrl}`;
        } else {
            jumpUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appConfig.appid}&redirect_uri=${appConfig.authUrl}&response_type=code&scope=snsapi_base&state=${curUrl}#wechat_redirect`;
        }
        cxt.redirect(jumpUrl);
    } else {
        cxt.response.redirect(`${baseUrl}/${template}`);
        // cxt.body = '已经认证！';
    }
});

router.get('/auth', async (cxt, next) => {
    const { code, state } = cxt.request.query;
    if(code && state) {
        //get jwt from JAVA side
        try {
            const res = await axios.get(requestUrl + '/auth/getJwtToken?code='+code);
            console.log('auth', res.data.result);
            if(res.data.success == true) {
                const jwt_decode = require('jwt-decode');
                const tokenDecode = jwt_decode(res.data.result);
                cxt.cookies.set('token', res.data.result, { httpOnly: false, path: appConfig.appPath });
                cxt.cookies.set('userId', tokenDecode.userId, { httpOnly: false, path: appConfig.appPath });
                cxt.response.redirect(state);
            } else {
                cxt.body = '认证失败！';
            }
        } finally {
            cxt.body = '认证失败！';
        }
    } else {
        cxt.body = '参数错误！';
    }
});

appInstance.use(router.routes());

appInstance.listen(8000);