import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LandingPage from "./pages/LandingPage/LandingPage";
import ForbiddenPage from "./pages/ForbiddenPage/ForbiddenPage";
import FourOhFourPage from "./pages/FourOhFourPage/FourOhFourPage";
import DocAdminPage from "./pages/DocAdminPage/DocAdminPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { appTheme } from "./themes/appTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { UserProvider } from "./context/UserContext";
import SupportPage from "./pages/SupportPage/SupportPage";
import InternalPage from "./pages/InternalPage/InternalPage";

const router = createBrowserRouter(
  [
    {
      path: "/internal",
      element: <InternalPage />
    },
    {
      path: "/forbidden",
      element: <ForbiddenPage />
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
      path: "/support",
      element: <SupportPage />
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
    <UserProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
