const {
  cleaner,
  cleanString,
  parseValueAndPercentageText,
} = require("../ccleaner");
const { data } = require("../output.json");
const menp4p = require("./data/menp4p.json");

let khabib;
let cleanedMen4p4;
let cleanedKhabib;
beforeEach(() => {
  [cleanedMen4p4] = cleaner(data);
  cleanedKhabib = cleanedMen4p4.fighters[0];
  [khabib] = menp4p.fighters;
});

describe("Cleaner Ranks", () => {
  test("it can clean the division name", () => {
    expect(cleanedMen4p4.division).toBe(menp4p.division);
  });

  test('it can clean the fighters "description" section', () => {
    expect(cleanedKhabib.nickname).toEqual(khabib.nickname);
    expect(cleanedKhabib.fullname).toEqual(khabib.fullname);
    expect(cleanedKhabib.description).toEqual(khabib.description);
  });

  test('it can clean the fighters "promoted" section', () => {
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

  test('it can clean the fighters "stats" section', () => {
    const {
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
      sigStrikesByPosition,
      sigStrikeByTarget,
      winByWay,
    } = khabib.stats;
    expect(cleanedKhabib.stats.sigStrikesAttempted).toEqual(
      sigStrikesAttempted
    );
    expect(cleanedKhabib.stats.sigStrikesLanded).toEqual(sigStrikesLanded);
    expect(cleanedKhabib.stats.takedownsAttempted).toEqual(takedownsAttempted);
    expect(cleanedKhabib.stats.takedownsLanded).toEqual(takedownsLanded);
    expect(cleanedKhabib.stats.sigStrikesLandedPerMin).toEqual(
      sigStrikesLandedPerMin
    );
    expect(cleanedKhabib.stats.sigStrikesAbsorbedPerMin).toEqual(
      sigStrikesAbsorbedPerMin
    );
    expect(cleanedKhabib.stats.takedownAvgPerFifteen).toEqual(
      takedownAvgPerFifteen
    );
    expect(cleanedKhabib.stats.submissionAvgPerFifteen).toEqual(
      submissionAvgPerFifteen
    );
    expect(cleanedKhabib.stats.sigStrikeDefence).toBe(sigStrikeDefence);
    expect(cleanedKhabib.stats.takedownDefence).toBe(takedownDefence);
    expect(cleanedKhabib.stats.knockdownRatio).toEqual(knockdownRatio);
    expect(cleanedKhabib.stats.avgFightTime).toBe(avgFightTime);
    expect(cleanedKhabib.stats.sigStrikesByPosition).toMatchObject(
      sigStrikesByPosition
    );
    expect(cleanedKhabib.stats.sigStrikeByTarget).toMatchObject(
      sigStrikeByTarget
    );
    expect(cleanedKhabib.stats.winByWay).toMatchObject(winByWay);
  });
});

describe("General Strings cleaner", () => {
  test("it can remove \\n and trim a string", () => {
    expect(cleanString('\n  \n      "The Eagle"\n  ')).toBe("The Eagle");
  });
});

describe("Percentages and Values cleaner", () => {
  test('it can generate a {value,percentage} object from a "XX (X%)" string', () => {
    expect(parseValueAndPercentageText("263 (40%)")).toMatchObject({
      value: 263,
      percentage: "40%",
    });
  });
});
