import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function TextSkeleton() {
  return <Skeleton variant="text" sx={{ width: '100%' }} />;
}

function SingleResultSkeleton() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        sx={{
          height: '33px',
          width: '230px',
          margin: '8px 0px 16px 0px',
        }}
      />
      <Stack direction="row">
        <Skeleton
          variant="circular"
          sx={{
            height: '24px',
            width: '70px',
            margin: '0px 4px 16px 0px',
          }}
        />
        <Skeleton
          variant="circular"
          sx={{
            height: '24px',
            width: '85px',
            margin: '0px 4px 16px 0px',
          }}
        />
        <Skeleton
          variant="circular"
          sx={{
            height: '24px',
            width: '50px',
            margin: '0px 4px 16px 0px',
          }}
        />
        <Skeleton
          variant="circular"
          sx={{
            height: '24px',
            width: '120px',
            margin: '0px 4px 16px 0px',
          }}
        />
      </Stack>
      {Array.from({ length: 4 }).map((nothing, idx) => (
        <TextSkeleton key={idx} />
      ))}
      <Skeleton
        variant="rectangular"
        sx={{
          height: '21px',
          width: '550px',
          margin: '32px 0px 44px 0px',
        }}
      />
    </>
  );
}

export default function ResultsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((nothing, idx) => (
        <SingleResultSkeleton key={idx} />
      ))}
    </>
  );
}
