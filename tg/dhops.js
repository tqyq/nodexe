const Telegraf = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent')
const socksAgent = new SocksAgent({
  socksHost: process.env.SOCKS_HOST,
  socksPort: process.env.SOCKS_PORT,
//  socksUsername: config.proxy.login,
//  socksPassword: config.proxy.psswd,
})
const { exec } = require('child_process')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const { Client } = require('pg')

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
        return next(ctx).then(() => {
//            console.log('then', ctx.message, ',', ctx.match)
        })
    }
})

//bot.command('id', ctx => ctx.reply(`fromId=${ctx.from.id}\nfromUsername=${ctx.from.username}`))

bot.action('ssh', ctx => {
    fromId = ctx.from.id + ''
    user = users[fromId]
    console.log('ssh enable', user)
    exec(`usermod -s /bin/bash ${user}`, (err, stdout, stderr) => {
      ctx.reply(err || stderr || `${user},ssh登录已开放`)
    })
})

bot.on('text', (ctx) => {
  return ctx.reply('选择功能', Extra.HTML().markup((m) =>
    m.inlineKeyboard(
    [
      m.callbackButton('开启ssh', 'ssh'),
      m.callbackButton('查看top', 'top'),
      m.callbackButton('gp连接数', 'conn'),
      m.callbackButton('gp状态', 'gpstate')
    ])))
})

bot.action('conn', async (ctx) => {
    client = new Client()
    client.connect()
    client.query("SELECT count(*),datname,(CASE WHEN current_query='<IDLE>' THEN 'IDLE' ELSE 'other' END) q FROM pg_stat_activity where procpid <> pg_backend_pid() group by datname,q", [], (err, res) => {
      ctx.reply(err ? err.stack : res.rows)
      client.end()
    })
})

bot.action('gpstate', async (ctx) => {
    client = new Client()
    client.connect()
    client.query("SELECT count(*),status,hostname FROM gp_segment_configuration group by status,hostname order by hostname", [], (err, res) => {
      ctx.reply(err ? err.stack : res.rows)
      client.end()
    })
})

bot.action('top', async (ctx) => {
    return ctx.reply('选择主机', Extra.HTML().markup((m) =>
        m.inlineKeyboard(
        [
          m.callbackButton('gp01', 'p_gp01'),
          m.callbackButton('gp02', 'p_gp02'),
          m.callbackButton('gp03', 'p_gp03'),
          m.callbackButton('gp04', 'p_gp04'),
          m.callbackButton('dock001', 'p_docker001'),
          m.callbackButton('dock002', 'p_docker002'),
          m.callbackButton('dock003', 'p_docker003')
        ])))
})

bot.action(/p_(.+)/, async ctx => {
    host = ctx.match[1]
    exec(`ssh ${host} "cat /proc/loadavg"`, (err, stdout, stderr) => {
        output = err || stdout || stderr
        return ctx.reply(`${host}\n${output}`)
    })
})

bot.startPolling()
