import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LandingPage from "./pages/LandingPage/LandingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage/UnauthorizedPage";
import FourOhFourPage from "./pages/FourOhFourPage/FourOhFourPage";
import DocAdminPage from "./pages/DocAdminPage/DocAdminPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { appTheme } from "./themes/appTheme";
import CssBaseline from "@mui/material/CssBaseline";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/cloudProducts/elysian" />
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />
    },
    {
      path: "/404",
      element: <FourOhFourPage />
    },
    {
      path: "/admin/doc",
      element: <DocAdminPage />
    },
    {
      path: "/search",
      element: <SearchPage />
    },
    {
      path: "/gw-login",
      element: <LoginPage />
    },
    {
      path: "/*",
      element: <LandingPage />
    }
  ],
  {
    basename: "/landing"
  }
);

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
