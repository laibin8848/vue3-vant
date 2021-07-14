import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import wechatAuth from './plugins/wechatAuth'
import '@/style/reset.css'
import '@/style/global.scss'
import '@vant/touch-emulator'
import baseComponents from '@/components/base'

process.env.VUE_APP_DEBUG === 'true' && ( new (window as any).VConsole() )
    
let app = createApp(App)

for(const key in baseComponents) {
    app.component(key, baseComponents[key])
}
app.use(router)
    // .use(wechatAuth)//微信认证插件，如果非此类应用，可以不引用，这个不要了，改为服务端认证
    .mount('#app')
