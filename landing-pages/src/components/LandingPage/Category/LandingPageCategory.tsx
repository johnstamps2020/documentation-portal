import Stack from "@mui/material/Stack";
import { Category } from "server/dist/model/entity/Category";
import LandingPageItem from "../LandingPageItem";
import LandingPageSubCategory from "./LandingPageSubCategory";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function LandingPageCategory(category: Category) {
  return (
    <Paper
      sx={{
        width: "300px",
        padding: "24px",
      }}
    >
      <Typography variant="h2">{category.label}</Typography>
      <Divider sx={{width: 0}}/>
      <Stack spacing={1}>
        {category.categoryItems?.map((categoryItem) => (
          <LandingPageItem {...categoryItem} key={categoryItem.id} />
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
