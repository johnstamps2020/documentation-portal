import Stack from "@mui/material/Stack";
import { Category } from "server/dist/model/entity/Category";
import LandingPageItem2 from "../LandingPageItem2";
import LandingPageSubCategory from "./LandingPageSubCategory";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function LandingPageCategory2(category: Category) {
  return (
    <Paper
      sx={{
        width: { sm: "288px", xs: "100%" },
        padding: "24px",
      }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
        {category.label}
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        sx={{ spacing: 1, fontSize: "0.875rem", color: "black" }}
      >
        {category.categoryItems?.map((categoryItem) => (
          <LandingPageItem2 {...categoryItem} key={categoryItem.id} />
        ))}
        {category.subCategories?.map((subCategory) => (
          <div key={subCategory.id}>
            <LandingPageSubCategory {...subCategory} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
