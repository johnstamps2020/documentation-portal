import "./App.css";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Link to="/live-there/befriend-fish">Go into the water</Link>,
    },
    {
      path: "/*",
      element: <LandingPage />,
    },
  ],
  { basename: "/landing" }
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
