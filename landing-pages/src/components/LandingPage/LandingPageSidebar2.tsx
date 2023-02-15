import Stack from "@mui/material/Stack";
import { Sidebar } from "server/dist/model/entity/Sidebar";
import { SidebarItem } from "server/dist/model/entity/SidebarItem";
import LandingPageItem2 from "./LandingPageItem2";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

export default function LandingPageSidebar(sidebar: Sidebar) {
  return (
    <Paper
      sx={{
        height: "fit-content",
        minHeight: "180px",
        minWidth: "270px",
        width: {
          sm: "fit-content",
          xs: "100%",
        },
        padding: "24px",
      }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
        {sidebar.label}
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        sx={{ spacing: 1, fontSize: "0.875rem", color: "black" }}
      >
        {sidebar.sidebarItems?.map((sidebarItem: SidebarItem) => (
          <LandingPageItem2 {...sidebarItem} key={sidebarItem.id} />
        ))}
      </Stack>
    </Paper>
  );
}
