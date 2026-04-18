const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/userAuth");
const userController = require("../Controllers/userController");

router.get("/verify", auth, userController.userVerify);
/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify logged-in user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User verification status
 *         content:
 *           application/json:
 *             example:
 *               loggedIn: true
 *               user:
 *                 _id: "user_id"
 *                 fullName: "abcd"
 *                 email: "abcd@gmail.com"
 */

router.post("/address", auth, userController.addAddress);
/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Add user address
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             line: "Street 123"
 *             nearBy: "Near Mall"
 *             city: "Jaipur"
 *             state: "Rajasthan"
 *             code: "302001"
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.delete("/deleteAddress/:id", auth, userController.deleteAddress);
/**
 * @swagger
 * /user/deleteAddress/{id}:
 *   delete:
 *     summary: Delete user address
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Address ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */

router.get("/cart", auth, userController.getCart);
/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: Get user cart products
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               cart:
 *                 - product: "product_id"
 *                   quantity: 2
 */
router.delete("/cart/:productId", auth, userController.removeCartProduct);
/**
 * @swagger
 * /user/cart/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from cart
 */

router.post("/addForOrder", auth, userController.addForOrder);
/**
 * @swagger
 * /user/addForOrder:
 *   post:
 *     summary: Prepare order before checkout
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             items:
 *               - productId: "product_id"
 *                 quantity: 2
 *                 variant:
 *                   size: "M"
 *                   price: 1000
 *                   discount: 10
 *                   finalPrice: 900
 *             orderTotal: 1800
 *     responses:
 *       200:
 *         description: Order prepared successfully
 */
router.get("/checkoutInfo", auth, userController.checkoutProduct);
/**
 * @swagger
 * /user/checkoutInfo:
 *   get:
 *     summary: Get checkout product information
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Checkout details fetched
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 currentOrderObj:
 *                   items: []
 *                   totalAmount: 2000
 */

router.patch("/update", auth, userController.update);
/**
 * @swagger
 * /user/update:
 *   patch:
 *     summary: Update user data
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             action: "update"
 *             field: "cart"
 *             match: "item_id"
 *             data:
 *               quantity: 2
 */

router.put("/profile", auth, userController.updateProfile);
/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     description: Update logged-in user's profile details (name, email, mobile number, password)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Yuvraj Khatri
 *               email:
 *                 type: string
 *                 example: yuvraj@email.com
 *               mobileNo:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     mobileNo:
 *                       type: string
 *       401:
 *         description: Unauthorized (No token or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

module.exports = router;