const express = require('express')
const app = express()
const { exec } = require('child_process')

app.get('/', function (req, res) {
    exec(`/root/git_dh_wiki.sh`, (err, stdout, stderr) => {
        res.send(err || stderr || `done`)
    })
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("http://%s:%s", host, port)

})