import useClearFilters from "../../hooks/useClearFilters";
import { StyledButton } from "./StyledSearchComponents";

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
    <StyledButton onClick={clearFilters} disabled={noFiltersApplied}>
      {label}
    </StyledButton>
  ) : (
    <StyledButton
      onClick={clearFilters}
      disabled={noFiltersApplied}
      sx={{ width: "fit-content", marginTop: 3 }}
    >
      {label}
    </StyledButton>
  );
}
