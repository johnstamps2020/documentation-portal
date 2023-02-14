import { PageSelector } from "server/dist/model/entity/PageSelector";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

type LandingPageSelectorProps = {
  pageSelector: PageSelector;
  labelColor: string;
};

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
    const selectedItem = pageSelector.pageSelectorItems.find(
      i => i.label === event.target.value
    );
    const pageUrl =
      selectedItem?.page.path || selectedItem?.link || selectedItem?.doc?.url;
    return pageUrl ? navigate(`/${pageUrl}`) : navigate("#");
  };
  const sortedPageSelectorItems = pageSelector.pageSelectorItems
    .sort((a, b) => (a.label > b.label ? 1 : -1))
    .reverse();
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
        {pageSelector.label}
      </InputLabel>
      <Select
        labelId="page-selector-label"
        id="page-selector"
        key={pageSelector.label.toLowerCase()}
        value={pageSelector.selectedItemLabel}
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
      >
        {sortedPageSelectorItems.map(item => (
          <MenuItem
            disabled={item.label === pageSelector.selectedItemLabel}
            value={item.label}
            key={item.label}
            sx={{ fontSize: "0.875rem" }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
