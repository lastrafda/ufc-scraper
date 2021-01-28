const puppeteer = require("puppeteer");
const fs = require("fs");
// might consider to: 1) update to playwright 2) use ts.
(async () => {
  let browser;
  const baseUrl = "https://www.ufc.com/";
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(baseUrl, {
      waitUntil: "networkidle2",
    });
    await clearPage(page);

    await autoScroll(page);

    await page.waitForSelector("#block-ufc-localization", { timeout: 4000 });

    await page.click("#block-ufc-localization");

    await page.click('a[href="https://www.ufc.com/language/switch/en"]');

    await page.waitForSelector('a[href="/rankings"]', { timeout: 4000 });

    await page.click('a[href="/rankings"]');

    await page.waitForSelector("div.view-grouping", { timeout: 5000 });

    const columnsHandle = await page.$$("div.view-grouping");

    let output = { data: [] };
    let columnIndex = 0;

    for (const column of columnsHandle) {
      const divisionName = await column.$eval(
        ".rankings--athlete--champion>.info>h4",
        (x) => x.textContent
      );
      output.data.push({ division: divisionName });
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
        let heroImg = await fighterPage.$eval(".c-hero__image", (img) =>
          img.getAttribute("src")
        );

        let bioImg = await fighterPage.$eval(".c-bio__image>img", (img) =>
          img.getAttribute("src")
        );

        /**
         * Get the promo record of every fighter
         */
        await fighterPage
          .waitForSelector(".c-record__promoted-figure", {
            timeout: 4000,
          })
          .catch(() => console.log(`${fullname} does not have promo data`));

        // I have to use general names because they are not always the same
        // A fighter might have 0 ,1,2,3,...n promoted  texts, there are usually 2 or 3 AFAIK
        const [
          firstPromotedValue,
          secondPromotedValue,
          thirdPromotedValue,
        ] = await fighterPage.$$eval(".c-record__promoted-figure", (nodes) =>
          nodes.map((n) => n.textContent)
        );

        const [
          firstPromotedText,
          secondPromotedText,
          thirdPromotedText,
        ] = await fighterPage.$$eval(".c-record__promoted-text", (nodes) =>
          nodes.map((n) => n.textContent)
        );

        /**
         * Get the stats of every fighter.
         */
        await fighterPage
          .waitForSelector(".c-overlap__stats-value", {
            timeout: 6000,
          })
          .catch(() => console.log(`${fullname} doesn't have stats`));
        const [
          sigStrikesLanded,
          sigStrikesAttempted,
          takedownsLanded,
          takedownsAttempted,
        ] = await fighterPage.$$eval(".c-overlap__stats-value", (dts) =>
          dts.map((dt) => dt.textContent)
        );

        // Lets click the 'Show Stats' button
        await fighterPage.waitForSelector(
          ".stats-button__wrapper>.e-button--white",
          {
            timeout: 4000,
          }
        );
        await fighterPage.click(".stats-button__wrapper>.e-button--white");
        // let's get the sig strikes, takedown/submission data.
        await fighterPage.waitForSelector(".c-stat-compare__number", {
          timeout: 4000,
        });
        // weird name (stat_numbers) but ok
        const [
          sigStrikesLandedPerMin,
          sigStrikesAbsorbedPerMin,
          takedownAvgPerFifteen,
          submissionAvgPerFifteen,
          sigStrikeDefence,
          takedownDefence,
          knockdownRatio,
          avgFightTime,
        ] = await fighterPage.$$eval(
          ".c-stat-compare__number",
          (stat_numbers) =>
            stat_numbers.map((x) => {
              return x.textContent;
            })
        );

        // Get the third row of the stats section (bar charts and body charts)
        // Sig Strikes by Position and wins by way
        await fighterPage.waitForSelector(".c-stat-3bar__value", {
          timeout: 4000,
        });
        const [
          standing,
          clinch,
          ground,
          koTko,
          dec,
          sub,
        ] = await fighterPage.$$eval(".c-stat-3bar__value", (nodes) =>
          nodes.map((n) => n.textContent)
        );
        // Sig strikes by target
        const headNumber = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_head_value",
          (n) => n.textContent
        );
        const bodyNumber = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_body_value",
          (n) => n.textContent
        );
        const legNumber = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_leg_value",
          (n) => n.textContent
        );
        const headPercentage = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_head_percent",
          (n) => n.textContent
        );
        const bodyPercentage = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_body_percent",
          (n) => n.textContent
        );
        const legPercentage = await fighterPage.$eval(
          "#e-stat-body_x5F__x5F_leg_percent",
          (n) => n.textContent
        );

        let fighter = {
          nickname,
          fullname,
          description,
          heroImg,
          bioImg,
          promoted: [
            {
              label: firstPromotedText,
              value: firstPromotedValue,
            },
            {
              label: secondPromotedText,
              value: secondPromotedValue,
            },
            {
              label: thirdPromotedText,
              value: thirdPromotedValue,
            },
          ],
          stats: {
            sigStrikesAttempted,
            sigStrikesLanded,
            takedownsAttempted,
            takedownsLanded,
            sigStrikesLandedPerMin,
            sigStrikesAbsorbedPerMin,
            takedownAvgPerFifteen,
            submissionAvgPerFifteen,
            sigStrikeDefence,
            takedownDefence,
            knockdownRatio,
            avgFightTime,
            sigStrikesByPosition: {
              standing,
              clinch,
              ground,
            },
            sigStrikeByTarget: {
              head: {
                value: headNumber,
                percentage: headPercentage,
              },
              body: {
                value: bodyNumber,
                percentage: bodyPercentage,
              },
              leg: {
                value: legNumber,
                percentage: legPercentage,
              },
            },
            winByWay: {
              koTko,
              dec,
              sub,
            },
          },
        };
        console.log(fighter);

        if (!output.data[columnIndex].fighters) {
          output.data[columnIndex].fighters = [];
        }
        output.data[columnIndex].fighters.push(fighter);

        await fighterPage.close();
      }
      columnIndex++;
    }
    await browser.close();

    fs.writeFile("output.json", JSON.stringify(output), "utf8", (err) => {
      if (err) {
        throw err;
      }
      console.log("The file has been saved! :D ");
    });
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

async function clearPage(page) {
  try {
    await page.waitForSelector('[title="Accept Cookies Button"]', {
      timeout: 4000,
    });
    await page.click('[title="Accept Cookies Button"]');
  } catch (error) {
    // Do nothing
    console.error("There has been an update on the ufc site, go figure it out");
  }
}
