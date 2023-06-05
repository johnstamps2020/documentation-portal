import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React from 'react';
import styles from './Explore.module.css';

export type ExplorationItemProps = {
  title: string;
  description: string;
  link: string;
  subItems?: ExplorationItemProps[];
};

export default function ExplorationItem({
  title,
  description,
  link,
  subItems,
  handleSetItems,
}: ExplorationItemProps & {
  handleSetItems: (newItems: ExplorationItemProps[]) => void;
}) {
  function handleClick() {
    handleSetItems(subItems);
  }

  return (
    <Link
      className={clsx(styles.item, 'card')}
      to={subItems ? undefined : link}
      onClick={subItems ? handleClick : undefined}
    >
      <h3>
        {subItems ? undefined : `🔗 `}
        {title}
      </h3>
      <div>{description}</div>
    </Link>
  );
}
