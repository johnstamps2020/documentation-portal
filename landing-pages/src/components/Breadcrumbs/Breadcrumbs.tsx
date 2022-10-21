import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  id: string;
  label: string;
  link: string;
};

type BreadcrumbProps = {
  breadcrumbs: BreadcrumbItem[];
};

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbProps) {
  return (
    <Stack direction="row" divider={<ChevronRightIcon />} spacing={1}>
      {breadcrumbs.map(({ link, label, id }) => (
        <Link to={link} key={id}>
          {label}
        </Link>
      ))}
    </Stack>
  );
}
