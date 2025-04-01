class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleWare = (err, req, res, next) => {
  console.log("bạn đang vào errormiddleware!, lỗi là: ", err.message);
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
    // console.log("bạn vào lỗi 1!");
  }
  if (err.name === "JsonWebTokenError") {
    const message = "Json Web Token is invalid, Try again !";
    err = new ErrorHandler(message, 400);
    // console.log("bạn vào lỗi 1!");
  }
  if (err.name === "TokenExpiredError") {
    const message = "Json Web Token is expired, Try again !";
    err = new ErrorHandler(message, 400);
    // console.log("bạn vào lỗi 1!");
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
    // console.log("bạn vào lỗi 1!");
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
export default ErrorHandler;
