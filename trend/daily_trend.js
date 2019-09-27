const HttpsProxyAgent = require('https-proxy-agent');
const googleTrends = require('google-trends-api');

let proxyAgent = new HttpsProxyAgent(process.env.HTTP_PROXY);

let query = {
    keyword: ['wish', 'amazon', 'alibaba'],
    hl: 'zh',
    agent: proxyAgent
};

googleTrends.dailyTrends({
    trendDate: new Date('2019-9-27'),
    geo: 'US',
    hl: 'zh',
    agent: proxyAgent
}, function (err, results) {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
});