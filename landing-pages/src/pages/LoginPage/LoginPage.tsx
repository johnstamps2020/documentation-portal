import Layout from "../../components/Layout/Layout";
import { ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { loginPageThemeOptions } from "../../themes/loginPageThemeOptions";
import Grid from "@mui/material/Unstable_Grid2";
import { createMergedTheme } from "../../themes/createMergedTheme";
import { landingPageTheme } from "../../themes/landingPageTheme";

export default function LoginPage() {
  return (
    <Layout
      title="Guidewire Documentation | Log in"
      searchBoxOptions={{ hideSearchBox: true }}
    >
      <ThemeProvider theme={landingPageTheme}>
        <ThemeProvider
          theme={theme => createMergedTheme(theme, loginPageThemeOptions)}
        >
          <CssBaseline enableColorScheme />
          <Grid container alignItems="center" sx={{ width: "100%" }}>
            <Grid
              lg={6}
              container
              sx={{
                background: "linear-gradient(to right, #324c76, #719fe8)",
                height: "100vh",
                padding: "2rem 1rem"
              }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="h1"
                sx={{ margin: 0, display: "block", width: "100%" }}
              >
                Welcome to Guidewire documentation
              </Typography>
              <img
                src="/images/login-hero.svg"
                alt=""
                style={{ maxWidth: "100%", padding: "0 1rem" }}
              />
            </Grid>
            <Grid
              lg={6}
              container
              alignItems="center"
              justifyContent="center"
              sx={{ padding: "2rem 1rem" }}
            >
              <Typography variant="h2" sx={{ width: "100%" }}>
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
                  margin: 2,
                  width: "fit-content"
                }}
              >
                <Typography variant="h2" sx={{ marginBottom: "8px" }}>
                  To view complete documentation, log in to your account
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
                      Guidewire Cloud
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
                      Customer Community
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
                      Partner Community
                    </Button>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    color="primary"
                    href="/authorization-code?idp=okta"
                    fullWidth
                    sx={{ marginTop: 4, fontWeight: 600, border: 1 }}
                  >
                    Guidewire Employee
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </ThemeProvider>
      </ThemeProvider>
    </Layout>
  );
}
