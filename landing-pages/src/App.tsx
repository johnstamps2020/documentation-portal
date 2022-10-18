import "./App.css";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage/UnauthorizedPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Link to="/live-there/befriend-fish">Go into the water</Link>,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
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
