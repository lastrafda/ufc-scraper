const { cleaner, cleanString } = require("../ccleaner");
const { data } = require("../output.json");
const menp4p = require("./data/menp4p.json");

let khabib;
let cleanedMen4p4;
beforeEach(() => {
  [cleanedMen4p4] = cleaner(data);
  [khabib] = menp4p.fighters;
});

describe("Cleaner Ranks", () => {
  test("it can clean the division name", () => {
    expect(cleanedMen4p4.division).toBe(menp4p.division);
  });

  test("it can clean the fighters description", () => {
    let cleanedKhabib = cleanedMen4p4.fighters[0];
    expect(cleanedKhabib.nickname).toEqual(khabib.nickname);
    expect(cleanedKhabib.fullname).toEqual(khabib.fullname);
    expect(cleanedKhabib.description).toEqual(khabib.description);
  });

  test('it can clean the fighters "promoted" section', () => {
    let cleanedKhabib = cleanedMen4p4.fighters[0];
    [
      expectedWinStreak,
      expectedWinsByKnockout,
      expectedWinsBySubmission,
    ] = khabib.promoted;
    [winStreak, winsByKnockout, winsBySubmission] = cleanedKhabib.promoted;
    expect(winStreak).toEqual(expectedWinStreak);
    expect(winsByKnockout).toEqual(expectedWinsByKnockout);
    expect(winsBySubmission).toEqual(expectedWinsBySubmission);
  });
});

describe("General Strings cleaner", () => {
  test("it can remove \\n and trim a string", () => {
    expect(cleanString('\n  \n      "The Eagle"\n  ')).toBe("The Eagle");
  });
});
