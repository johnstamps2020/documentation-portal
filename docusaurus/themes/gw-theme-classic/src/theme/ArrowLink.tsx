import React from 'react';
import Link, { Props } from '@docusaurus/Link';

export default function ArrowLink({
  children,
  ...otherProps
}: Props): JSX.Element {
  return <Link {...otherProps}>{children} →</Link>;
}
