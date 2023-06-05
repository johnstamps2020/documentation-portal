import React, { useEffect, useState } from 'react';
import styles from './Explore.module.css';
import clsx from 'clsx';
import CloseButton from './CloseButton';
import ExplorationItem, { ExplorationItemProps } from './ExplorationItem';
import { explorationContent } from './items';
import BackButton from './BackButton';

type ExplorerProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function Explorer({ setIsOpen }: ExplorerProps) {
  const [items, setItems] =
    useState<ExplorationItemProps[]>(explorationContent);
  const [parentItems, setParentItems] = useState<ExplorationItemProps[][]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  function handleSetItems(newItems: ExplorationItemProps[]) {
    setParentItems((existingParentItems) => [...existingParentItems, items]);
    setItems(newItems);
  }

  function handleBack() {
    setItems(parentItems[parentItems.length - 1]);
    setParentItems((existingParentItems) => existingParentItems.slice(0, -1));
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className={styles.backdrop}>
      <div className={clsx(styles.content, 'container')}>
        <h2>
          {parentItems.length > 0 ? (
            <BackButton handleBack={handleBack} />
          ) : (
            <CloseButton handleClose={handleClose} />
          )}
        </h2>
        <div className={styles.items}>
          {items.map((item) => (
            <ExplorationItem
              {...item}
              handleSetItems={handleSetItems}
              key={item.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
