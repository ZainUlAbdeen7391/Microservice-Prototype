const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');

function getData() {
  const raw = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(raw);
}

module.exports = { getData };
