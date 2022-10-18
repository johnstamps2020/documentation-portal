import { Link, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { mockConfig } from "./mockConfig";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Card from "@mui/material/Card";
import ErrorPage from "../ErrorPage/ErrorPage";

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
      <h1>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", fontSize: "80%" }}>
        <div>You are here: {pagePathFromRouter} </div>
        <div>
          {pagePathFromRouter === pagePath ? (
            <DoneIcon fontSize="small" />
          ) : (
            <CloseIcon fontSize="small" />
          )}
        </div>
      </div>
      <div>
        {items.map((item) => (
          <Card>
            <h2>{item.label}</h2>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
