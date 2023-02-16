import Link from "@mui/material/Link";
import { Item } from "server/dist/model/entity/Item";
import Stack from "@mui/material/Stack";
import { Link as RouterLink } from "react-router-dom";
import InternalTooltip from "./InternalTooltip";

export default function LandingPageItem(item: Item) {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      {item.page ? (
        <Link component={RouterLink} to={`/${item.page.path}`}>
          {item.label}
        </Link>
      ) : (
        <Link href={item.link || `/${item.doc?.url}`}>{item.label}</Link>
      )}
      {(item.doc?.internal || item.page?.internal) && (
        <InternalTooltip {...item} />
      )}
    </Stack>
  );
}
