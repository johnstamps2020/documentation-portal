import React from 'react';
import LabelOrLink from './LabelOrLink';
import { PageItem as Item } from '../../model/entity/PageItem';
import { Environment } from '../../types/environment';

type ItemProps = Item & {
  deploymentEnv: Environment;
};

export default function PageItem(props: ItemProps) {
  const { env, deploymentEnv, label, class: className, items } = props;
  if (env && !env.includes(deploymentEnv)) {
    return null;
  }

  return (
    <div className={className}>
      <LabelOrLink {...props} />
      {items &&
        items.map((item, key) => (
          <PageItem {...item} key={key} deploymentEnv={deploymentEnv} />
        ))}
    </div>
  );
}
