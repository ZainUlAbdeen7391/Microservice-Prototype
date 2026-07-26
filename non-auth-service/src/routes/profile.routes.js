const express = require('express');
const profileController = require('../controller/profile.controller');

const router = express.Router();

/**
 * @openapi
 * /get-profile:
 *   get:
 *     summary: Retrieve the profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile  has been retrieved successfully
 */
router.get('/get-profile', profileController.getProfile);

/**
 * @openapi
 * /update-profile:
 *   put:
 *     summary: Update the profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile has been updated successfully
 */
router.put('/update-profile', profileController.updateProfile);

module.exports = router;
