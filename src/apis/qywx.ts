import request from "@/apis/request";

export const isLogin  = () => {
    return new Promise((reslove, reject) => {
        reslove({})
    })
}

export const getUserInfo = () => {
    const Cookies = require('js-cookie') 
    return Cookies.get('token')
    // return request.post('/graphql', {
    //     query: "{book{name price}}"
    // })
}

export const departmentList = () => {
    return request.get('/apixxx-auth/department/list')
}

export const departmentUserList = (departmentId: string) => {
    return request.get(`/apixxx-auth/user/simpleList?departmentId=${departmentId}`)
}

export const wxMessageSend = (params: iKeyString) => {
    return request.post('/apixxx-auth/message/send', params)
}
