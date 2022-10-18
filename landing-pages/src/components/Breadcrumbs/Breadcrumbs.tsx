import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { type } from "@testing-library/user-event/dist/type";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  link: string;
};

type BreadcrumbProps = {
  breadcrumbs: BreadcrumbItem[];
};

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbProps) {
  return (
    <Stack direction="row" divider={<ChevronRightIcon />} spacing={1}>
      {breadcrumbs.map(({ link, label }) => (
        <Link to={link}>{label}</Link>
      ))}
    </Stack>
  );
}
