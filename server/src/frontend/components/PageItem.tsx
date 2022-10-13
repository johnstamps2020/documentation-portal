import React from 'react';
import LabelOrLink from './LabelOrLink';
import { LandingPageItem } from '../../model/entity/LandingPageItem';

type ItemProps = LandingPageItem & {
  deploymentEnv: string;
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
