import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

type LandingPageItemProps = {
  label?: string;
  page?: string;
  id?: string;
  link?: string;
  items?: LandingPageItemProps[];
};

export default function LandingPageItem({
  label,
  id,
  page,
  link,
  items,
}: LandingPageItemProps) {
  return (
    <Stack spacing={2}>
      {link || id || page ? (
        <Link to={link || id || page || "#"}>{label}</Link>
      ) : (
        <div>
          <strong>{label}</strong>
        </div>
      )}
      {items?.map((item) => (
        <Stack>
          <LandingPageItem {...item} />
        </Stack>
      ))}
    </Stack>
  );
}
