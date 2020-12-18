const puppeteer = require("puppeteer");

(async () => {
  let browser;
  const baseUrl = "https://www.ufc.com/";
  try {
    browser = await puppeteer.launch({ headless: false, slowMo: 250 });
    const page = await browser.newPage();
    await page.goto(baseUrl, {
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
      const fightersUrl = await column.$$eval('a[href^="/athlete/"]', (nodes) =>
        nodes.map((n) => n.getAttribute("href"))
      );
      for (const fighterUrl of fightersUrl) {
        let fighterPage = await browser.newPage();
        await fighterPage.goto(
          `${baseUrl.slice(0, baseUrl.length - 1)}${fighterUrl}`,
          { waitUntil: "networkidle2" }
        );
        await fighterPage.waitForSelector(".c-hero__headline-suffix", {
          timeout: 4000,
        });
        await fighterPage
          .waitForSelector(".field-name-nickname", {
            timeout: 4000,
          })
          .catch((e) =>
            console.log(
              `This fighter does not have a nickname. \nError: ${e.message}`
            )
          );
        let nickname = await fighterPage
          .$eval(".field-name-nickname", (div) => div.textContent)
          .catch(() => "");
        await fighterPage.waitForSelector(".field-name-name", {
          timeout: 4000,
        });
        let fullname = await fighterPage.$eval(
          ".field-name-name",
          (div) => div.textContent
        );
        await fighterPage.waitForSelector(".c-hero__headline-suffix", {
          timeout: 4000,
        });
        let description = await fighterPage.$eval(
          ".c-hero__headline-suffix",
          (div) => div.textContent
        );
        console.log("nickname", nickname);
        console.log("fullname", fullname);
        console.log("description", description);
        await fighterPage.close();
      }
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
