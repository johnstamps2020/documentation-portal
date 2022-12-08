import Chip from "@mui/material/Chip";
import { useSearch } from "../../context/SearchContext";
import { ServerSearchFilter } from "@documentation-portal/dist/types/serverSearch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export default function AppliedFilters() {
  const { searchData } = useSearch();
  if (!searchData) {
    return null;
  }
  const checkedFilters = searchData.filters
    .map(f => {
      const checkedValues = f.values.filter(v => v.checked);
      if (checkedValues.length > 0) {
        return {
          ...f,
          values: checkedValues
        };
      }
    })
    .filter(Boolean) as ServerSearchFilter[];

  const ListItem = styled("li")(() => ({
    margin: "0 4px 6px 0"
  }));

  return (
    <Stack direction="row" spacing={1}>
      <Typography sx={{ padding: 0, minWidth: "110px" }}>
        Applied filters:
      </Typography>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0,
          m: 0
        }}
        component="ul"
        elevation={0}
      >
        {checkedFilters.length > 0 ? (
          checkedFilters.map(f =>
            f.values.map(v => (
              <ListItem key={v.label}>
                <Chip size="small" label={v.label} color="primary" />
              </ListItem>
            ))
          )
        ) : (
          <ListItem key="none">
            <Chip size="small" label="None" color="primary" />
          </ListItem>
        )}
      </Paper>
    </Stack>
  );
}
