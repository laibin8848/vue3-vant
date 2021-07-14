export const setSaveFlag = () => {
    (window as any).ROBOT_FORM_SAVE = true
    setTimeout(()=> {
        (window as any).ROBOT_FORM_SAVE = false
    }, 1000)
}