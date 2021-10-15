const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '1385099220:AAGOnD2ol0L73ZU0Qcm_4kRq3riXyZIMRCQ'
console.log('Bot has been started...');
const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})

module.exports = bot