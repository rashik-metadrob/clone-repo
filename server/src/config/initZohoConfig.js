const { zohoService } = require("../services")

const initZohoConfig = async () => {
    await zohoService.refreshToken()
}

module.exports = {
    initZohoConfig
}