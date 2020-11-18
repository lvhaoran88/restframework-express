


DEFUALT = {
    DEFAULT_THROTTLE_RATES: {
        user: null,
        anon: null,
    },


    get(key) {
        return this[key] || null
    },
    set(key, val) {
        this[key] = val
    }
}

module.exports = DEFUALT