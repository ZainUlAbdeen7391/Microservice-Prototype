const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Log in with an email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 encryptedPassword:
 *                   type: object
 *                   properties:
 *                     encryptedData:
 *                       type: string
 *                     authTag:
 *                       type: string
 *       400:
 *         description: email or password missing
 */
router.post('/login', authController.login);

module.exports = router;
