const HttpsProxyAgent = require('https-proxy-agent');
const googleTrends = require('google-trends-api');

let proxyAgent = new HttpsProxyAgent(process.env.HTTP_PROXY);

let query = {
    keyword: ['wish', 'amazon', 'alibaba'],
    hl: 'zh',
    agent: proxyAgent
};

googleTrends.interestOverTime(query)
    .then(function (results) {
        console.log('These proxied results are incredible', results);
    })
    .catch(function (err) {
        console.error('Oh no there was an error, double check your proxy settings', err);
    });