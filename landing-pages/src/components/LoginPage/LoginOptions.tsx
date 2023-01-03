import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function LoginOptions() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "fit-content"
      }}
    >
      <Tooltip
        title={
          <Typography>
            Use your Guidewire Cloud Platform account to access documentation
          </Typography>
        }
        placement="left"
        arrow
      >
        <Button
          href="/authorization-code"
          variant="contained"
          color="primary"
          fullWidth
        >
          Guidewire Cloud
        </Button>
      </Tooltip>
      <Tooltip
        title={
          <Typography>
            Use your community.guidewire.com account to access documentation
          </Typography>
        }
        placement="left"
        arrow
      >
        <Button
          href="/customers-login"
          variant="contained"
          color="primary"
          fullWidth
        >
          Customer Community
        </Button>
      </Tooltip>
      <Tooltip
        title={
          <Typography>
            Use your partner.guidewire.com account to access documentation
          </Typography>
        }
        placement="left"
        arrow
      >
        <Button
          href="/partners-login"
          variant="contained"
          color="primary"
          fullWidth
        >
          Partner Community
        </Button>
      </Tooltip>
      <Button
        variant="outlined"
        color="primary"
        href="/authorization-code?idp=okta"
        fullWidth
        sx={{ marginTop: 4, fontWeight: 600, border: 1 }}
      >
        Guidewire Employee
      </Button>
    </Box>
  );
}
