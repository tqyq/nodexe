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
    title: 'Your Post Title',
    content: 'Your post content',
//    status: 'publish'
    status: 'draft'
}).then(function( response ) {
    console.log(response.id)
})