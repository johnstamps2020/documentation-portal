import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function LoginOptions() {
  const query = new URLSearchParams(window.location.search);
  const redirectTo =
    query.get("redirectTo") ||
    window.location.href.replace(window.location.origin, "");
  const cloudLoginHref = `/authorization-code?redirectTo=${redirectTo}`;
  const gwCommunityHref = `/customers-login?redirectTo=${redirectTo}`;
  const gwPartnerHref = `/partners-login?redirectTo=${redirectTo}`;
  const employeeLoginHref = `${cloudLoginHref}&idp=okta`;
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
        <Button href={cloudLoginHref} variant="contained" color="primary">
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
        <Button href={gwCommunityHref} variant="contained" color="primary">
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
        <Button href={gwPartnerHref} variant="contained" color="primary">
          Partner Community
        </Button>
      </Tooltip>
      <Button
        variant="outlined"
        color="primary"
        href={employeeLoginHref}
        sx={{ fontWeight: 600, border: 1 }}
      >
        Guidewire Employee
      </Button>
    </Stack>
  );
}
