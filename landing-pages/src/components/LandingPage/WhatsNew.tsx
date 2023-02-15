import { Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import flaineBadge from "../../images/badge-flaine.svg";
import garmischBadge from "../../images/badge-garmisch.svg";

type WhatsNewProps = {
  path?: string;
};

export default function WhatsNew({ path }: WhatsNewProps) {
  const contentFlaine = [
    "Advanced Product Designer app (APD)",
    "Submission Intake for InsuranceSuite",
    "App Events for event-based integration",
    "Community-powered machine learning",
    "Automated updates to latest release",
    "Cloud API enhancements",
    "Early access to Jutro Digital Platform",
    "Expanded Guidewire GO content",
    "Advanced monitoring and observability",
  ];
  const releaseInfo = { label: "", badge: "", href: "" };
  if (path?.includes("flaine")) {
    releaseInfo.label = "Flaine";
    releaseInfo.badge = flaineBadge;
    releaseInfo.href = "/cloud/flaine/whatsnew";
  } else if (path?.includes("garmisch")) {
    releaseInfo.label = "Garmisch";
    releaseInfo.badge = garmischBadge;
    releaseInfo.href = "/cloud/garmisch/whatsnew";
  }
  return (
    <Paper
      sx={{
        width: "300px",
        marginTop: "1.5rem",
        padding: "24px",
        gap: "8px",
      }}
    >
      <Stack>
        {releaseInfo.badge && (
          <img
            src={releaseInfo.badge}
            alt="Release logo"
            aria-label="Release logo"
            style={{
              width: "160px",
              height: "160px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1.5rem",
            }}
          ></img>
        )}
        <Typography
          variant="h2"
          style={{
            margin: "0 auto 0.25rem auto",
            fontSize: "1.25rem",
            fontWeight: 600,
            paddingBottom: "0.5rem",
          }}
        >
          What's new in {releaseInfo.label}
        </Typography>
        <Typography
          variant="h3"
          style={{
            color: "hsl(196, 100%, 31%)",
            fontSize: "0.875rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {releaseInfo.label} introduces the following key features and
          capabilities:
        </Typography>
        {contentFlaine && (
          <ul
            style={{
              fontSize: ".875rem",
              marginLeft: "1rem",
              marginBlockStart: "1em",
              marginBlockEnd: "1em",
              marginInlineStart: "0px",
              marginInlineEnd: "0px",
              paddingInlineStart: "20px",
            }}
          >
            {contentFlaine.map((feature) => {
              return (
                <li style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                  {feature}
                </li>
              );
            })}
          </ul>
        )}
        <Button
          href={releaseInfo.href}
          variant="contained"
          style={{
            width: "110px",
            margin: "10px auto 10px auto",
            padding: "4px",
          }}
        >
          Learn more
        </Button>
      </Stack>
    </Paper>
  );
}
