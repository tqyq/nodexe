const HttpsProxyAgent = require('https-proxy-agent');
const googleTrends = require('google-trends-api');

let proxyAgent = new HttpsProxyAgent(process.env.HTTP_PROXY);

let query = {
    keyword: 'shopify',
    hl: 'zh',
    agent: proxyAgent
};

googleTrends.autoComplete(query)
    .then(function (results) {
        console.log(results);
    })
    .catch(function (err) {
        console.error(err);
    })