export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  console.log("token: ", token);
  //Lưu ý là cookieName nếu giống nhau thì cái cũ sẽ bị ghi đè.

  res
    .status(statusCode)
    .cookie("UserToken", token, {
      //expire thì xét dạng ngày tháng, còn maxAge thì xét dạng giây

      // httpOnly: true, //dùng để chặn kiểu attack XSS. Tức là chỉ có request HTTP mới lấy được cookie, nếu xét bằng false thì người ta có thể dùng devtool rồi gõ document.cookie sẽ cho ra cookie luôn
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      sameSite: "strict", // ngặn chặn việc web khác site gửi yêu cầu có đính kèm cookie khi đã xác thực ,
      secure: process.env.NODE_ENV !== "DEVELOPMENT", // CHỈ ĐƯỢC GỬI COOKIE NẾU LÀ https nếu secure là true
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
