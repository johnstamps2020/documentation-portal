import Box from "@mui/material/Box";
import ViewSwitcher from "./ViewSwitcher";

export default function ActionBar() {
    return (<Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ViewSwitcher />
      </Box>)
}