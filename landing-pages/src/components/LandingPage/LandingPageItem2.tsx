import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import InternalTooltip from "./InternalTooltip";
import { Link as RouterLink } from "react-router-dom";
import { LandingPageItem } from "../../pages/LandingPage/LandingPage";
import { useLandingPageItemData } from "../../hooks/useLandingPageItemData";

export default function LandingPageItem2(item: LandingPageItem) {
  const { landingPageItemData, isError, isLoading } = useLandingPageItemData(
    item
  );
  if (isError || isLoading || !landingPageItemData) {
    return null;
  }

  const label =
    item.label || landingPageItemData.label || landingPageItemData.title;
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {landingPageItemData.path ? (
        <Link
          component={RouterLink}
          to={`/${landingPageItemData.path}`}
          sx={{ color: "black", fontWeight: 600, padding: "4px 0px" }}
        >
          {label}
        </Link>
      ) : (
        <Link
          href={landingPageItemData.url}
          sx={{ color: "black", fontWeight: 600, padding: "4px 0px" }}
        >
          {label}
        </Link>
      )}
      {landingPageItemData.internal && <InternalTooltip key={label} />}
    </Stack>
  );
}
