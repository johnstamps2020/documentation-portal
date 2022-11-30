import Stack from "@mui/material/Stack";
import { Sidebar } from "@documentation-portal/dist/model/entity/Sidebar";
import { SidebarItem } from "@documentation-portal/dist/model/entity/SidebarItem";
import LandingPageItem from "../LandingPageItems/LandingPageItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { landingPageTheme } from "../../themes/landingPageTheme";

export default function LandingPageSidebar(sidebar: Sidebar) {
  const MuiPaperProps = {
    ...landingPageTheme.components?.MuiPaper?.defaultProps?.sx,
    ...{ marginBottom: "auto" },
  };
  return (
    <Paper sx={MuiPaperProps}>
      <Typography variant="h2">{sidebar.label}</Typography>
      <Stack>
        {sidebar.sidebarItems?.map((sidebarItem: SidebarItem) => (
          <LandingPageItem {...sidebarItem} key={sidebarItem.id} />
        ))}
      </Stack>
    </Paper>
  );
}
