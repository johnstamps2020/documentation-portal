import Layout from "../../components/Layout/Layout";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { landingPageTheme } from "../../themes/landingPageTheme";

export default function LoginPage() {
  return (
    <Layout title="Guidewire Documentation | Log in" hideSearchBox>
      <ThemeProvider theme={landingPageTheme}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          height="100vh"
          width="100%"
        >
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              background: "linear-gradient(to right, #324c76, #719fe8)",
              minWidth: "50%",
              padding: "0 48px",
              height: "100vh"
            }}
            spacing={7}
          >
            <Typography variant="h1" sx={{ margin: 0, display: "block" }}>
              Welcome to Guidewire documentation
            </Typography>
            <img src="/images/login-hero.svg" />
          </Stack>
          <Stack
            direction="column"
            alignItems="center"
            sx={{ minWidth: "50%" }}
            spacing={6}
          >
            <Typography variant="h2">
              Browse through the{" "}
              <Link href="/apiReferences">latest API References</Link>
            </Typography>
            <Paper
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: 4,
                width: "fit-content"
              }}
            >
              <Typography variant="h2" sx={{ marginBottom: "8px" }}>
                Log in to view complete documentation
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "fit-content"
                }}
              >
                <Tooltip
                  title={
                    <Typography>
                      Use your Guidewire Cloud Platform account to access
                      documentation
                    </Typography>
                  }
                  placement="left"
                  arrow
                >
                  <Button
                    href="/authorization-code"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Guidewire Cloud Account Login
                  </Button>
                </Tooltip>
                <Tooltip
                  title={
                    <Typography>
                      Use your community.guidewire.com account to access
                      documentation
                    </Typography>
                  }
                  placement="left"
                  arrow
                >
                  <Button
                    href="/customers-login"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Customer Community Account Login
                  </Button>
                </Tooltip>
                <Tooltip
                  title={
                    <Typography>
                      Use your partner.guidewire.com account to access
                      documentation
                    </Typography>
                  }
                  placement="left"
                  arrow
                >
                  <Button
                    href="/partners-login"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Partner Community Account Login
                  </Button>
                </Tooltip>
                <Button
                  variant="outlined"
                  color="primary"
                  href="/authorization-code?idp=okta"
                  fullWidth
                  sx={{ marginTop: 4, fontWeight: 600, border: 1 }}
                >
                  Guidewire Employee login
                </Button>
              </Box>
            </Paper>
          </Stack>
        </Stack>
      </ThemeProvider>
    </Layout>
  );
}
