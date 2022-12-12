import { ProductFamilyItem } from "@documentation-portal/dist/model/entity/ProductFamilyItem";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";

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
        alignItems: "center"
      }}
    >
      <Link
        href={
          productFamilyItem.link ||
          productFamilyItem.doc?.url ||
          `/landing/${productFamilyItem.pagePath}`
        }
        sx={{
          fontSize: 20,
          fontWeight: 800
        }}
      >
        {productFamilyItem.label}
      </Link>
    </Paper>
  );
}
