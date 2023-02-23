import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

type LandingPageSelectorProps = {
  pageSelector: {};
  labelColor: string;
};

function sortPageSelectorItems(unsortedPageSelectorItems: {}[]) {
  // const isSemVerLabel = unsortedPageSelectorItems.some(
  //   i => i.label.search(/^([0-9]+\.[0-9]+\.[0-9]+)$/g) === 0
  // );
  // return isSemVerLabel
  //   ? unsortedPageSelectorItems
  //       .sort(function(a, b) {
  //         const labelA = a.label
  //           .split(".")
  //           .map(n => +n + 100000)
  //           .join(".");
  //         const labelB = b.label
  //           .split(".")
  //           .map(n => +n + 100000)
  //           .join(".");
  //         return labelA > labelB ? 1 : -1;
  //       })
  //       .reverse()
  //   : unsortedPageSelectorItems
  //       .sort((a, b) => (a.label > b.label ? 1 : -1))
  //       .reverse();
  return null;
}

export default function LandingPageSelector({
  pageSelector,
  labelColor
}: LandingPageSelectorProps) {
  const PageSelectorInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3)
    },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      border: "1px solid #ced4da",
      fontSize: "0.875rem",
      padding: "4px 12px",
      minWidth: "300px",
      textAlign: "left",
      marginLeft: 0,
      marginRight: "auto",
      width: "300px",
      backgroundColor: "white",
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        backgroundColor: "white"
      }
    }
  }));

  const navigate = useNavigate();
  const handleChange = (event: SelectChangeEvent) => {
    // const selectedItem = pageSelector.pageSelectorItems.find(
    //   i => i.label === event.target.value
    // );
    // if (!selectedItem) {
    //   return null;
    // }
    // const itemPage = selectedItem.page;
    // if (itemPage) {
    //   return navigate(`/${itemPage.path}`);
    // }
    // const itemLink = selectedItem.link;
    // const targetUrl = itemLink ? itemLink : `/${selectedItem.doc.url}`;
    // return (window.location.href = targetUrl);
    return null;
  };

  const sortedPageSelectorItems = sortPageSelectorItems([]);
  return (
    <FormControl
      variant="standard"
      sx={{
        marginTop: "10px",
        alignItems: "left",
        width: "300px"
      }}
    >
      <InputLabel
        id="page-selector-label"
        sx={{ color: labelColor, fontSize: 20, fontWeight: 400 }}
      >
        Dummy label
      </InputLabel>
      <Select
        labelId="page-selector-label"
        id="page-selector"
        key="dummy key"
        value="dummy value"
        onChange={handleChange}
        input={<PageSelectorInput />}
        renderValue={value => {
          return value;
        }}
        sx={{
          textAlign: "left",
          marginLeft: 0,
          marginRight: "auto",
          backgroundColor: "white",
          borderRadius: 4,
          width: "300px"
        }}
      ></Select>
    </FormControl>
  );
}
