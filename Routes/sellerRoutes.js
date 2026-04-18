const express = require("express");
const router = express.Router();
const sellerController = require("../Controllers/sellerController");
const auth = require("../Middlewares/Authentication");

router.post("/signup", sellerController.signup);
/**
 * @swagger
 * /auth/seller/signup:
 *   post:
 *     summary: Seller Signup
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             sellerName: "Yuvraj"
 *             firmName: "YK Store"
 *             email: "seller@gmail.com"
 *             password: "123456"
 *             mobileNo: "9876543210"
 *             address: "Jaipur"
 *             state: "Rajasthan"
 *             accountNo: "1234567890"
 *             branchName: "SBI Jaipur"
 *     responses:
 *       201:
 *         description: Seller registered successfully
 */

router.post("/login", sellerController.login);
/**
 * @swagger
 * /auth/seller/login:
 *   post:
 *     summary: Seller Login
 *     tags: [Seller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "seller@gmail.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               result: true
 *               token: "jwt_token"
 *               seller:
 *                 _id: "seller_id"
 *                 sellerName: "Yuvraj"
 *                 firmName: "YK Store"
 */

router.post("/logout", sellerController.logout);
/**
 * @swagger
 * /seller/logout:
 *   post:
 *     summary: Seller Logout
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Logout successful
 */

router.get("/verify", auth, sellerController.verify);
/**
 * @swagger
 * /seller/verify:
 *   get:
 *     summary: Verify logged-in seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller verification status
 *         content:
 *           application/json:
 *             example:
 *               loggedIn: true
 *               seller:
 *                 _id: "seller_id"
 *                 sellerName: "Yuvraj"
 *                 firmName: "YK Store"
 *                 email: "seller@gmail.com"
 */

router.get("/products", auth, sellerController.getProducts);
/**
 * @swagger
 * /seller/products:
 *   get:
 *     summary: Get all products of seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Seller products fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               loggedIn: true
 *               seller:
 *                 products: []
 */

router.get("/orders", auth, sellerController.recievedOrders);
/**
 * @swagger
 * /seller/orders:
 *   get:
 *     summary: Get orders received by seller
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               seller:
 *                 orders: []
 */

router.put("/profile", auth, sellerController.updateProfile);
/**
 * @swagger
 * /seller/profile:
 *   put:
 *     summary: Update seller profile
 *     description: Update logged-in seller's profile details like name, firm name, email, mobile number, and password
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sellerName:
 *                 type: string
 *                 example: Yuvraj Traders
 *               firmName:
 *                 type: string
 *                 example: Khatri Enterprises
 *               email:
 *                 type: string
 *                 example: seller@email.com
 *               mobileNo:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Seller profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 seller:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     sellerName:
 *                       type: string
 *                     firmName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */

module.exports = router;