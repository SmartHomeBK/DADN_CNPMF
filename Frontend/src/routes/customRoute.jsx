import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/Login/Login.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";
import Statistics from "../pages/Statistics.jsx";
import TemperatureDetails from "../pages/TemperatureDetails.jsx";
import HumidityDetails from "../pages/HumidityDetails.jsx";
import LightIntensityDetails from "../pages/LightIntensityDetails.jsx";
import ControlDevices from "../pages/ControlDevices.jsx";
import Scheduler from "../pages/Scheduler.jsx";
import HomeTemplate from "../templates/HomeTemplate.jsx";
import { useEffect } from "react";
import { axiosInstance } from "../util/http.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, setIsCheckingAuth, setUser } from "../redux/authSlice.js";
import UserInformation from "../components/UserInformation.jsx";
const customRoute = () => {
  const dispatch = useDispatch();
  const { isAuth, isCheckingAuth } = useSelector((state) => state.auth);
  const checkAuth = async () => {
    try {
      dispatch(setIsCheckingAuth(true));
      const res = await axiosInstance.get("/auth/check-auth");
      dispatch(setIsAuth(true));
      dispatch(setUser(res.data.data));
      console.log("res in checkAuth function in customeRoute!!!: ", res);
    } catch (error) {
      console.log("error in checkAuth in customeRoute: ", error);
    } finally {
      dispatch(setIsCheckingAuth(false));
    }
  };
  useEffect(() => {
    console.log("bạn đang trong useEffect customeRoute");
    checkAuth();
  }, []);
  console.log("bạn đang trong customeRoute");

  let route = useRoutes([
    {
      path: "/",
      element: isAuth ? <HomeTemplate /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "user-infor",
          element: <UserInformation />,
        },
        {
          path: "control-devices",
          element: <ControlDevices />,
        },
      ],
    },
    {
      path: "/login",
      element: !isAuth ? <Login /> : <Navigate to={"/"} />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/statistics",
      element: <Statistics />,
    },
    {
      path: "/temperature-details",
      element: <TemperatureDetails />,
    },
    {
      path: "/humidity-details",
      element: <HumidityDetails />,
    },
    {
      path: "/light-intensity-details",
      element: <LightIntensityDetails />,
    },

    {
      path: "/scheduler",
      element: <Scheduler />,
    },
  ]);
  if (isCheckingAuth) {
    // 👇 tạm render gì đó nhẹ nhàng trong lúc chờ
    return <HomeTemplate />;
  }
  return route;
};

export default customRoute;
