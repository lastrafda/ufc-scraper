const fs = require("fs");

const cleaner = (rankings) => {
  const holder = [];
  rankings.forEach((rank) => {
    holder.push({
      division: cleanString(rank.division),
      fighters: rank.fighters.map((fighter) => {
        return fighter.setDescription().setPromotedInfo().setStats();
      }),
    });
  });
  return holder;
};
// how can I make it so I can use functions like this ?
// fighters.map(f => f.setDescription().setPromo().setStats().setBlah())
// that would be beautiful...
// const setDescription = (fighter) => {
//   return {
//     ...fighter,
//     nickname: cleanString(fighter.nickname),
//     fullname: cleanString(fighter.fullname),
//     description: cleanString(fighter.description),
//   };
// };

const cleanString = (text) => {
  if (typeof text === "undefined") {
    return "";
  }
  return text.replace(/\"/g, "").replace(/\s+/g, " ").trim();
};

const parseValueAndPercentageText = (text) => {
  [value, percentage] = text.split(" ");
  return {
    value: parseInt(value, 10) || 0,
    percentage: percentage.replace(/[()]/g, ""),
  };
};

if (!Object.prototype.setDescription) {
  Object.prototype.setDescription = function () {
    return {
      ...this,
      nickname: cleanString(this.nickname),
      fullname: cleanString(this.fullname),
      description: cleanString(this.description),
    };
  };
}

if (!Object.prototype.setPromotedInfo) {
  Object.prototype.setPromotedInfo = function () {
    const promotedInfo = [...this.promoted];
    let cleanedPromo = [];
    for (const promo of promotedInfo) {
      cleanedPromo.push({
        label: cleanString(promo.label),
        value: parseInt(promo.value, 10) || 0,
      });
    }
    return {
      ...this,
      promoted: cleanedPromo,
    };
  };
}

Object.prototype.setStats = function () {
  const stats = { ...this.stats };
  return {
    ...this,
    stats: {
      sigStrikesAttempted: parseInt(stats.sigStrikesAttempted, 10) || 0,
      sigStrikesLanded: parseInt(stats.sigStrikesLanded, 10) || 0,
      takedownsAttempted: parseInt(stats.takedownsAttempted, 10) || 0,
      takedownsLanded: parseInt(stats.takedownsLanded, 10) || 0,
      sigStrikesLandedPerMin:
        Number(cleanString(stats.sigStrikesLandedPerMin)) || 0,
      sigStrikesAbsorbedPerMin:
        Number(cleanString(stats.sigStrikesAbsorbedPerMin)) || 0,
      takedownAvgPerFifteen:
        Number(cleanString(stats.takedownAvgPerFifteen)) || 0,
      submissionAvgPerFifteen:
        Number(cleanString(stats.submissionAvgPerFifteen)) || 0,
      sigStrikeDefence: cleanString(stats.sigStrikeDefence).replace(/\s/, ""),
      takedownDefence: cleanString(stats.takedownDefence).replace(/\s/, ""),
      knockdownRatio: Number(cleanString(stats.knockdownRatio)) || 0,
      avgFightTime: cleanString(stats.avgFightTime),
      sigStrikesByPosition: {
        standing: parseValueAndPercentageText(
          stats.sigStrikesByPosition.standing
        ),
        clinch: parseValueAndPercentageText(stats.sigStrikesByPosition.clinch),
        ground: parseValueAndPercentageText(stats.sigStrikesByPosition.ground),
      },
      sigStrikeByTarget: {
        head: {
          value: parseInt(stats.sigStrikeByTarget.head.value, 10) || 0,
          percentage: stats.sigStrikeByTarget.head.percentage,
        },
        body: {
          value: parseInt(stats.sigStrikeByTarget.body.value, 10) || 0,
          percentage: stats.sigStrikeByTarget.body.percentage,
        },
        leg: {
          value: parseInt(stats.sigStrikeByTarget.leg.value, 10) || 0,
          percentage: stats.sigStrikeByTarget.leg.percentage,
        },
      },
      winByWay: {
        koTko: parseValueAndPercentageText(stats.winByWay.koTko),
        dec: parseValueAndPercentageText(stats.winByWay.dec),
        sub: parseValueAndPercentageText(stats.winByWay.sub),
      },
    },
  };
};

module.exports = { cleaner, cleanString, parseValueAndPercentageText };
