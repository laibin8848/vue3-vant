import request from "@/apis/request";

export const getUserInfo = () => {
    return request.get('/apixxx-auth/userInfo')
}
