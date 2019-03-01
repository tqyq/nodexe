process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

var WPAPI = require( 'wpapi' )

var wp = new WPAPI({
    endpoint: process.env.WP_JSON,
    username: process.env.WP_USER,
    password: process.env.WP_PWD
})

wp.posts().create({
    title: '寒食',
    content: `<a href="/tag/唐代">唐代</a>：<a href="/tag/韩翃">韩翃</a>

春城无处不飞花，寒食东风御柳斜。
日暮汉宫传蜡烛，轻烟散入五侯家。`,
//    status: 'publish'
    status: 'draft'
}).then(function( response ) {
    console.log(response.id)
})