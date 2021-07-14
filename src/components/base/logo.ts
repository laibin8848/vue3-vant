import { h } from 'vue';

export default {
    name: 'robot-logo',
    render() {
        return h('img', {
            class: 'head_logo',
            src: require('../../static/logo_transparent.png')
        })
    }
}