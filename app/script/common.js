function fill0(number) {
    return number < 10 ? "0" + number : number
}

export default {
    getFormattedDate: function (date) {
        return date.getFullYear() + "-" + fill0(date.getMonth() + 1) + "-" + fill0(date.getDate())
    },
    clearObject(object) {
        for (let key in object) {
            if (typeof object[key] === 'string' || typeof object[key] === 'number') {
                object[key] = ''
            } else if (typeof object[key] === 'object') {
                if (object[key] instanceof Array) {
                    object[key] = []
                } else {
                    this.clearObject(object[key])
                }
            }
        }
    }
}
