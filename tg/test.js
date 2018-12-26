const Telegraf = require('telegraf')
//const SocksAgent = require('socks5-https-client/lib/Agent');
//const socksAgent = new SocksAgent({
//  socksHost: process.env.SOCKS_HOST,
//  socksPort: process.env.SOCKS_PORT,
////  socksUsername: config.proxy.login,
////  socksPassword: config.proxy.psswd,
//});

//const bot = new Telegraf(process.env.BOT_TOKEN,{ telegram: { agent: socksAgent }  })
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(ctx => ctx.reply('Welcome!'))
bot.help(ctx => ctx.reply('Send me a sticker'))
bot.on('sticker', ctx => ctx.reply('👍'))
bot.hears('hi', ctx => ctx.reply('Hey there'))
bot.startPolling()