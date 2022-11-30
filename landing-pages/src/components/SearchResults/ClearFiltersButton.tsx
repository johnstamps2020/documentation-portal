import Button from "@mui/material/Button";
import useClearFilters from "../../hooks/useClearFilters";

type ClearFilterButtonProps = {
  label: string;
  grouped?: boolean;
};

export default function ClearFilterButton({
  label,
  grouped = false
}: ClearFilterButtonProps) {
  const { clearFilters, noFiltersApplied } = useClearFilters();
  return grouped ? (
    <Button onClick={clearFilters} disabled={noFiltersApplied}>
      {label}
    </Button>
  ) : (
    <Button
      onClick={clearFilters}
      disabled={noFiltersApplied}
      sx={{ width: "fit-content", marginTop: 3 }}
    >
      {label}
    </Button>
  );
}
