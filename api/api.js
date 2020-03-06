const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://api.diviscan.io/',
    timeout: 1000
})

const divi = (arg) => {
    instance.get(arg)
        .then(response => { return response.data })
}

module.exports = divi