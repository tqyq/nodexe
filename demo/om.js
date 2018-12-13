var args = process.argv.slice(2)
var url = args[0]
var name = args[1]

const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
	args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation()
  await page.goto(url);

  await page.waitForSelector('.admin-content > .am-container > .am-form > .am-form-group:nth-child(2) > .am-u-sm-2')
  await page.click('.admin-content > .am-container > .am-form > .am-form-group:nth-child(2) > .am-u-sm-2')
  await page.waitForSelector('input[name="name"]')
  await page.type('input[name="name"]',name)

  await page.waitForSelector('.am-container > .am-form > .am-form-group > .am-u-sm-10 > .am-checkbox-inline:nth-child(1)')
  await page.click('.am-container > .am-form > .am-form-group > .am-u-sm-10 > .am-checkbox-inline:nth-child(1)')

  await page.waitForSelector('.am-container > .am-form > .am-form-group > .am-u-sm-10 > .am-checkbox-inline:nth-child(2)')
  await page.click('.am-container > .am-form > .am-form-group > .am-u-sm-10 > .am-checkbox-inline:nth-child(2)')

  await page.waitForSelector('.am-container > .am-form > .am-form-group > .am-u-sm-5 > #submit')
  await page.click('.am-container > .am-form > .am-form-group > .am-u-sm-5 > #submit')

  await navigationPromise
  await page.waitFor(3000)
  await page.screenshot({path: 'om.png'});

  await browser.close();
})();