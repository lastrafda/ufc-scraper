const fs = require("fs");
const { cleaner } = require("./ccleaner");
const { data } = require("./output.json");

fs.writeFile(
  "cleanedOutput.json",
  JSON.stringify(cleaner(data)),
  "utf8",
  (err) => {
    if (err) {
      throw err;
    }
    console.log("The file has been saved! :D ");
  }
);
