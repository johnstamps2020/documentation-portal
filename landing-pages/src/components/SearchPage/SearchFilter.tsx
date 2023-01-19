import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { ServerSearchFilter } from "server/dist/types/serverSearch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearch } from "../../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from "./StyledSearchComponents";

type SearchFilterProps = {
  serverSearchFilter: ServerSearchFilter;
  expanded: boolean;
  onChange: (filterName: string, filterIsExpanded: boolean) => void;
};

export default function SearchFilter({
  serverSearchFilter,
  expanded,
  onChange,
}: SearchFilterProps) {
  const { searchData } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  function handleAccordionExpandCollapse(
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) {
    onChange(serverSearchFilter.name, isExpanded);
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!searchData) {
      return null;
    }
    const filterValues = query.get(serverSearchFilter.name)?.split(",") || [];
    if (event.target.checked) {
      filterValues.push(event.target.value);
    } else {
      filterValues.splice(filterValues.indexOf(event.target.value), 1);
    }
    const onlyNonEmptyFilterValues = filterValues.filter(Boolean);
    onlyNonEmptyFilterValues.length > 0
      ? query.set(serverSearchFilter.name, onlyNonEmptyFilterValues.join(","))
      : query.delete(serverSearchFilter.name);
    query.delete("page");
    navigate({
      pathname: `${location.pathname}`,
      search: query && `?${query.toString()}`,
    });
  }

  return (
    <StyledAccordion
      expanded={expanded}
      onChange={handleAccordionExpandCollapse}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="search-filter-panel-content"
        id="search-filter-panel-header"
      >
        {serverSearchFilter.name.replace("_", " ")}
        <Chip
          label={`${
            serverSearchFilter.values.filter((v) => v.checked).length
          }/${serverSearchFilter.values.length}`}
          size="small"
          variant="outlined"
          sx={{ marginLeft: "8px", border: "1px solid" }}
        />
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <FormGroup sx={{ gap: "8px" }}>
          {serverSearchFilter.values.map((value) => (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              key={value.label}
            >
              {(value.doc_count > 0 || value.checked) && (
                <FormControlLabel
                  disableTypography={true}
                  sx={{
                    marginRight: "8px",
                    fontSize: "0.85rem",
                  }}
                  control={
                    <Checkbox
                      checked={value.checked}
                      value={value.label}
                      onChange={handleCheckboxChange}
                      sx={{
                        height: "14px",
                      }}
                    />
                  }
                  label={value.label}
                />
              )}
              <Chip label={value.doc_count} size="small" variant="filled" />
            </Stack>
          ))}
        </FormGroup>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
