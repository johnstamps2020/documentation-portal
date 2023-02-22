import Button from "@mui/material/Button";
type FiltersButtonProps = {
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function FiltersButton({ setShowFilters }: FiltersButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={() => setShowFilters(true)}
      sx={{ width: "100%" }}
    >
      Show filters
    </Button>
  );
}
