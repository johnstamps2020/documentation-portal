import { ProductFamilyItem } from "server/dist/model/entity/ProductFamilyItem";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPageProductFamily(
  productFamilyItem: ProductFamilyItem
) {
  return (
    <Paper
      sx={{
        height: "100px",
        width: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {productFamilyItem.pagePath ? (
        <Link
          component={RouterLink}
          to={`/${productFamilyItem.pagePath}`}
          sx={{
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          {productFamilyItem.label}
        </Link>
      ) : (
        <Link
          href={productFamilyItem.link || `/${productFamilyItem.doc?.url}`}
          sx={{
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          {productFamilyItem.label}
        </Link>
      )}
    </Paper>
  );
}
