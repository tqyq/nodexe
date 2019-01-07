var fs = require('fs');
var file = '/data/saas_data_sample.json';
var request = require('request');

function dh_alert(word) {
    var options = {
      uri: process.env.DH_ALERT_BOT,
      method: 'POST',
      json: {"msgtype": "text", "text": { "content": word } }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)
      }
    });
//    console.log(word)
}

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log(err);
    data = '[]'
  }
  data = JSON.parse(data);
  fail = 'sass_data.fail'
  if (!data.msg || data.msg.length != 50) {
    if (fs.existsSync(fail)) {
        console.warn('SAAS data 接口尚未恢复')
    } else {
        dh_alert('SAAS data 接口发生故障')
        fs.openSync(fail, 'w');
    }

  } else {
    console.log('SAAS data 接口正常')
    if (fs.existsSync(fail)) {
        fs.unlinkSync(fail)
        dh_alert('SAAS data 接口恢复正常')
    }
  }
});

