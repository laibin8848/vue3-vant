import { h } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'robot-back-home',
    render() {
        const $router = useRouter()
        return h('div', { class: 'back-home' }, [
            h('img', {
                style: 'width: 25px;margin: 0 auto;',
                src: require('../../static/home_icon.svg'),
                onClick: function() {
                    $router.push('/')
                }
            })
        ])
    }
}