const { cleaner, cleanString } = require("../ccleaner");
const { data } = require("../output.json");
const menp4p = require("./data/menp4p.json");
/**
 * toMatchObject(menp4p)
 */
//I'll rename the tests later.
describe("Cleaner Ranks", () => {
  test("it can clean the fighters description", () => {
    const { fighters } = menp4p;
    const [khabib] = fighters;
    [cleanedMen4p4] = cleaner(data);
    expect(cleanedMen4p4.division).toBe("Men's Pound-for-Pound Top Rank");
    expect(cleanedMen4p4.fighters[0].nickname).toEqual(khabib.nickname);
    expect(cleanedMen4p4.fighters[0].fullname).toEqual(khabib.fullname);
    expect(cleanedMen4p4.fighters[0].description).toEqual(khabib.description);
  });
});

describe("General Strings cleaner", () => {
  test("it can remove \\n and trim a string", () => {
    expect(cleanString('\n  \n      "The Eagle"\n  ')).toBe("The Eagle");
  });
});
