import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./pages/LandingPage/LandingPage";
import UnauthorizedPage from "./pages/UnauthorizedPage/UnauthorizedPage";
import FourOhFourPage from "./pages/FourOhFourPage/FourOhFourPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00739d",
    },
    secondary: {
      main: "#3c4c5e",
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
