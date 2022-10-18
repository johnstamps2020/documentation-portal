import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { mockConfig } from "./mockConfig";
import ErrorPage from "../ErrorPage/ErrorPage";
import Grid from "@mui/material/Unstable_Grid2";
import LandingPageItem from "../../components/LandingPageItem/LandingPageItem";

export default function LandingPage() {
  const params = useParams();
  const pagePathFromRouter = params["*"];
  const { title, pagePath, items } = mockConfig;

  if (pagePathFromRouter !== pagePath) {
    return (
      <ErrorPage
        code={404}
        message={
          <>
            Page not found <code>{pagePathFromRouter}</code>
          </>
        }
      />
    );
  }

  return (
    <Layout title={title}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <h1>{title}</h1>
        </Grid>
        {items.map((item) => (
          <Grid xs={12} md={6} lg={4}>
            <h2>{item.label}</h2>
            {item.items.map((subItem) => (
              <LandingPageItem {...subItem} />
            ))}
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}
