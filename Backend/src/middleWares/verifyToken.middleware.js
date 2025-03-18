import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const isUserAuthenticated = async (req, res, next) => {
  try {
    console.log("cookie of user: ", req.cookies);
    const token = req.cookies.UserToken;
    console.log("token user: ", token);
    if (!token) {
      return res.status(301).json({
        success: false,
        message: "User Is Not Authenticated !",
      });
    }

    //Nếu như token hợp lệ thì nó sẽ trả về payload tức data được mã hóa trong token đó.
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(401).json({ message: "Token is not valid!" });
      console.log("decoded data: ", decoded);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    });
  } catch (error) {
    console.log("error in veryToken: ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
