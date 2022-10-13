import { PageSelector } from "@documentation-portal/dist/model/entity/PageSelector";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import React from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

export default function LandingPageSelector(pageSelector: PageSelector) {
  const PageSelectorInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3)
    },
    "& .MuiInputBase-input": {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: "0.875rem",
      padding: "4px 12px",
      minWidth: "300px",
      textAlign: "left",
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
      }
    }
  }));

  const navigate = useNavigate();
  const handleChange = (event: SelectChangeEvent) => {
    return navigate(`/${event.target.value}`);
  };
  const sortedPageSelectorItems = pageSelector.pageSelectorItems
    .sort((a, b) => (a.label > b.label ? 1 : -1))
    .reverse();
  return (
    <FormControl variant="standard" sx={{ width: "300px" }}>
      <InputLabel id="page-selector-label" sx={{ color: "white" }}>
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
      >
        {sortedPageSelectorItems.map(item => (
          <MenuItem
            disabled={item.label === pageSelector.selectedItemLabel}
            value={item.link || item.doc?.url || item.pagePath}
            key={pageSelector.pageSelectorItems.indexOf(item)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
