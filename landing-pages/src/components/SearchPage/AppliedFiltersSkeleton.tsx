import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function AppliedFiltersSkeleton() {
  return (
    <Stack direction="row" spacing={1}>
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '110px', xs: '100%' },
          height: '24px',
        }}
      />
      <Skeleton
        variant="circular"
        sx={{
          width: { sm: '45px', xs: '100%' },
          height: '24px',
        }}
      />
    </Stack>
  );
}
