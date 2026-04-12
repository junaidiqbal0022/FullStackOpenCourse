const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.Port, () => {
    logger.info(`Server running on port ${config.Port}`)
})
