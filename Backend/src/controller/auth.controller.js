import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.sta(401).json({
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
        message: "Passwrord is wrong",
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
