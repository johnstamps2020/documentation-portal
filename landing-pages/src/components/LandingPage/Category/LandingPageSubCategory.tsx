import LandingPageItem from "../LandingPageItem";
import { SubCategory } from "@documentation-portal/dist/model/entity/SubCategory";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function LandingPageSubCategory(subCategory: SubCategory) {
  return (
    <Stack spacing={1}>
      <Typography variant="h3">{subCategory.label}</Typography>
      {subCategory.subCategoryItems.map(subCategoryItem => (
        <LandingPageItem {...subCategoryItem} key={subCategoryItem.id} />
      ))}
    </Stack>
  );
}
