import Skeleton from '@mui/material/Skeleton';

export default function SidebarSkeleton() {
    return (
        <Skeleton
            variant="rectangular"
            sx={{ width: '270px', height: '180px' }}
        />
    )
}