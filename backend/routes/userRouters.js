const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
const verifyToken = require("../middleware/verifyToken")
const verifyAdmin = require("../middleware/verifyAdmin")

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", verifyToken, userController.updateProfile)

/**
 * @swagger
 * /user/list:
 *   get:
 *     summary: Lấy danh sách tất cả user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       403:
 *         description: Không có quyền admin
 */
router.get("/list", verifyToken, verifyAdmin, userController.getAllUsers)

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Xóa user theo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy user
 */
router.delete("/:id", verifyToken, verifyAdmin, userController.deleteUser)

module.exports = router