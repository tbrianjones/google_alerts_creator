const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function create_alerts(username, password, alertsList) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const ua = await browser.userAgent();
    console.log(ua);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    );

    await page.goto('https://accounts.google.com');
    console.log('==> page has been loaded..');
    const usernameField = 'input[type="email"]';

    const alertField = 'input[type="text"]';

    await page.waitForSelector('input[type="email"]');
    await page.type(usernameField, username, { delay: 100 });
    console.log('==> username done...');
    await sleep(800);
    page.click('#identifierNext');

    await sleep(800);
    const passwordField = 'input[type="password"]';
    console.log('==> searching for password field.');

    await page.waitForSelector('input[type="password"]', { visible: true });

    await page.type(passwordField, password, { delay: 100 });
    console.log('==> password done..');

    await sleep(800);
    await page.click('#passwordNext');

    // const nextLink = await page.$x("//span[contains(text(), 'Next')]");

    // await nextLink[0].click();

    await sleep(800);
    console.log('==> you are logged in, woho');

    await page.goto('https://google.com/alerts');

    let min = 80;
    var max = 160;

    let min_n = 1000;
    var max_n = 1500;

    let random_num = Math.floor(Math.random() * (+max - +min)) + +min;

    for (var i = 0; i < alertsList.length; i++) {
      let random_num = Math.floor(Math.random() * (+max - +min)) + +min;
      let random = Math.floor(Math.random() * (+max_n - +min_n)) + +min_n;

      await page.waitFor(alertField).then(() => {});

      await page.type(alertField, alertsList[i], { delay: random_num });

      const addAlert = await page.$x("//span[@id='create_alert']");

      addAlert[0].click();

      await sleep(random);
    }

    await browser.close();
  })();
}

module.exports = {
  create_alerts: create_alerts
};
