import React from "react";
import CustomInput from "../../hooks/customInput.jsx";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "./../../scss/pages/_Login.scss";
import { useFormik } from "formik";
import { notiValidation } from "../../common/notiValidation.js";
import { axiosInstance } from "../../util/http.js";
const SignUp = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, handleBlur, handleSubmit, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
        name: "",
      },
      onSubmit: async (values) => {
        try {
          console.log(values);
          const result = await axiosInstance.post("/auth/signup", values);
          // localStorage.setItem("UserToken",result.)
          console.log("result from signup: ", result);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } catch (error) {
          console.log("error in signup: ", error);
        }
      },
      validationSchema: yup.object({
        password: yup
          .string()
          .required(notiValidation.empty)
          .matches(
            /^(?=.*[A-Z])(?=.*\d).+$/,
            "Vui lòng nhập ít nhất 1 chữ cái viết hoa và 1 chữ số"
          ),

        email: yup
          .string()
          .required(notiValidation.empty)
          .email("Invalid email format"),

        name: yup.string().required(notiValidation.empty),
      }),
    });

  return (
    <div className="login flex justify-center items-center">
      <div className="container">
        <div className="login_content w-[1400px] mx-auto">
          <div className="login_title text-center mb-8">
            <h1 className="text-[64px] font-semibold">SMART HOME</h1>
          </div>
          <div className="bottom_login flex justify-center items-center gap-4 mb-3">
            <div className="image_login w-[929px] h-[619px]">
              <img
                src="/login/loginImage.jpg"
                alt="loginimage"
                className="h-full object-cover"
              />
            </div>
            <div className="login_form bg-[#E7C9C9] h-[619px] w-[392px] rounded-md ">
              <div className="login_form_content">
                <div className="login_form_content_title text-center">
                  <h1 className="text-black font-bold text-4xl mt-11 mb-14">
                    SIGN UP
                  </h1>
                </div>
                <form onSubmit={handleSubmit} action="">
                  <div className="form_inputs flex flex-col justify-around items-center gap-6">
                    <CustomInput
                      placeholder={"Your email ..."}
                      name={"email"}
                      classWrapper="w-[323px] h-[55px]"
                      value={values.email}
                      onChange={handleChange}
                      error={errors.email}
                      onBlur={handleBlur}
                      touched={touched.email}
                    />
                    <CustomInput
                      placeholder={"Your name ..."}
                      name={"name"}
                      classWrapper="w-[323px] h-[55px]"
                      value={values.name}
                      onChange={handleChange}
                      error={errors.name}
                      onBlur={handleBlur}
                      touched={touched.name}
                    />
                    <CustomInput
                      placeholder={"Your password ..."}
                      name={"password"}
                      classWrapper="w-[323px] h-[55px]"
                      value={values.password}
                      onChange={handleChange}
                      type="password"
                      error={errors.password}
                      onBlur={handleBlur}
                      touched={touched.password}
                    />
                  </div>
                  <div className="login_button text-center mt-14 ">
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="bg-[#C74888] text-[#3028CF] w-[211px] h-[45px] px-2 py-3 rounded-md hover:bg-[#C74888]/75"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <div
                  className="no_account text-center mt-4 
                  
                "
                >
                  <span>
                    You already have an account?{" "}
                    <Link
                      to={"/login"}
                      className="text-blue-600 hover:underline"
                    >
                      Login now
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
