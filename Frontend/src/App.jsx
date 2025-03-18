import { useState } from "react";
import customRoute from "./routes/customRoute.jsx";

function App() {
  const [count, setCount] = useState(0);
  const routes = customRoute();
  return <div>{routes}</div>;
}

export default App;
