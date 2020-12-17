const puppeteer = require("puppeteer");

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.ufc.com/", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector('[title="Accept Cookies Button"]', {
      timeout: 4000,
    });
    await page.click('[title="Accept Cookies Button"]');

    await autoScroll(page);

    await page.waitForSelector("#block-ufc-localization", { timeout: 4000 });

    await page.click("#block-ufc-localization");

    await page.click('a[href="https://www.ufc.com/language/switch/en"]');

    await page.waitForSelector('a[href="/rankings"]', { timeout: 4000 });

    await page.click('a[href="/rankings"]');

    await page.waitForSelector("div.view-grouping");

    const columnsHandle = await page.$$("div.view-grouping");

    for (const column of columnsHandle) {
      const divisionName = await column.$eval(
        ".rankings--athlete--champion>.info>h4",
        (x) => x.textContent
      );
      console.log(divisionName);
      const fighters = await column.$$eval('a[href^="/athlete/"]', (nodes) =>
        nodes.map((n) => n.innerHTML)
      );
      console.log(fighters);
    }

    await browser.close();
  } catch (error) {
    console.error(error);
    if (browser && browser.isConnected()) {
      browser.close();
    }
  }
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
