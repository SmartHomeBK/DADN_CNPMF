import { useState } from "react";
import customRoute from "./routes/customRoute.jsx";
import { Toaster } from "react-hot-toast";
function App() {
  const [count, setCount] = useState(0);
  const routes = customRoute();
  return (
    <div>
      {routes}
      <Toaster />
    </div>
  );
}

export default App;
