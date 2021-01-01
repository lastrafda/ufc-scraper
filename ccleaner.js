const cleaner = (rankings) => {
  const holder = [];
  const i = 0;
  rankings.forEach((rank) => {
    holder.push({
      division: cleanString(rank.division),
      fighters: rank.fighters.map((fighter) => {
        return {
          nickname: cleanString(fighter.nickname),
          fullname: cleanString(fighter.fullname),
          description: cleanString(fighter.description),
        };
      }),
    });
  });
  return holder;
};

const cleanString = (text) => {
  return text.replace(/\"/g, "").replace(/\s+/g, " ").trim();
};

console.log(
  cleanString(
    "\n                                Lightweight Champion\n              • \n                            28-0-0 (W-L-D)\n    \n          "
  )
);
module.exports = { cleaner, cleanString };
