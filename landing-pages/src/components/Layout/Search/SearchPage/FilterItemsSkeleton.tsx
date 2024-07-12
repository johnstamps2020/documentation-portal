import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function FilterSubItemSkeleton() {
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        margin="8px 0px 0px 22px"
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: '120px', height: '20px' }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: '50px', height: '20px' }}
        />
      </Stack>
    </>
  );
}

function SingleFilterItemSkeleton() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        sx={{ width: '125px', height: '24px', m: '12px 0px 12px 0px' }}
      />
      {Array.from({ length: 4 }).map((nothing, idx) => (
        <FilterSubItemSkeleton key={idx} />
      ))}
    </>
  );
}

export default function FilterItemsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((nothing, idx) => (
        <SingleFilterItemSkeleton key={idx} />
      ))}
    </>
  );
}
