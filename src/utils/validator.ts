export const isPhone = (value: string) => {
    return /^1[3456789]\d{9}$/.test(value)
}