const Telegraf = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent');
const socksAgent = new SocksAgent({
  socksHost: process.env.SOCKS_HOST,
  socksPort: process.env.SOCKS_PORT,
//  socksUsername: config.proxy.login,
//  socksPassword: config.proxy.psswd,
});
const { exec } = require('child_process');

const users = {'743620537':'altman', '743620537a':'wxg', '788120538':'xgc'}
const bot = new Telegraf(process.env.DHOPS_BOT,{ telegram: { agent: socksAgent }  })
//const bot = new Telegraf(process.env.DHOPS_BOT)

bot.use((ctx, next) => {
    fromId = ctx.from.id + ''
    user = users[fromId]
    console.log(new Date(), user)
    if (!user) {
        ctx.reply(`对不起，我不认识你${fromId}`)
    } else {
        return next()
    }
})

//bot.command('id', ctx => ctx.reply(`fromId=${ctx.from.id}\nfromUsername=${ctx.from.username}`))

bot.command('ssh', ctx => {
    fromId = ctx.from.id + ''
    user = users[fromId]
    console.log('ssh enable', user)
    exec(`usermod -s /bin/bash ${user}`, (err, stdout, stderr) => {
      if (err) {
        ctx.reply(`err:\n${err}`);
      } else if (stderr) {
        ctx.reply(`stderr:\n${stderr}`)
      } else {
        ctx.reply(`${user},ssh登录已开放`)
      }
    });
})

bot.command(/h*/, (ctx) => {
  return ctx.reply('选择功能', Extra.HTML().markup((m) =>
    m.inlineKeyboard([
      m.callbackButton('连接数', 'conn'),
      m.callbackButton('gp状态', 'gpstate')
    ])))
})

bot.action('conn', async (ctx) => {
    ctx.reply(`conn`)
})

bot.action('gpstate', async (ctx) => {
    ctx.reply(`gpstate`)
})

bot.startPolling()
