import LandingPageItem from "../LandingPageItems/LandingPageItem";
import { SubCategory } from "@documentation-portal/dist/model/entity/SubCategory";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import { landingPageTheme } from "../../themes/landingPageTheme";
import { ThemeProvider } from "@mui/material";

export default function LandingPageSubCategory(subCategory: SubCategory) {
  return (
    <ThemeProvider theme={landingPageTheme}>
      <CssBaseline enableColorScheme />
      <Stack>
        <Typography variant="h3">{subCategory.label}</Typography>
        {subCategory.subCategoryItems.map(subCategoryItem => (
          <LandingPageItem {...subCategoryItem} key={subCategoryItem.id} />
        ))}
      </Stack>
    </ThemeProvider>
  );
}
