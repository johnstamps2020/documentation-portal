import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function LoginOptions() {
  return (
    <Stack spacing={2}>
      <Tooltip
        title={
          <Typography>
            Use your Guidewire Cloud Platform account to access documentation
          </Typography>
        }
        placement="left"
        arrow
      >
        <Button href="/authorization-code" variant="contained" color="primary">
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
        <Button href="/customers-login" variant="contained" color="primary">
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
        <Button href="/partners-login" variant="contained" color="primary">
          Partner Community
        </Button>
      </Tooltip>
      <Button
        variant="outlined"
        color="primary"
        href="/authorization-code?idp=okta"
        sx={{ fontWeight: 600, border: 1 }}
      >
        Guidewire Employee
      </Button>
    </Stack>
  );
}
