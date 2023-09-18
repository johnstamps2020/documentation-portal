import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  HeaderMenuLink,
  HeaderMenuLinkProps,
} from 'components/Layout/StyledLayoutComponents';

type ItemListMobileProps = {
  title: string;
  items: HeaderMenuLinkProps[];
};

export default function ItemListMobile({ title, items }: ItemListMobileProps) {
  return (
    <Stack gap={1.5}>
      <Typography sx={{ fontSize: '110%', fontWeight: 600 }}>
        {title}
      </Typography>
      {items.map(({ href, children, ...otherProps }) => (
        <HeaderMenuLink
          href={href}
          {...otherProps}
          disableReactRouter
          key={href}
        >
          {children}
        </HeaderMenuLink>
      ))}
    </Stack>
  );
}
