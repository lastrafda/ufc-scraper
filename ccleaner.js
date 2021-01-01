const cleaner = (rankings) => {
  const holder = [];
  const i = 0;
  rankings.forEach((rank) => {
    holder.push({
      division: cleanString(rank.division),
      fighters: rank.fighters.map((fighter) => {
        // I can't give it a specific name because itsn't fixed, deal with it...
        let [firstPromo, secondPromo, thirdPromo] = fighter.promoted;
        // lets add the "promoted" section
        // @TODO: refactor this big boi into smaller functions
        return {
          nickname: cleanString(fighter.nickname),
          fullname: cleanString(fighter.fullname),
          description: cleanString(fighter.description),
          promoted: [
            {
              label: cleanString(firstPromo.label),
              value: parseInt(firstPromo.value, 10),
            },
            {
              label: cleanString(secondPromo.label),
              value: parseInt(secondPromo.value, 10),
            },
            {
              label: cleanString(thirdPromo.label),
              value: parseInt(thirdPromo.value, 10),
            },
          ],
        };
      }),
    });
  });
  return holder;
};

const cleanString = (text) => {
  if (typeof text === "undefined") {
    return "";
  }
  return text.replace(/\"/g, "").replace(/\s+/g, " ").trim();
};

module.exports = { cleaner, cleanString };
