export const question =
  'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet';

export const answer = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec commodo lacus, ac pretium felis. Aliquam condimentum felis eget elit tempus consectetur. In imperdiet ullamcorper ex, in mollis diam hendrerit ac. Praesent efficitur, nisl vel malesuada feugiat, enim lectus egestas purus, sed condimentum nulla nulla eget metus. Praesent finibus nisi vitae elit luctus, a porttitor nulla lacinia. Proin ac viverra mauris. Vivamus ac odio quam. Nulla leo tortor, placerat ut mattis posuere, condimentum non tellus. Proin id consequat felis, in malesuada ante. Nullam risus justo, commodo eget convallis sed, auctor eget mi. Ut scelerisque ligula enim. Morbi ac massa in orci gravida gravida. Suspendisse condimentum, orci sit amet bibendum lacinia, nulla nunc efficitur tortor, non maximus elit nisi in est. Ut in lorem vel tortor blandit semper eget vitae magna. Pellentesque at maximus ex.

Sed auctor, nunc nec tincidunt tincidunt, nunc nunc tincidunt nunc, nec tincidunt nunc nunc nec nunc

- Nunc nec tincidunt tincidunt
- Nunc nunc tincidunt nunc
- Nec tincidunt nunc nunc nec nunc

Sed auctor, nunc nec tincidunt tincidunt, nunc nunc tincidunt nunc, nec tincidunt nunc nunc nec nunc.

The followiwng table is just an example[^1]

| Header One     | Header Two     | Header Three   |
| :------------- | :------------- | :------------- |
| Item One       | Item Two       | Item Three     |
| Item One       | Item Two       | Item Three     |
| Item One       | Item Two       | Item Three     |
| Item One       | Item Two       | Item Three     |

\`\`\`jsx
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity), // this line will overflow because it's very long. some would say it's the best line ever. and the longest one, for sure
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function ColorSwitches() {
  return (
    <div>
      <Switch {...label} defaultChecked />
      <Switch {...label} defaultChecked color="secondary" />
      <Switch {...label} defaultChecked color="warning" />
      <Switch {...label} defaultChecked color="default" />
      <PinkSwitch {...label} defaultChecked />
    </div>
  );
}
\`\`\`

Sed auctor, nunc nec tincidunt tincidunt, nunc nunc tincidunt nunc, nec tincidunt nunc nunc nec nunc.

## Tasklist

* [ ] eat breakfast
* [x] exercise
* [ ] eat lunch
* [ ] eat dinner
* [x] sleep

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

[^1]: The table examples is provided as-is. Any resemblance to actual tables, living or otherwise, is purely coincidental.`;
