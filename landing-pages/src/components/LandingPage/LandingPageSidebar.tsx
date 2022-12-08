import Stack from "@mui/material/Stack";
import { Sidebar } from "@documentation-portal/dist/model/entity/Sidebar";
import { SidebarItem } from "@documentation-portal/dist/model/entity/SidebarItem";
import LandingPageItem from "./LandingPageItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function LandingPageSidebar(sidebar: Sidebar) {
  return (
    <Paper
      sx={{
        height: "fit-content",
        padding: "24px"
      }}
    >
      <Typography variant="h2">{sidebar.label}</Typography>
      <Stack spacing={1}>
        {sidebar.sidebarItems?.map((sidebarItem: SidebarItem) => (
          <LandingPageItem {...sidebarItem} key={sidebarItem.id} />
        ))}
      </Stack>
    </Paper>
  );
}
