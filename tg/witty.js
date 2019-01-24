const Telegraf = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent')
const socksAgent = new SocksAgent({
  socksHost: process.env.SOCKS_HOST,
  socksPort: process.env.SOCKS_PORT,
//  socksUsername: config.proxy.login,
//  socksPassword: config.proxy.psswd,
})
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(process.env.WITTY_BOT,{ telegram: { agent: socksAgent }  })
//const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(ctx => ctx.reply('欢迎!'))
//bot.telegram.sendMessage(ctx.update.callback_query.from.id, 'hi')
// todo on url/link, parse(title/body) and save(url/title/plain) into pg
// todo on text, search and return title list
// todo on title click, return url
bot.hears('test', ctx => {
  return ctx.reply('选择功能', Extra.HTML().markup((m) =>
    m.inlineKeyboard(
    [
        m.callbackButton(emoji[0]+'开启ssh', 'ssh'),
        m.callbackButton(emoji[1]+'查负载', 'top'),
        m.callbackButton('gp连接', 'conn'),
        m.callbackButton('gp状态', 'gpstate')
    ])))
})

bot.startPolling()
