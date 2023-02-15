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
        width: { xs: "100%", sm: "300px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {productFamilyItem.page?.path ? (
        <Link
          component={RouterLink}
          to={`/${productFamilyItem.page.path}`}
          sx={{
            fontSize: 20,
            fontWeight: 800
          }}
        >
          {productFamilyItem.label}
        </Link>
      ) : (
        <Link
          href={productFamilyItem.link || `/${productFamilyItem.doc?.url}`}
          sx={{
            fontSize: 20,
            fontWeight: 800
          }}
        >
          {productFamilyItem.label}
        </Link>
      )}
    </Paper>
  );
}
