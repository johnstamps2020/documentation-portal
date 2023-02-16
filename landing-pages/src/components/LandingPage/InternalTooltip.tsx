import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Item } from "server/dist/model/entity/Item";
import internalLogo from "../../images/internal_document_icon.svg";

export default function InternalTooltip(item: Item) {
  return (
    <Tooltip
      title={<Typography>Guidewire internal content</Typography>}
      placement="right"
      arrow
    >
      <img
        key={item.doc?.id || item.page?.title}
        src={internalLogo}
        alt="internal-document"
        height="20px"
        width="20px"
        style={{
          backgroundColor: "black",
          borderRadius: "50%",
        }}
      ></img>
    </Tooltip>
  );
}
