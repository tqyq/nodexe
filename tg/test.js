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
const bot = new Telegraf(process.env.TEST_BOT,{ telegram: { agent: socksAgent }  })
var {CronJob} = require('cron')
emoji = ['❗', '❕']
//const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start(ctx => ctx.reply('欢迎!'))
bot.help(ctx => ctx.reply('发我 a sticker'))
bot.on('sticker', ctx => ctx.reply('👍'))
bot.hears('hi', ctx => ctx.reply('你好 火鸡' + emoji[0] + emoji[1]))
bot.command('id', ctx => ctx.reply(`fromId=${ctx.from.id}\nfromUsername=${ctx.from.username}\nchatId=${ctx.chat.id}`))
//bot.telegram.sendMessage(ctx.update.callback_query.from.id, 'hi')
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


//new CronJob('* * * * * *', function() {
//  console.log('You will see this message every second')
//}, null, true, 'Asia/Shanghai')

bot.startPolling()
