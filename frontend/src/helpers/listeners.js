export const setScrollTop = (e) => {
    document.body.scrollTop = 0
}

export const bodyScrollOn = () => {
    document.removeEventListener('touchmove', setScrollTop)
}

export const bodyScrollOff = () => {
    document.addEventListener('touchmove', setScrollTop, false)
}