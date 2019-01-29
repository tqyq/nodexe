process.env.TZ = 'Asia/Shanghai'
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
const {CronJob} = require('cron')
const users = {'743620537':'altman', '694383035':'wxg', '788120538':'xgc'}
const bot = new Telegraf(process.env.DHOPS_BOT,{ telegram: { agent: socksAgent }  })
//const bot = new Telegraf(process.env.DHOPS_BOT)
const alert = ['❗', '❕']
var conn_count = 0
bot.use((ctx, next) => {
    fromId = ctx.from.id + ''
    user = users[fromId]
    console.log(new Date().toLocaleString(), user)
    if (!user) {
        ctx.reply(`对不起，我不认识你${fromId}`)
    } else {
        return next(ctx).then(() => {
//            console.log('then', ctx.message, ',', ctx.match)
        })
    }
})

bot.action('ssh', ctx => {
    fromId = ctx.from.id + ''
    user = users[fromId]
    console.log('ssh enable', user)
    exec(`usermod -s /bin/bash ${user}`, (err, stdout, stderr) => {
        ctx.reply(err || stderr || `${user},ssh登录已开放`)
    })
})

bot.on('text', (ctx) => {
    let line1 = {'开启ssh':'ssh', '查负载':'top', 'gp连接'+conn_count:'conn', 'gp状态':'gpstate'}
    const buttons = Object.keys(line1).map(key => Markup.callbackButton(key, line1[key]))
    ctx.reply('选择功能', Extra.HTML().markup((m) =>
        m.inlineKeyboard(buttons)))
})

bot.action('conn', async (ctx) => {
    client = new Client()
    client.connect()
    client.query("SELECT count(*),datname,(CASE WHEN current_query='<IDLE>' THEN 'IDLE' ELSE 'other' END) q FROM pg_stat_activity where procpid <> pg_backend_pid() group by datname,q", [], (err, res) => {
      ctx.reply(err ? err.stack : res.rows,
      Extra.HTML().markup((m) =>
        m.inlineKeyboard(
        [
            m.callbackButton('查看current_query', 'current_query')
        ])))
      client.end()
    })
})

bot.action('current_query', async (ctx) => {
    client = new Client()
    client.connect()
    client.query("SELECT datname,current_query q FROM pg_stat_activity where procpid <> pg_backend_pid() and current_query != '<IDLE>'", [], (err, res) => {
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
    client = new Client()
    client.connect()
    client.query("select * from loadavg order by host", [], (err, res) => {
        if (err) {
            ctx.reply(err.stack)
        } else {
            const obj={}
            for (i in res.rows) {
                row = res.rows[i]
                key = row.host
                if (row.min5 > 10) {
                    key = alert[0]+key
                } else if (row.min5 > 1) {
                    key = alert[1]+key
                }
                obj[key] = 'p_' + row.host
            }
            const buttons = Object.keys(obj).map(key => Markup.callbackButton(key, obj[key]))
            ctx.reply('选择主机', Extra.HTML().markup((m) => m.inlineKeyboard(buttons, {columns: 4})))
        }
        client.end()
    })
})

bot.action(/p_(.+)/, async ctx => {
    host = ctx.match[1]
    exec(`ssh ${host} "cat /proc/loadavg"`, (err, stdout, stderr) => {
        output = err || stdout || stderr
        return ctx.reply(`${host}\n${output}`)
    })
})

new CronJob('*/10 * * * * *', function() {
    client = new Client()
    client.connect()
    client.query("SELECT count(*),datname FROM pg_stat_activity where procpid <> pg_backend_pid() and current_query='<IDLE>' group by datname", [], (err, res) => {
        if (!err) {
            conn_count = 0
            for (i in res.rows) {
                conn_count += row.count
                row = res.rows[i]
                if (row.count > 99) {
                    console.log(`${row.datname} exceed ${row.count}`)
                    client.query("SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE current_query = '<IDLE>' AND query_start < current_timestamp - interval '30 sec'", (err, res) => {
                        console.log(res)
                    })
                } else {
                    console.log(`${row.datname}=${row.count}`)
                }
            }
        } else {
            console.err(err.stack)
        }
        client.end()
    })
}, null, true, 'Asia/Shanghai')

bot.startPolling()
