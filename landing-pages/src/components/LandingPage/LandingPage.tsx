import { Link, useParams } from "react-router-dom";
import Layout from "../Layout/Layout";

export default function LandingPage() {
  const params = useParams();
  const pagePath = params["*"];

  return (
    <Layout title="Home">
      <Link to="/">home</Link>
      <h1>Welcome to Guidewire, we hope you can have fun here.</h1>
      <p>Selected path: {pagePath}</p>
    </Layout>
  );
}
