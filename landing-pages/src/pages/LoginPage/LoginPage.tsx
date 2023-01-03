import Layout from "../../components/Layout/Layout";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import LoginOptions from "../../components/LoginPage/LoginOptions";

export default function LoginPage() {
  return (
    <Layout
      title="Guidewire Documentation | Log in"
      headerOptions={{ hideSearchBox: true, hideUserProfile: true }}
    >
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
            sx={{
              margin: 0,
              display: "block",
              width: "100%",
              fontSize: 40,
              textAlign: "center",
              color: "white",
              fontWeight: 600
            }}
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
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.5rem",
              color: "hsl(216, 42%, 13%)",
              textAlign: "center",
              paddingBottom: "30px",
              width: "100%"
            }}
          >
            Browse through the{" "}
            <Link component={RouterLink} to="/apiReferences/elysian">
              latest API References
            </Link>
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
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "1.375rem",
                color: "hsl(216, 42%, 13%)",
                textAlign: "center",
                paddingBottom: "10px",
                marginBottom: "8px"
              }}
            >
              To view complete documentation, log in to your account
            </Typography>
            <LoginOptions />
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
