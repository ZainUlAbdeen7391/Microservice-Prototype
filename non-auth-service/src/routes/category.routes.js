const express = require('express');
const dataController = require('../controller/category.controller');

const router = express.Router();

/**
 * @openapi
 * /get-category:
 *   get:
 *     summary: Get data from the JSON file
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: JSON file contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-category', dataController.getData);

module.exports = router;
