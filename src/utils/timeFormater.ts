export const genTimeRange = (init = true, starth = 0, startm = 0) => {
    const arr = []
    for(let h=0; h<=24; h++) {
        if(!init) {
            if(startm > 0) {
                if(h > starth) {
                    arr.push((h < 10 ? `0${h}` : h) + ':00')
                    arr.push((h < 10 ? `0${h}` : h) + ':30')
                }
            } else {
                if(h >= starth) {
                    arr.push((h < 10 ? `0${h}` : h) + ':30')
                }
            }
        } else {
            if(h >= starth) {
                arr.push((h < 10 ? `0${h}` : h) + ':00')
                if(h != 24) { arr.push((h < 10 ? `0${h}` : h) + ':30') }
            }
        }
    }
    return arr
}