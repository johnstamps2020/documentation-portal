import Stack from "@mui/material/Stack";
import { Category } from "@documentation-portal/dist/model/entity/Category";
import LandingPageItem from "../LandingPageItems/LandingPageItem";
import LandingPageSubCategory from "./LandingPageSubCategory";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function LandingPageCategory(category: Category) {
  return (
    <Paper className="category-paper">
      <Typography variant="h2">{category.label}</Typography>
      <Stack>
        {category.categoryItems?.map(categoryItem => (
          <LandingPageItem {...categoryItem} key={categoryItem.id} />
        ))}
        {category.subCategories?.map(subCategory => (
          <div key={subCategory.id}>
            <LandingPageSubCategory {...subCategory} />
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
