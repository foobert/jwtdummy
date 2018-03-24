const fs = require("fs");
const { markdown } = require("markdown");

const readme = fs.readFileSync("README.md", "utf-8");
const html = markdown.toHTML(readme);

module.exports = function(req, res) {
  res.type("html");
  res.send(html);
};
