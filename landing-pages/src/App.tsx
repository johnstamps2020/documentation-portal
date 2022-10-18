import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage/UnauthorizedPage";
import FourOhFourPage from "./pages/FourOhFourPage/FourOhFourPage";

const router = createBrowserRouter(
  [
    {
      path: "/",

      element: <Navigate to="/cloudProducts/elysian" />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "/404",
      element: <FourOhFourPage />,
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
