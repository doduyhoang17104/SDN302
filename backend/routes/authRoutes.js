const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController")

router.post("/register",authController.register)
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 */
router.post("/login",authController.login)

router.post("/forgot-password",authController.forgotPassword)

router.post("/verify-otp",authController.verifyOTP)

router.post("/reset-password",authController.resetPassword)

router.post("/refresh-token", authController.refreshToken)

module.exports = router