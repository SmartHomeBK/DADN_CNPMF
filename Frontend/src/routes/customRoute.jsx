import { useRoutes } from "react-router-dom";
import Login from "../pages/Login/Login.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import SignUp from "../pages/SignUp/SignUp.jsx";

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
  ]);
  return route;
};

export default customRoute;
