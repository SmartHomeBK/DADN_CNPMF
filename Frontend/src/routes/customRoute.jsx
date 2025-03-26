import { useRoutes } from "react-router-dom";
import Login from "../pages/Login/Login.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";
import Statistics from "../pages/Statistics.jsx";
import TemperatureDetails from "../pages/TemperatureDetails.jsx";
import HumidityDetails from "../pages/HumidityDetails.jsx";
import LightIntensityDetails from "../pages/LightIntensityDetails.jsx";
import ControlDevices from "../pages/ControlDevices.jsx";
import Scheduler from "../pages/Scheduler.jsx";

const customRoute = () => {
  let route = useRoutes([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <Login />,
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
      path: "/control-devices",
      element: <ControlDevices />,
    },
    {
      path: "/scheduler",
      element: <Scheduler />,
    },
  ]);
  return route;
};

export default customRoute;
