const categoryService = require('../service/category.service');

function getData(req, res) {
  res.json(categoryService.getData());
}

module.exports = { getData };
