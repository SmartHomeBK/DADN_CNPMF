import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password
 *     tags:
 *       - Authentication
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
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(401).json({
        success: false,
        message: "Please Provide All Details",
      });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    const checkPassword = await user.comparePassword(password);
    console.log("result from check password: ", checkPassword);
    if (!checkPassword)
      return res.status(401).json({
        success: false,
        message: "Password is wrong",
      });
    generateToken(user, "Login Successfully", 200, res);
  } catch (error) {
    console.log("error  in login: ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const checkAuth = async (req, res) => {
  res.status(200).json({
    message: "Authorized!",
    data: req.user,
  });
};
export const logOut = async (req, res) => {
  res
    .status(201)
    .cookie("UserToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
    });
};
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User registration
 *     description: Create a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Signup successful
 *       400:
 *         description: Email already exists
 *       401:
 *         description: Missing details
 *       500:
 *         description: Internal server error
 */
export const SignUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    console.log(req.body);
    if (!email || !name || !password) {
      return res.status(401).json({
        success: false,
        message: "Please Provide All Details",
      });
    }
    const result = await User.findOne({
      email,
    });
    if (result)
      return res.status(400).json({
        success: false,
        message: "Email is already exist",
      });

    const user = await User.create(req.body);
    console.log("kết quả sau khi tạo User mới trong SignUp: " + user);
    res.json({
      success: true,
      message: "Sign Up Successfully!",
    });
  } catch (error) {
    console.log("error in  signup: ", error);
    res.status(500).json({
      success: false,
      message: "Error in signup",
    });
  }
};
