import Stack from "@mui/material/Stack";
import { Sidebar } from "server/dist/model/entity/Sidebar";
import { SidebarItem } from "server/dist/model/entity/SidebarItem";
import LandingPageItem from "./LandingPageItem";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function LandingPageSidebar(sidebar: Sidebar) {
  return (
    <Paper
      sx={{
        height: "fit-content",
        padding: "24px",
      }}
    >
      <Typography variant="h2">{sidebar.label}</Typography>
      <Divider sx={{ width: 0 }} />
      <Stack spacing={1}>
        {sidebar.sidebarItems?.map((sidebarItem: SidebarItem) => (
          <LandingPageItem {...sidebarItem} key={sidebarItem.id} />
        ))}
      </Stack>
    </Paper>
  );
}
