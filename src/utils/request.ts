export const getQuery = (key: string) => {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)","i"); 
    const r = window.location.search.substr(1).match(reg);
    return r != null ? r[2] : '';
}