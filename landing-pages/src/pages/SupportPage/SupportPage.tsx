import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Layout from "../../components/Layout/Layout";
import { headerHeight } from "../../components/Layout/Header/Header";

export default function SupportPage() {
  return (
    <Layout title="Support" headerOptions={{ hideSearchBox: true }}>
      <Grid
        container
        sx={{
          minHeight: `calc(100vh - ${headerHeight})`,
          background: "linear-gradient(135deg, white, lightblue)",
          padding: "2rem"
        }}
      >
        <Box
          sx={{
            background: "white",
            border: "1px solid gray",
            maxWidth: "1024px",
            height: "fit-content",
            boxShadow: "10px 5px 12px rgba(0, 0, 0, 0.3)",
            margin: "auto",
            padding: "4rem 3rem"
          }}
        >
          <Stack spacing={6}>
            <Typography variant="h1" sx={{ color: "black" }}>
              Legal and support information
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h2" sx={{ color: "black" }}>
                Legal
              </Typography>
              <Typography>
                Some offerings may require additional licensing. To determine
                whether your license agreement includes a specific offering,
                contact your Guidewire sales representative. Offerings may vary
                depending on geographic location. To determine whether a
                specific offering is available in your geographic location,
                contact your Guidewire sales representative.
              </Typography>
              <Link
                href="https://www.guidewire.com/legal-notices"
                target="_blank"
              >
                Legal notices
              </Link>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="h2" sx={{ color: "black" }}>
                Support
              </Typography>
              <Typography>
                For assistance, visit the Guidewire Community.
              </Typography>
              <Link href="https://community.guidewire.com" target="_blank">
                Guidewire customers
              </Link>
              <Link href="https://partner.guidewire.com" target="_blank">
                Guidewire partners
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Layout>
  );
}
