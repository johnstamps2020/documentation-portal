import Link from "@mui/material/Link";
import { Item } from "@documentation-portal/dist/model/entity/Item";
import Stack from "@mui/material/Stack";
import internalLogo from "../../images/internal_document_icon.svg";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export default function LandingPageItem(item: Item) {
  const itemHref = item.link || item.doc?.url || `/landing/${item.pagePath}`;
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Link href={itemHref}>{item.label}</Link>
      {item.doc?.internal && (
        <Tooltip
          title={<Typography>Guidewire internal content</Typography>}
          placement="right"
          arrow
        >
          <img
            key={item.doc.id}
            src={internalLogo}
            alt="internal-document"
            height="20px"
            width="20px"
            style={{
              backgroundColor: "black",
              borderRadius: "50%"
            }}
          ></img>
        </Tooltip>
      )}
    </Stack>
  );
}
